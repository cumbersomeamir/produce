import { createMetadata } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { supplierId } = await params;
  return createMetadata({ title: `Supplier ${supplierId}`, description: "Supplier profile and communication timeline.", path: `/admin/procurement/suppliers/${supplierId}` });
}

export default async function SupplierDetailPage({ params }) {
  const { supplierId } = await params;

  return (
    <div className="space-y-4 text-white">
      <h1 className="font-heading text-3xl">Supplier {supplierId}</h1>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="font-semibold">Communication Thread</p>
        <div className="mt-3 space-y-2 text-sm text-white/80">
          <p>INBOUND: MOQ is 500 units.</p>
          <p>OUTBOUND: Requesting lower MOQ for trial batch.</p>
        </div>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="font-semibold">AI Negotiation Draft</p>
        <textarea rows={6} className="mt-2 w-full rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" defaultValue="Hello team, we're interested in a recurring order plan..." />
      </div>
    </div>
  );
}
