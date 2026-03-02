import { ok } from "@/lib/api";
import { findOrder, listOrders, updateOrder } from "@/lib/runtime/admin-store";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format");
  const orderNumber = searchParams.get("orderNumber");
  const orders = listOrders();

  if (orderNumber) {
    return ok({ data: findOrder(orderNumber) });
  }

  if (format === "csv") {
    const header = "orderNumber,status,total";
    const rows = orders.map((order) => `${order.orderNumber},${order.status},${order.total}`);
    return new Response([header, ...rows].join("\n"), {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=orders.csv",
      },
    });
  }

  return ok({ data: orders });
}

export async function PATCH(request) {
  const body = await request.json();
  const orderNumber = String(body?.orderNumber || "");
  if (!orderNumber) return ok({ success: false, message: "orderNumber is required." }, { status: 400 });

  const updated = updateOrder(orderNumber, body);
  if (!updated) return ok({ success: false, message: "Order not found." }, { status: 404 });

  return ok({ success: true, data: updated });
}
