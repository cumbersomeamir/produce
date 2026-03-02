"use client";

import { useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/Button";
import PaymentSelector from "@/app/(shop)/checkout/components/PaymentSelector";
import ShippingCalc from "@/app/(shop)/checkout/components/ShippingCalc";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  line1: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  country: z.string().min(2),
  postalCode: z.string().min(4),
  isGuest: z.boolean().default(true),
});

export default function CheckoutForm({ subtotal }) {
  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");
  const [success, setSuccess] = useState("");

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      line1: "",
      city: "",
      state: "",
      country: "India",
      postalCode: "",
      isGuest: true,
    },
  });

  const country = form.watch("country");
  const shippingRate = useMemo(
    () => (country.toLowerCase() === "india" && subtotal >= 999 ? 0 : country.toLowerCase() === "india" ? 79 : 899),
    [country, subtotal],
  );

  const onSubmit = async (values) => {
    setSuccess("");
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, paymentMethod }),
    });

    if (!response.ok) {
      setSuccess("Unable to place order right now. Please retry.");
      return;
    }

    const data = await response.json();
    setSuccess(`Order ${data.orderNumber} placed successfully.`);
    form.reset();
  };

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="rounded-2xl border border-border bg-surface p-4">
        <h2 className="font-heading text-xl text-secondary">Shipping Address</h2>
        <p className="mt-1 text-sm text-text-muted">Guest checkout is enabled by default.</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input placeholder="Full Name" className="rounded-xl border border-border px-3 py-2" {...form.register("name")} />
          <input placeholder="Email" className="rounded-xl border border-border px-3 py-2" {...form.register("email")} />
          <input placeholder="Phone" className="rounded-xl border border-border px-3 py-2" {...form.register("phone")} />
          <input placeholder="Pincode" className="rounded-xl border border-border px-3 py-2" {...form.register("postalCode")} />
        </div>
        <input
          placeholder="Address line 1"
          className="mt-3 w-full rounded-xl border border-border px-3 py-2"
          {...form.register("line1")}
        />
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <input placeholder="City" className="rounded-xl border border-border px-3 py-2" {...form.register("city")} />
          <input placeholder="State" className="rounded-xl border border-border px-3 py-2" {...form.register("state")} />
          <input placeholder="Country" className="rounded-xl border border-border px-3 py-2" {...form.register("country")} />
        </div>
      </div>

      <ShippingCalc country={country} subtotal={subtotal} weight={800} />

      <div className="rounded-2xl border border-border bg-surface p-4">
        <h2 className="font-heading text-xl text-secondary">Payment Method</h2>
        <div className="mt-3">
          <PaymentSelector value={paymentMethod} onChange={setPaymentMethod} country={country} />
        </div>
      </div>

      {success ? <p className="rounded-lg bg-success/10 px-3 py-2 text-sm text-success">{success}</p> : null}

      <Button type="submit" className="w-full" variant="secondary">
        Place Order
      </Button>

      <p className="text-xs text-text-muted">
        By placing your order, you agree to our terms and privacy policy.
      </p>
    </form>
  );
}
