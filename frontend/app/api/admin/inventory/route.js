import { ok } from "@/lib/api";
import { products } from "@/lib/mock-data";

export async function GET() {
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
  return ok({ success: true, updated: body });
}
