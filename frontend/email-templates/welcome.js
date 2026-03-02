import { withLayout } from "@/email-templates/base";

export default function welcomeEmail({ name = "there" }) {
  return withLayout({
    title: "Welcome to OddFinds",
    body: `<p>Hey ${name}, your account is live.</p><p>New drops land every Thursday. Get ready for premium weirdness.</p>`,
  });
}
