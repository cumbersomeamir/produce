import { prisma } from "../prisma/client.js";

export function findMany() {
  return prisma.discount.findMany({ orderBy: { createdAt: "desc" } });
}

export function create(data) {
  return prisma.discount.create({ data });
}
