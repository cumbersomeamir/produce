import { sendEmail } from "../services/emailService.js";

export async function processEmailJob(payload) {
  return sendEmail(payload);
}
