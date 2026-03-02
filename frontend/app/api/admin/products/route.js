import { ok } from "@/lib/api";
import { createProduct, findProductById, listProducts, updateProduct } from "@/lib/runtime/catalog-store";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format");
  const id = searchParams.get("id");
  const products = listProducts();

  if (id) {
    const product = findProductById(id);
    return ok({ data: product });
  }

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
  const created = createProduct(body);
  return ok({ success: true, data: created }, { status: 201 });
}

export async function PUT(request) {
  const body = await request.json();
  const id = String(body?.id || "");
  if (!id) return ok({ success: false, message: "id is required" }, { status: 400 });

  const updated = updateProduct(id, body);
  if (!updated) return ok({ success: false, message: "Product not found" }, { status: 404 });
  return ok({ success: true, data: updated });
}
