import { prisma } from "../prisma/client.js";

export function findByUserOrSession({ userId, sessionId }) {
  return prisma.cart.findFirst({ where: { OR: [{ userId }, { sessionId }] }, include: { items: true } });
}

export function upsertCart({ id, userId, sessionId, items }) {
  if (!id) {
    return prisma.cart.create({ data: { userId, sessionId, items: { create: items || [] } }, include: { items: true } });
  }

  return prisma.cart.update({ where: { id }, data: { items: { deleteMany: {}, create: items || [] } }, include: { items: true } });
}
