import { prisma } from "../prisma/client.js";

export function findMany() {
  return prisma.inventory.findMany({ include: { product: true } });
}

export function updateQuantity(productId, quantity) {
  return prisma.inventory.update({ where: { productId }, data: { quantity } });
}
