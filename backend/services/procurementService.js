import { calculateCustomsDuty } from "../utils/customsDutyCalc.js";
import { calculateLandedCost as computeLandedCost } from "../utils/landedCostCalc.js";

export function runProcurementSearch(query) {
  return [
    {
      idea: `${query} Mini Gadget`,
      estimatedCostRange: "₹180 - ₹320",
      potentialMargin: "42%",
      sourcingDifficulty: "Medium",
      source: "IndiaMART",
    },
    {
      idea: `${query} Viral Gift Box`,
      estimatedCostRange: "₹230 - ₹450",
      potentialMargin: "51%",
      sourcingDifficulty: "Low",
      source: "Alibaba",
    },
  ];
}

export function calculateLandedCostDetails(input) {
  const duty = calculateCustomsDuty(input);
  const cost = computeLandedCost(input);
  return { duty, ...cost };
}

export function calculateLandedCost(input) {
  return calculateLandedCostDetails(input);
}
