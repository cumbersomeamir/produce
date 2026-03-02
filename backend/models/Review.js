import { prisma } from "../prisma/client.js";

export function findMany(filters = {}) {
  return prisma.review.findMany({ where: filters, orderBy: { createdAt: "desc" } });
}

export function create(data) {
  return prisma.review.create({ data });
}
