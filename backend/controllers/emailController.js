import { sendEmail } from "../services/emailService.js";

export async function sendTransactional(payload) {
  return sendEmail(payload);
}
