import { calculateCustomsDuty } from "./customsDutyCalc.js";

export function calculateLandedCost({
  fob = 0,
  insurance = 0,
  freight = 0,
  bcdRate = 10,
  swsRate = 10,
  igstRate = 18,
  quantity = 1,
}) {
  const cif = Number(fob) + Number(insurance) + Number(freight);
  const duty = calculateCustomsDuty({ cif, bcdRate, swsRate, igstRate });
  const total = cif + duty.totalDuty;
  const perUnit = total / Math.max(1, Number(quantity));

  return {
    cif,
    ...duty,
    landedCostTotal: total,
    landedCostPerUnit: Number(perUnit.toFixed(2)),
  };
}

export function calculateShippingCost({ country = "India", weight = 500 }) {
  const isDomestic = String(country).toLowerCase() === "india";
  const base = isDomestic ? 79 : 899;
  const weightFactor = Math.max(0, Math.ceil((Number(weight) - 500) / 500));

  return {
    rate: base + weightFactor * (isDomestic ? 25 : 120),
    etaDays: isDomestic ? "2-5" : "8-14",
  };
}
