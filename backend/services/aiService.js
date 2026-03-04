import OpenAI from "openai";
import { prisma } from "../prisma/client.js";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const agents = {
  describe: {
    enabled: true,
    prompt: (input) => `Write playful SEO product copy for: ${JSON.stringify(input)}`,
  },
  "generate-reviews": {
    enabled: true,
    prompt: (input) => `Generate diverse customer reviews for: ${JSON.stringify(input)}`,
  },
  "product-finder": {
    enabled: true,
    prompt: (input) => `Suggest quirky product opportunities for: ${JSON.stringify(input)}`,
  },
  "cost-calculator": {
    enabled: true,
    prompt: (input) => `Estimate landed cost and duties for: ${JSON.stringify(input)}`,
  },
  negotiate: {
    enabled: true,
    prompt: (input) => `Draft supplier negotiation email: ${JSON.stringify(input)}`,
  },
  "smart-pricing": {
    enabled: true,
    prompt: (input) => `Suggest a price strategy: ${JSON.stringify(input)}`,
  },
  "customer-service": { enabled: false, prompt: (input) => `TODO customer service bot ${JSON.stringify(input)}` },
  "inventory-optimizer": { enabled: false, prompt: (input) => `TODO inventory optimizer ${JSON.stringify(input)}` },
  "seo-content": { enabled: false, prompt: (input) => `TODO seo content ${JSON.stringify(input)}` },
  "ad-copy": { enabled: false, prompt: (input) => `TODO ad copy ${JSON.stringify(input)}` },
  "supplier-discovery": { enabled: false, prompt: (input) => `TODO supplier discovery ${JSON.stringify(input)}` },
};

export async function runAgent(type, input) {
  const agent = agents[type];
  if (!agent) {
    throw new Error(`Unknown AI agent type: ${type}`);
  }

  const prompt = agent.prompt(input);

  if (!agent.enabled || !openai) {
    const response = "AI integration is disabled or not configured. Returning placeholder output.";
    try {
      await prisma.aiActionLog.create({ data: { type, prompt, response, isMocked: true } });
    } catch (error) {
      console.error(`AI action log failed (mocked run): ${error?.message || "unknown error"}`);
    }
    return { type, prompt, response, mocked: true, enabled: agent.enabled };
  }

  const completion = await openai.responses.create({ model: "gpt-4.1-mini", input: prompt });
  const response = completion.output_text || "";

  try {
    await prisma.aiActionLog.create({ data: { type, prompt, response, isMocked: false } });
  } catch (error) {
    console.error(`AI action log failed (live run): ${error?.message || "unknown error"}`);
  }
  return { type, prompt, response, mocked: false, enabled: true };
}

export function getAgentRegistry() {
  return agents;
}
