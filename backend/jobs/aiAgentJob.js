import { runAgent } from "../services/aiService.js";

export async function processAiAgentJob(type, input) {
  return runAgent(type, input);
}
