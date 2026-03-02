import { ok } from "@/lib/api";
import { createProduct, listProducts } from "@/lib/runtime/catalog-store";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const query = searchParams.get("query");

  let list = listProducts();
  if (category) list = list.filter((product) => product.category === category);
  if (query) {
    const q = query.toLowerCase();
    list = list.filter((product) => product.name.toLowerCase().includes(q));
  }

  return ok({ data: list });
}

export async function POST(request) {
  const body = await request.json();
  const created = createProduct(body);
  return ok({ success: true, data: created }, { status: 201 });
}
