import { calculateShippingCost } from "../utils/landedCostCalc.js";

export function createShipment(payload) {
  return {
    shipmentId: `ship_${Date.now()}`,
    status: "CREATED",
    ...payload,
  };
}

export function fetchTracking(reference) {
  return {
    reference,
    status: "IN_TRANSIT",
    updatedAt: new Date().toISOString(),
  };
}

export function calculateShippingRate(payload) {
  return calculateShippingCost(payload);
}

export function calculateShippingCostForCheckout(payload) {
  return calculateShippingCost(payload);
}
