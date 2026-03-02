import * as CartModel from "../models/Cart.js";

export async function getCart(key) {
  return CartModel.findByUserOrSession(key);
}

export async function saveCart(data) {
  return CartModel.upsertCart(data);
}
