import { prisma } from "../prisma/client.js";

export function create(data) {
  return prisma.emailLog.create({ data });
}

export function findMany() {
  return prisma.emailLog.findMany({ orderBy: { sentAt: "desc" }, take: 100 });
}
