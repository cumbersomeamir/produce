"use client";

import { useEffect, useState } from "react";

const cities = ["Delhi", "Mumbai", "Bengaluru", "Pune", "Jaipur", "Kolkata", "Hyderabad"];

export default function PurchaseToast({ productName }) {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const city = cities[Math.floor(Math.random() * cities.length)];
      setToast({ city, id: Date.now() });
      setTimeout(() => setToast(null), 3500);
    }, 12000);

    return () => clearInterval(timer);
  }, []);

  if (!toast) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-xs rounded-xl border border-border bg-surface p-3 text-sm shadow-elevated">
      Someone in {toast.city} just bought {productName}
    </div>
  );
}
