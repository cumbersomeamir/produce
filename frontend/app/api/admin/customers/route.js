import { ok } from "@/lib/api";
import { listCustomers } from "@/lib/runtime/admin-store";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format");
  const customers = listCustomers();

  if (format === "csv") {
    const header = "id,email,name";
    const rows = customers.map((customer) => `${customer.id},${customer.email},${customer.name}`);
    return new Response([header, ...rows].join("\n"), {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=customers.csv",
      },
    });
  }

  return ok({ data: customers });
}
