import dns from "dns";
import axios from "axios";
import nodemailer from "nodemailer";

try {
  dns.setDefaultResultOrder("ipv4first");
} catch {
  // Ignore on older Node runtimes
}

let cachedTransporter = null;
let cachedConfigKey = "";

const getSmtpConfig = () => {
  const host = String(process.env.SMTP_HOST || "smtp.gmail.com").trim();
  const port = Number(process.env.SMTP_PORT || 587);
  const user = String(
    process.env.SMTP_EMAIL || process.env.EMAIL_USER || ""
  ).trim();
  const pass = String(
    process.env.SMTP_PASSWORD || process.env.EMAIL_PASS || ""
  ).trim();
  const fromName = String(process.env.FROM_NAME || "Revakalp").trim();
  const fromEmail = String(
    process.env.FROM_EMAIL || user || "revakalp.official@gmail.com"
  ).trim();

  return { host, port, user, pass, fromName, fromEmail };
};

const getTransporter = () => {
  const { host, port, user, pass } = getSmtpConfig();
  const configKey = `${host}:${port}:${user}`;

  if (cachedTransporter && cachedConfigKey === configKey) {
    return cachedTransporter;
  }

  cachedConfigKey = configKey;
  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    pool: true,
    maxConnections: 3,
    maxMessages: 50,
    family: 4,
    lookup: (hostname, options, callback) => {
      dns.lookup(hostname, { ...options, family: 4 }, callback);
    },
    connectionTimeout: 6000,
    greetingTimeout: 6000,
    socketTimeout: 10000,
    auth: {
      user,
      pass,
    },
  });

  return cachedTransporter;
};

const getRelayUrls = () => {
  const urls = new Set();
  if (process.env.MAIL_RELAY_URL) {
    urls.add(process.env.MAIL_RELAY_URL.trim());
  }
  const candidates = [
    process.env.FRONTEND_URL,
    process.env.CLIENT_URL,
    ...(process.env.CORS_ORIGIN || "").split(","),
    "https://revakalp.vercel.app",
  ];
  for (const raw of candidates) {
    const cleaned = String(raw || "").trim().replace(/\/+$/, "");
    if (cleaned.startsWith("https://") && !cleaned.includes("localhost")) {
      urls.add(`${cleaned}/api/mail-relay`);
    }
  }
  return Array.from(urls);
};

const sendViaHttpsRelay = async (options) => {
  const { host, user, pass, fromName, fromEmail } = getSmtpConfig();
  const relayUrls = getRelayUrls();
  let lastError = null;

  for (const relayUrl of relayUrls) {
    try {
      const response = await axios.post(
        relayUrl,
        {
          host,
          user,
          pass,
          fromName,
          fromEmail,
          to: options.email,
          subject: options.subject,
          text: options.message,
          ...(options.html ? { html: options.html } : {}),
        },
        {
          timeout: 12000,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data?.success) {
        console.log("Email sent via HTTPS relay:", response.data.messageId);
        return response.data;
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("HTTPS email relay failed");
};

const isRenderHosted = () =>
  Boolean(
    process.env.RENDER ||
      process.env.RENDER_EXTERNAL_URL ||
      String(process.env.BACKEND_URL || "").includes("onrender.com")
  );

export const sendEmail = async (options) => {
  const { fromName, fromEmail } = getSmtpConfig();

  // On Render Free Tier, outbound TCP ports 25/465/587 are blocked by Render's firewall.
  // Use the HTTPS relay (port 443) first on Render, and fall back to direct SMTP if needed.
  if (isRenderHosted()) {
    try {
      return await sendViaHttpsRelay(options);
    } catch (relayError) {
      console.warn(
        "HTTPS mail relay failed on Render, attempting direct SMTP:",
        relayError?.message || relayError
      );
    }
  }

  const transporter = getTransporter();

  try {
    const message = {
      from: `${fromName} <${fromEmail}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      ...(options.html ? { html: options.html } : {}),
    };

    const info = await transporter.sendMail(message);
    console.log("Email sent:", info.messageId);
    return info;
  } catch (smtpError) {
    cachedTransporter = null;
    console.warn(
      "Direct SMTP failed, attempting HTTPS mail relay fallback:",
      smtpError?.message || smtpError
    );
    try {
      return await sendViaHttpsRelay(options);
    } catch {
      console.error("Email send error:", smtpError?.message || smtpError);
      throw smtpError;
    }
  }
};