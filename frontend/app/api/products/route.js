import { products } from "@/lib/mock-data";
import { ok } from "@/lib/api";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const query = searchParams.get("query");

  let list = [...products];
  if (category) list = list.filter((product) => product.category === category);
  if (query) {
    const q = query.toLowerCase();
    list = list.filter((product) => product.name.toLowerCase().includes(q));
  }

  return ok({ data: list });
}

export async function POST(request) {
  const body = await request.json();
  return ok({ success: true, data: { id: `prod_${Date.now()}`, ...body } }, { status: 201 });
}
