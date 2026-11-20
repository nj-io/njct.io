"""Known-background matting for the hi-page loop: the alpha of the man (and the cup he moves) in every video frame,
and the composite of that frame onto the full-resolution plate.

Method (chosen 17 Nov 2026 over the thresholded difference matte and over RobustVideoMatting; see
work/review/README.md): the clip's own still frame is the exact background of every video pixel, so in the band
around the man each pixel is a mix I = a F + (1 - a) B with B known. The alpha is the size of the change relative to
the local foreground contrast, a = (|I - B| - n) / (|F - B| - n), with F the colour of the nearest solid-foreground
pixel and n the video's noise floor. Dark curls against the bright wall give a long, clean ramp; the alpha follows
each curl's silhouette instead of a thresholded blob. Deep inside the footprint (12 px in from the quarter-res
difference region) alpha is 1 regardless, so a white shirt or a cup against a same-coloured plate never goes see-through.

Before differencing, the still is corrected by a smooth per-frame drift field (the generated video's flicker and slow
glow, sampled where nothing moves), which lowers the noise floor in the band.

The composite is I + (1 - a)(P - B): the video pixel with its share of the video's wall swapped for the plate's, so
curl fringes keep their exact look from the video and the plate's texture and leaf shadows show through them. Where
alpha is near zero the video's own residual change is faded out, so the plate shows exactly.

Over the table top (OBJECT_ZONE, where the plate's cup sits and the video's cup, saucer and hand move) the alpha is
instead a hard threshold on the change, widened by 2 px: there the plate's crisp cup must be hidden completely wherever
the video shows something else, and no hair or leaf shadow is ever in that zone.
"""
import numpy as np
import cv2
import scipy.ndimage as ndi
from PIL import Image

S, DX, DY = 1.778, 84, 0                          # video pixel (u, v) -> plate (DX + S u, DY + S v)
W, H = 1024, 1536
VW, VH = round(480 * S), round(864 * S)           # 853 x 1536
Q = 4                                             # footprint resolution divisor
T_REGION = 13                                     # footprint threshold at quarter res (max over channels)
NOISE = 5.0                                       # video noise floor along the difference (L2 over channels)
SOLID_T = 30.0                                    # change above which a pixel is read as opaque foreground
DEEP = 12                                         # px inside the footprint edge where alpha is forced to 1
BAND = 10                                         # px outside the footprint still given an alpha
RAMP = 0.12                                       # alpha below which the video's residual change fades out
OBJECT_ZONE = (410, 1120, 650, 1280)              # plate x0, y0, x1, y1: the table top around the cup
CUP_RECTS = ((440, 1136, 606, 1240), (432, 1190, 632, 1256))   # the plate's cup (with handle) and its saucer
MAN_X0 = 400                                      # the man never crosses this plate x (he reaches 408 at the sip);
                                                  # left of it the laptop lid's sun stripe and the table stem drift
                                                  # in the generated clips (clip B, its first second), never him


def place(frame):
    """A 480x864 video frame on the plate canvas (RGB float32), with a validity mask."""
    up = frame.convert('RGB').resize((VW, VH), Image.LANCZOS)
    can = Image.new('RGB', (W, H)); can.paste(up, (DX, DY))
    valid = np.zeros((H, W), bool); valid[DY:DY + VH, DX:DX + VW] = True
    return np.asarray(can, np.float32), valid


def _norm_conv(vals, mask, sigma):
    m = mask.astype(np.float32)
    num = cv2.GaussianBlur(vals * m[..., None], (0, 0), sigma)
    den = cv2.GaussianBlur(m, (0, 0), sigma)[..., None]
    return num / np.maximum(den, 1e-3)


def drift_field(I, Bv, valid, sigma=24):
    """The frame's smooth departure from the still (flicker, slow glow), sampled where nothing moves."""
    bg = (np.abs(I - Bv).max(axis=2) < 8) & valid
    q = Q
    dq = cv2.resize(I - Bv, (W // q, H // q), interpolation=cv2.INTER_AREA)
    mq = cv2.resize(bg.astype(np.float32), (W // q, H // q), interpolation=cv2.INTER_AREA) > 0.99
    f = cv2.resize(_norm_conv(dq, mq, sigma / q), (W, H), interpolation=cv2.INTER_LINEAR)
    return np.where(valid[..., None], f, 0)


def _keep_big(mask, min_px):
    lab, n = ndi.label(mask)
    if not n:
        return mask
    sizes = ndi.sum(mask, lab, range(1, n + 1))
    return np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s >= min_px])


def _quarter(a):
    return cv2.GaussianBlur(cv2.resize(a, (W // Q, H // Q), interpolation=cv2.INTER_AREA), (0, 0), 1)


def footprint(I, B):
    """Quarter-res 'where does anything differ from the still' mask, closed, opened (drops the one-pixel drift
    lines on the laptop and table edges), specks dropped, holes filled; returned at full size."""
    d = np.abs(_quarter(I) - _quarter(B)).max(axis=2)
    m = ndi.binary_closing(d > T_REGION, iterations=2)
    m = ndi.binary_opening(m, iterations=2)
    m = ndi.binary_fill_holes(_keep_big(m, 60))
    return ndi.binary_fill_holes(cv2.resize(m.astype(np.float32), (W, H), interpolation=cv2.INTER_LINEAR) > 0.5)


def alpha_matte(I, Bv, valid):
    """Alpha (H x W float 0..1) of the frame I against the clip's still Bv. Also returns the drift-corrected still."""
    B = Bv + drift_field(I, Bv, valid)
    diff = I - B
    dm = cv2.GaussianBlur(np.sqrt((diff * diff).sum(axis=2)), (0, 0), 0.6)
    reg = footprint(I, B)
    outer = ndi.binary_dilation(reg, iterations=BAND) & valid
    solid = _keep_big(ndi.binary_opening((dm > SOLID_T) & reg, iterations=1), 200)
    core = ndi.binary_erosion(reg, iterations=DEEP) | ndi.binary_erosion(solid, iterations=4)
    # wall enclosed by the footprint (the gap between the raised arm and the body while he sips) is still the
    # still: carve sizeable unchanged patches out of the core so the plate and its leaf shade show there
    x0, y0, x1, y1 = OBJECT_ZONE
    unchanged = ndi.binary_opening(dm < 8, iterations=1) & ndi.binary_erosion(reg, iterations=4)
    unchanged[y0:y1, x0:x1] = False
    core &= ~ndi.binary_dilation(_keep_big(unchanged, 200), iterations=2)
    fsrc = core | ndi.binary_erosion(solid, iterations=3)
    if fsrc.any():
        _, idx = ndi.distance_transform_edt(~fsrc, return_indices=True)
        F = cv2.GaussianBlur(I[idx[0], idx[1]], (0, 0), 1.5)
    else:
        F = I
    fb = F - B
    c = np.sqrt((fb * fb).sum(axis=2))
    alpha = np.clip((dm - NOISE) / np.maximum(np.maximum(c, dm) - NOISE, 1.0), 0, 1)
    alpha = np.where(core, 1.0, alpha)
    alpha = np.where(outer, alpha, 0.0)
    # the plate's cup and saucer: hide them wherever the video shows something else, even outside the footprint
    # (the quarter-res opening drops the thin handle); the wall beside them keeps its soft alpha
    hard = np.zeros_like(alpha)
    for x0, y0, x1, y1 in CUP_RECTS:
        hard[y0:y1, x0:x1] = np.clip((dm[y0:y1, x0:x1] - 12) / 12, 0, 1)
    hard = cv2.dilate(hard, np.ones((5, 5), np.uint8)) * valid
    alpha = np.maximum(alpha, hard)
    alpha[:, :MAN_X0] = 0.0
    alpha = np.where(alpha < 0.04, 0.0, alpha)
    alpha = np.where(alpha > 0.97, 1.0, alpha)
    # noise specks: small islands that never get near opaque
    lab, n = ndi.label(alpha > 0)
    if n:
        peak = ndi.maximum(alpha, lab, range(1, n + 1)); size = ndi.sum(alpha > 0, lab, range(1, n + 1))
        drop = [i + 1 for i in range(n) if peak[i] < 0.3 and size[i] < 300]
        if drop:
            alpha[np.isin(lab, drop)] = 0.0
    return alpha.astype(np.float32), B


def colour_fit(video, plate, bg):
    """Per-channel gain and offset that take the video's colours to the plate's, fitted where nothing moves."""
    g = []
    for c in range(3):
        x = video[..., c][bg]; y = plate[..., c][bg]
        a, b = np.polyfit(x[::7], y[::7], 1); g.append((a, b))
    return g


def apply_fit(img, fit):
    return np.stack([np.clip(img[..., c] * fit[c][0] + fit[c][1], 0, 255) for c in range(3)], axis=2)


def composite(I, B, P, alpha, fit):
    """The video pixel with its share of the video's wall swapped for the plate's: I + (1 - a)(P - B), the video's
    residual change faded out below RAMP so the plate shows exactly where alpha is zero."""
    If, Bf = apply_fit(I, fit), apply_fit(B, fit)
    D = If - Bf; E = P - Bf
    a = alpha[..., None]; s = np.clip(a / RAMP, 0, 1)
    return np.clip(If + (1 - a) * E - (1 - s) * D, 0, 255)


def matte_frame(I, Bv, valid, P):
    """Alpha and composite of one placed frame against the clip's placed still and the plate."""
    alpha, B = alpha_matte(I, Bv, valid)
    bg = (alpha == 0) & valid & (np.abs(I - B).max(axis=2) < 8)
    fit = colour_fit(I, P, bg)
    return alpha, composite(I, B, P, alpha, fit), fit
