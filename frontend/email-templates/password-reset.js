import { withLayout } from "@/email-templates/base";

export default function passwordResetEmail({ resetLink }) {
  return withLayout({
    title: "Reset your password",
    body: `<p>Use the secure link below to reset your password.</p><p><a href="${resetLink}">Reset Password</a></p>`,
  });
}
