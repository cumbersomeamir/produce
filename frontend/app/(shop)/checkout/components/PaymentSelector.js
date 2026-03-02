"use client";

export default function PaymentSelector({ value, onChange, country = "India" }) {
  const domestic = country.toLowerCase() === "india";

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <button
        type="button"
        onClick={() => onChange(domestic ? "RAZORPAY" : "STRIPE")}
        className={`rounded-xl border px-3 py-2 text-left text-sm ${
          value === (domestic ? "RAZORPAY" : "STRIPE") ? "border-primary bg-primary/10" : "border-border"
        }`}
      >
        <p className="font-semibold">{domestic ? "Razorpay" : "Stripe"}</p>
        <p className="text-text-muted">{domestic ? "UPI, cards, wallets" : "Global cards and wallets"}</p>
      </button>
      {domestic ? (
        <button
          type="button"
          onClick={() => onChange("COD")}
          className={`rounded-xl border px-3 py-2 text-left text-sm ${
            value === "COD" ? "border-primary bg-primary/10" : "border-border"
          }`}
        >
          <p className="font-semibold">Cash on Delivery</p>
          <p className="text-text-muted">Available for select pincodes</p>
        </button>
      ) : null}
    </div>
  );
}
