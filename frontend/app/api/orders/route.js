import { ok } from "@/lib/api";

const orders = [
  { orderNumber: "ODF-104932", status: "PENDING", total: 2199 },
  { orderNumber: "ODF-104931", status: "SHIPPED", total: 999 },
];

export async function GET() {
  return ok({ data: orders });
}

export async function POST(request) {
  const body = await request.json();
  const orderNumber = `ODF-${Math.floor(100000 + Math.random() * 900000)}`;
  const order = {
    orderNumber,
    status: "PENDING",
    ...body,
  };
  orders.unshift(order);
  return ok(
    {
      success: true,
      data: order,
      invoice: {
        fileName: `${orderNumber}.pdf`,
        url: `/invoices/${orderNumber}.pdf`,
      },
    },
    { status: 201 },
  );
}
