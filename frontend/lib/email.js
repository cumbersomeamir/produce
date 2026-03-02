import nodemailer from "nodemailer";

let transporter;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST) return null;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

export async function sendTransactionalEmail({ to, subject, html, text }) {
  const transport = getTransporter();
  if (!transport) {
    return {
      success: true,
      mocked: true,
      message: "SMTP not configured. Email send mocked.",
    };
  }

  const result = await transport.sendMail({
    from: process.env.EMAIL_FROM || "hello@oddfinds.com",
    to,
    subject,
    html,
    text,
  });

  return { success: true, id: result.messageId };
}
