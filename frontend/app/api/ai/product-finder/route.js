import { handleAiRequest } from "@/app/api/ai/_utils/handler";

export async function POST(request) {
  return handleAiRequest(request, "product-finder");
}
