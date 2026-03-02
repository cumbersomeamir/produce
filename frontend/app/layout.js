import "@/app/globals.css";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import CartDrawer from "@/components/layout/CartDrawer";
import Footer from "@/components/layout/Footer";
import MobileMenu from "@/components/layout/MobileMenu";
import Navbar from "@/components/layout/Navbar";
import SearchOverlay from "@/components/layout/SearchOverlay";
import AppProviders from "@/components/providers/AppProviders";
import { SITE_NAME } from "@/lib/constants";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: `${SITE_NAME} — The Internet's Weirdest Store`,
  description:
    "Curated quirky products with premium shopping vibes. Discover viral-worthy finds at OddFinds.",
  path: "/",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <AnnouncementBar />
          <Navbar />
          <MobileMenu />
          <SearchOverlay />
          <CartDrawer />
          <main>{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
