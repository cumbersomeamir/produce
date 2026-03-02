import { prisma } from "../prisma/client.js";

export function findMany(filters = {}) {
  return prisma.product.findMany({ where: filters, include: { images: true, inventory: true } });
}

export function findBySlug(slug) {
  return prisma.product.findUnique({ where: { slug }, include: { images: true, inventory: true } });
}

export function create(data) {
  return prisma.product.create({ data });
}
