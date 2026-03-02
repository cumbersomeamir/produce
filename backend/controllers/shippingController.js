import { calculateShippingCost } from "../services/shippingService.js";

export async function getShippingQuote(payload) {
  return calculateShippingCost(payload);
}
