import { ok } from "@/lib/api";
import { products } from "@/lib/mock-data";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format");
  const header = "id,name,slug,price,inventory";
  const rows = products.map((product) =>
    [product.id, product.name, product.slug, product.price, product.inventory].join(","),
  );
  const csv = [header, ...rows].join("\n");

  if (format === "csv") {
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=products.csv",
      },
    });
  }

  return ok({ data: products, exportCsv: csv });
}

export async function POST(request) {
  const body = await request.json();
  return ok({ success: true, data: { id: `prod_${Date.now()}`, ...body } }, { status: 201 });
}
