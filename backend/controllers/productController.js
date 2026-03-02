import * as ProductModel from "../models/Product.js";

export async function listProducts(filters = {}) {
  return ProductModel.findMany(filters);
}

export async function getProductBySlug(slug) {
  return ProductModel.findBySlug(slug);
}

export async function createProduct(data) {
  return ProductModel.create(data);
}
