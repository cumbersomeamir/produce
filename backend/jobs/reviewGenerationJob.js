import { runAgent } from "../services/aiService.js";

export async function processReviewGenerationJob(payload) {
  return runAgent("generate-reviews", payload);
}
