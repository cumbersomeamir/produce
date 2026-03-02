import AuthProvider from "@/components/providers/AuthProvider";
import CartProvider from "@/components/providers/CartProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import ToastProvider from "@/components/providers/ToastProvider";

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          {children}
          <ToastProvider />
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
