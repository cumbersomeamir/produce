import { prisma } from "../prisma/client.js";

export function findMany() {
  return prisma.supplier.findMany({ include: { communications: true } });
}

export function findById(id) {
  return prisma.supplier.findUnique({ where: { id }, include: { communications: true, products: true } });
}
