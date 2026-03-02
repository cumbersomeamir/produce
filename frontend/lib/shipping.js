import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { shippingZones } from "@/lib/mock-data";

const CARRIER_MATRIX = {
  India: ["India Post", "Delhivery", "Shiprocket"],
  "South Asia": ["India Post", "DHL"],
  "Southeast Asia": ["DHL", "FedEx"],
  "Middle East": ["DHL", "FedEx"],
  Europe: ["DHL", "FedEx"],
  "North America": ["DHL", "FedEx"],
  "Rest of World": ["DHL"],
};

export function calculateShippingRate({ country = "India", weight = 500, subtotal = 0 }) {
  const normalizedWeight = Math.max(100, Number(weight));
  const zone =
    shippingZones.find((item) =>
      country.toLowerCase() === "india" ? item.zone === "India" : item.zone !== "India",
    ) || shippingZones[0];

  if (country.toLowerCase() === "india" && subtotal >= FREE_SHIPPING_THRESHOLD) {
    return {
      zone: zone.zone,
      carrier: "Delhivery",
      rate: 0,
      etaDays: zone.days,
      free: true,
    };
  }

  const extraWeightUnits = Math.max(0, Math.ceil((normalizedWeight - 500) / 500));
  const rate = zone.baseRate + extraWeightUnits * (country.toLowerCase() === "india" ? 25 : 120);

  return {
    zone: zone.zone,
    carrier: (CARRIER_MATRIX[zone.zone] || ["India Post"])[0],
    rate,
    etaDays: zone.days,
    free: false,
  };
}
