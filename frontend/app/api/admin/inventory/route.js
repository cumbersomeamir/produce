import { ok } from "@/lib/api";
import { listProducts, updateProductInventory } from "@/lib/runtime/catalog-store";

export async function GET() {
  const products = listProducts();
  return ok({
    data: products.map((product) => ({
      id: product.id,
      name: product.name,
      quantity: product.inventory,
      lowStockThreshold: product.lowStockThreshold,
    })),
  });
}

export async function PATCH(request) {
  const body = await request.json();
  const id = String(body?.id || "");
  const quantity = Number(body?.quantity);
  if (!id || Number.isNaN(quantity)) {
    return ok({ success: false, message: "id and quantity are required." }, { status: 400 });
  }

  const updated = updateProductInventory(id, quantity);
  if (!updated) return ok({ success: false, message: "Product not found." }, { status: 404 });

  return ok({ success: true, updated });
}
