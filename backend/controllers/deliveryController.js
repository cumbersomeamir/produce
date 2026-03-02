import { createShipment, fetchTracking } from "../services/shippingService.js";

export async function assignDelivery(payload) {
  return createShipment(payload);
}

export async function trackDelivery(reference) {
  return fetchTracking(reference);
}
