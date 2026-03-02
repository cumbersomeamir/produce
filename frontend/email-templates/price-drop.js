import { withLayout } from "@/email-templates/base";

export default function priceDropEmail({ productName, price }) {
  return withLayout({
    title: "Price Drop Alert",
    body: `<p>${productName} from your wishlist just dropped to ${price}.</p>`,
  });
}
