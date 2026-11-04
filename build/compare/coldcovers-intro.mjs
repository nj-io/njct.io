// The intro's appearance time for sleeve i (ms after the first frame), from the scene's config.
const src = (await import('fs')).readFileSync(new URL('../../scene/config.js', import.meta.url), 'utf8');
const m = src.match(/appear:\s*\{\s*at:\s*([\d.]+),\s*stagger:\s*([\d.]+)/);
const AT = +m[1], STAGGER = +m[2];
export const INTRO_APPEAR = i => AT + STAGGER * i;
