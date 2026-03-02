import { ok } from "@/lib/api";

const customers = [
  { id: "usr_1", email: "customer1@oddfinds.com", name: "Test Customer One" },
  { id: "usr_2", email: "customer2@oddfinds.com", name: "Test Customer Two" },
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format");

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
