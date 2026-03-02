import { createPaymentOrder, createInternationalIntent } from "../services/paymentService.js";

export async function createRazorpay(payload) {
  return createPaymentOrder(payload);
}

export async function createStripe(payload) {
  return createInternationalIntent(payload);
}
