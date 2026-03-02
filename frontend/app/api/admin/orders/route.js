import { ok } from "@/lib/api";

const orders = [{ orderNumber: "ODF-104932", status: "PENDING", total: 2199 }];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format");

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
  return ok({ success: true, data: body });
}
