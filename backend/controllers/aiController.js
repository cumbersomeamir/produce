import { runAgent } from "../services/aiService.js";

export async function executeAgent(type, input) {
  return runAgent(type, input);
}
