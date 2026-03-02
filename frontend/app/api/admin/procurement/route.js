import { ok } from "@/lib/api";
import { listProducts } from "@/lib/runtime/catalog-store";
import { listOrders } from "@/lib/runtime/admin-store";

export async function GET() {
  const products = listProducts();
  const orders = listOrders();
  const lowStock = products.filter((product) => product.inventory <= product.lowStockThreshold).length;
  const shipped = orders.filter((order) => order.status === "SHIPPED").length;

  return ok({
    data: {
      activeCatalogItems: products.length,
      lowStockItems: lowStock,
      shippedOrders: shipped,
    },
  });
}
