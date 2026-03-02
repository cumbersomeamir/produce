import { runProcurementSearch, calculateLandedCost } from "../services/procurementService.js";

export async function findProducts(query) {
  return runProcurementSearch(query);
}

export async function runCostCalculator(input) {
  return calculateLandedCost(input);
}
