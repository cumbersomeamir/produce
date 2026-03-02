import { shippingZones } from "@/lib/mock-data";
import { createMetadata } from "@/lib/seo";
import { formatCurrency } from "@/lib/utils";

export function generateMetadata() {
  return createMetadata({
    title: "Shipping Policy",
    description: "Domestic and international shipping rates, delivery timelines, and tracking information for OddFinds.",
    path: "/shipping-policy",
  });
}

export default function ShippingPolicyPage() {
  return (
    <div className="container-main py-8">
      <h1 className="h1 text-secondary">Shipping Policy</h1>
      <p className="mt-2 text-text-muted">All orders are packed within 24 hours on business days. Tracking is shared after dispatch.</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-elevated">
            <tr>
              <th className="px-4 py-3">Zone</th>
              <th className="px-4 py-3">Base Rate</th>
              <th className="px-4 py-3">Estimated Delivery</th>
            </tr>
          </thead>
          <tbody>
            {shippingZones.map((zone) => (
              <tr key={zone.zone} className="border-t border-border">
                <td className="px-4 py-3">{zone.zone}</td>
                <td className="px-4 py-3">{formatCurrency(zone.baseRate)}</td>
                <td className="px-4 py-3">{zone.days} days</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
