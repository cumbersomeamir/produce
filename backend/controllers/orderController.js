import * as OrderModel from "../models/Order.js";

export async function listOrders(filters = {}) {
  return OrderModel.findMany(filters);
}

export async function createOrder(data) {
  return OrderModel.create(data);
}

export async function updateOrderStatus(orderId, status) {
  return OrderModel.updateStatus(orderId, status);
}
