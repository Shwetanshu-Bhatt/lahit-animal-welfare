import nodemailer from 'nodemailer';

let transporter = null;

export const isMailConfigured = () => {
  if (process.env.BREVO_API_KEY) return true;
  if (getSmtpConfig().host && getSmtpConfig().user && getSmtpConfig().pass) return true;
  if (getSmtpConfig().host && getSmtpConfig().port && !getSmtpConfig().user) return true;
  return false;
};

function getSmtpConfig() {
  return {
    host: process.env.SMTP_HOST || process.env.BREVO_SMTP_HOST,
    port: Number(process.env.SMTP_PORT || process.env.BREVO_SMTP_PORT || 587),
    user: process.env.SMTP_USER || process.env.BREVO_SMTP_USER,
    pass: process.env.SMTP_PASS || process.env.BREVO_SMTP_PASSWORD,
    secure: process.env.SMTP_SECURE === 'true' || process.env.BREVO_SMTP_SECURE === 'true',
  };
}

function getSender() {
  if (process.env.BREVO_SENDER_EMAIL) {
    return { email: process.env.BREVO_SENDER_EMAIL.trim(), name: process.env.BREVO_SENDER_NAME?.trim() || undefined };
  }
  const configured = process.env.SMTP_FROM || process.env.EMAIL_FROM || 'no-reply@lahit.org';
  const match = configured.match(/^(.*?)\s*<([^>]+)>$/);
  return match ? { email: match[2].trim(), name: match[1].trim() || undefined } : { email: configured.trim() };
}

function getTransporter() {
  if (transporter) return transporter;
  if (!isMailConfigured()) return null;
  const smtp = getSmtpConfig();
  transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: smtp.user ? { user: smtp.user, pass: smtp.pass } : undefined,
  });
  return transporter;
}

export async function sendMail({ to, subject, text, html }) {
  const sender = getSender();

  if (process.env.BREVO_API_KEY) {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'accept': 'application/json', 'api-key': process.env.BREVO_API_KEY, 'content-type': 'application/json' },
      body: JSON.stringify({ sender, to: [{ email: to }], subject, textContent: text, htmlContent: html }),
    });
    if (!response.ok) throw new Error(`Brevo email failed (${response.status}): ${await response.text()}`);
    return response.json();
  }

  const t = getTransporter();

  if (!t) {
    // No SMTP transport configured. In non-production this keeps flows testable by
    // logging the outgoing email; never throw (and never return the link) in production.
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[mailer] (no SMTP configured) would send to "${to}" — subject: "${subject}"`);
      return { dev: true, messageId: 'dev-pending-smtp' };
    }
    throw new Error('SMTP is not configured on the server.');
  }

  return await t.sendMail({ from: process.env.SMTP_FROM || process.env.EMAIL_FROM || sender.email, to, subject, text, html });
}
