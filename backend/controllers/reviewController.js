import * as ReviewModel from "../models/Review.js";

export async function listReviews(filters = {}) {
  return ReviewModel.findMany(filters);
}

export async function createReview(data) {
  return ReviewModel.create(data);
}
