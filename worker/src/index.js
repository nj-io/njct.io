// njct-contact — sends the njct.io "Get in touch" form to neil@njct.io.
// Brief: docs/plans/contact-worker-brief-2026-11-04.md. POST only, JSON {name, email, message,
// website, page?}. The `website` field is a honeypot: when filled the Worker answers 200 and
// sends nothing. Rate limit 5 per IP per hour. Sends through the send_email binding, so no key.
import { EmailMessage } from "cloudflare:email";
import MimeText from "mimetext";

const ALLOWED = (env.ALLOWED_ORIGIN || "").split(",").map((s) => s.trim()).filter(Boolean);
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;

const json = (status, body, origin) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      ...(origin ? { "access-control-allow-origin": origin } : {}),
    },
  });

function validate(d) {
  const name = String(d.name ?? "").trim();
  const email = String(d.email ?? "").trim();
  const message = String(d.message ?? "");
  const page = String(d.page ?? "").trim().slice(0, 300);
  if (name.length < 1 || name.length > 100) return null;
  if (email.length > 200 || !EMAIL_RE.test(email)) return null;
  if (message.length < 1 || message.length > 5000) return null;
  return { name, email, message, page };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("origin") || "";
    const allowed = ALLOWED.includes(origin) ? origin : null;

    // The dev origin (127.0.0.1:8750) is cross-origin, so its JSON POST preflights.
    if (request.method === "OPTIONS") {
      if (!allowed) return new Response(null, { status: 403 });
      return new Response(null, {
        status: 204,
        headers: {
          "access-control-allow-origin": allowed,
          "access-control-allow-methods": "POST, OPTIONS",
          "access-control-allow-headers": "content-type",
          "access-control-max-age": "86400",
        },
      });
    }
    if (request.method !== "POST") return json(405, { error: "method" }, allowed);
    if (!allowed) return json(403, { error: "origin" }, allowed);

    let data;
    try {
      data = await request.json();
    } catch {
      return json(400, { error: "invalid" }, allowed);
    }

    // Honeypot: answer like a success and send nothing.
    if (String(data.website ?? "").trim() !== "") return json(200, { ok: true }, allowed);

    const v = validate(data);
    if (!v) return json(400, { error: "invalid" }, allowed);

    const ip = request.headers.get("cf-connecting-ip") || "";
    // Two limits: the binding caps bursts exactly (5 a minute, its largest window); the KV counter
    // holds the hourly rule (5 an hour, first send starts the window). A KV write can fail (a key
    // accepts one write a second); then the send still goes out — the binding has already capped it.
    const { success } = await env.CONTACT_LIMITER.limit({ key: ip });
    if (!success) return json(429, { error: "rate" }, allowed);
    const k = `hour:${ip}`;
    const count = Number((await env.CONTACT.get(k)) || 0);
    if (count >= 5) return json(429, { error: "rate" }, allowed);
    await env.CONTACT.put(k, String(count + 1), { expirationTtl: 3600 }).catch(() => {});

    const mail = new MimeText();
    mail.setHeader("From", env.EMAIL_FROM);
    mail.setHeader("To", env.EMAIL_TO);
    mail.setHeader("Reply-To", `${v.name} <${v.email}>`);
    mail.setSubject(`njct.io: ${v.name}`);
    mail.setMessage(
      `${v.message}\n\n—\nName: ${v.name}\nEmail: ${v.email}\nSent from: ${v.page || "njct.io"}\n`
    );
    const message = new EmailMessage(env.EMAIL_FROM, env.EMAIL_TO, mail.asRaw());
    try {
      await env.CONTACT_MAIL.send(message);
    } catch (e) {
      console.error("send failed:", e?.message || e); // the error only, never the message body
      return json(502, { error: "send" }, allowed);
    }
    return json(200, { ok: true }, allowed);
  },
};
