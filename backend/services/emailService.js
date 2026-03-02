import nodemailer from "nodemailer";
import { create as createEmailLog } from "../models/EmailLog.js";

let transporter;

function getTransport() {
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

export async function sendEmail({ to, subject, html = "", text = "", template = "custom", orderId = null }) {
  const transport = getTransport();

  if (!transport) {
    await createEmailLog({
      orderId,
      to,
      subject,
      template,
      status: "mocked",
    });

    return { success: true, mocked: true };
  }

  const result = await transport.sendMail({
    from: process.env.EMAIL_FROM || "hello@oddfinds.com",
    to,
    subject,
    html,
    text,
  });

  await createEmailLog({
    orderId,
    to,
    subject,
    template,
    status: "sent",
  });

  return { success: true, messageId: result.messageId };
}
