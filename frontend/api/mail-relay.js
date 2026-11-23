import dns from "dns";
import nodemailer from "nodemailer";

try {
  dns.setDefaultResultOrder("ipv4first");
} catch {
  // Ignore if unsupported
}

/**
 * Vercel Serverless HTTPS-to-SMTP Relay (/api/mail-relay)
 * Allows the Render backend (where outbound TCP ports 25/465/587 are blocked
 * on Render's free tier) to dispatch transactional emails over HTTPS (port 443)
 * using the store's own Gmail SMTP credentials.
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const host = String(body.host || process.env.SMTP_HOST || "smtp.gmail.com").trim();
    const user = String(body.user || process.env.SMTP_EMAIL || "").trim();
    const pass = String(body.pass || process.env.SMTP_PASSWORD || "").trim();
    const fromName = String(body.fromName || process.env.FROM_NAME || "Revakalp").trim();
    const fromEmail = String(body.fromEmail || process.env.FROM_EMAIL || user).trim();
    const to = String(body.to || "").trim();
    const subject = String(body.subject || "").trim();
    const text = String(body.text || "");
    const html = body.html ? String(body.html) : undefined;

    if (!user || !pass || !to || !subject) {
      return res.status(400).json({ message: "Missing required email fields" });
    }

    // Restrict relay strictly to official Gmail SMTP host
    if (host !== "smtp.gmail.com" && host !== "smtp.googlemail.com") {
      return res.status(403).json({ message: "Unsupported SMTP host" });
    }

    const transporter = nodemailer.createTransport({
      host,
      port: 465,
      secure: true,
      family: 4,
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 12000,
      auth: {
        user,
        pass,
      },
    });

    const info = await transporter.sendMail({
      from: `${fromName} <${fromEmail}>`,
      to,
      subject,
      text,
      ...(html ? { html } : {}),
    });

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Vercel mail-relay error:", error?.message || error);
    return res.status(502).json({
      message: error?.message || "SMTP relay delivery failed",
    });
  }
}
