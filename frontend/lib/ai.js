import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const AGENT_TYPES = {
  DESCRIBE: "describe",
  REVIEWS: "generate-reviews",
  PRODUCT_FINDER: "product-finder",
  COST_CALCULATOR: "cost-calculator",
  NEGOTIATE: "negotiate",
  SMART_PRICING: "smart-pricing",
  CUSTOMER_SERVICE: "customer-service",
  INVENTORY_OPTIMIZER: "inventory-optimizer",
  SEO_CONTENT: "seo-content",
  AD_COPY: "ad-copy",
  SUPPLIER_DISCOVERY: "supplier-discovery",
};

function mockResponse(type, input) {
  switch (type) {
    case AGENT_TYPES.DESCRIBE:
      return `Meet ${input?.name || "your product"}: premium weirdness engineered for instant impulse buys.`;
    case AGENT_TYPES.NEGOTIATE:
      return "Hello [Supplier], we're excited to explore a long-term order plan. Could you share MOQ, best FOB pricing, and sample terms for evaluation?";
    default:
      return "AI service is not configured. This is a placeholder response.";
  }
}

async function runOpenAi(prompt) {
  if (!openai) return null;
  const completion = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
  });
  return completion.output_text || "";
}

export async function runAgent({ type, input }) {
  if (!openai) {
    return {
      mocked: true,
      type,
      response: mockResponse(type, input),
    };
  }

  let prompt = "";
  if (type === AGENT_TYPES.DESCRIBE) {
    prompt = `Write an SEO-friendly but playful e-commerce product description for:\n${JSON.stringify(input, null, 2)}`;
  } else if (type === AGENT_TYPES.REVIEWS) {
    prompt = `Generate diverse customer reviews with varied tone and ratings for:\n${JSON.stringify(input, null, 2)}`;
  } else if (type === AGENT_TYPES.NEGOTIATE) {
    prompt = `Draft a professional procurement negotiation email:\n${JSON.stringify(input, null, 2)}`;
  } else {
    prompt = `Run OddFinds agent ${type} with this input:\n${JSON.stringify(input, null, 2)}`;
  }

  const response = await runOpenAi(prompt);
  return {
    mocked: false,
    type,
    response,
  };
}

export const AiAgentTypes = AGENT_TYPES;
