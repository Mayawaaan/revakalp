import dns from "dns";
import nodemailer from "nodemailer";

try {
  dns.setDefaultResultOrder("ipv4first");
} catch {
  // Ignore on older Node runtimes
}

let cachedTransporter = null;
let cachedConfigKey = "";

const getTransporter = () => {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_EMAIL || process.env.EMAIL_USER || "";
  const pass = process.env.SMTP_PASSWORD || process.env.EMAIL_PASS || "";
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
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    auth: {
      user,
      pass,
    },
  });

  return cachedTransporter;
};

export const sendEmail = async (options) => {
  const transporter = getTransporter();
  const fromName = process.env.FROM_NAME || "Revakalp";
  const fromEmail =
    process.env.FROM_EMAIL || process.env.SMTP_EMAIL || process.env.EMAIL_USER;

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
  } catch (error) {
    // Reset cached transporter so next attempt establishes a fresh socket
    cachedTransporter = null;
    console.error("Email send error:", error?.message || error);
    throw error;
  }
};