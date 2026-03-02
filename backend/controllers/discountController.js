import * as DiscountModel from "../models/Discount.js";

export async function listDiscounts() {
  return DiscountModel.findMany();
}

export async function createDiscount(data) {
  return DiscountModel.create(data);
}
