import { prisma } from "../prisma/client.js";

export function findMany(filters = {}) {
  return prisma.order.findMany({ where: filters, include: { items: true } });
}

export function create(data) {
  return prisma.order.create({ data });
}

export function updateStatus(orderId, status) {
  return prisma.order.update({ where: { id: orderId }, data: { status } });
}
