import * as InventoryModel from "../models/Inventory.js";

export async function listInventory() {
  return InventoryModel.findMany();
}

export async function updateInventory(productId, quantity) {
  return InventoryModel.updateQuantity(productId, quantity);
}
