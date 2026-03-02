import { prisma } from "../prisma/client.js";

export async function getDashboardMetrics() {
  const [orders, customers, pendingReviews] = await Promise.all([
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.review.count({ where: { isApproved: false } }),
  ]);

  return { orders, customers, pendingReviews };
}
