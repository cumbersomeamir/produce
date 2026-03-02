import { enforceRateLimit, ok } from "@/lib/api";
import { runAgent } from "@/lib/ai";
import { logAiAction } from "@/lib/ai-log";

export async function handleAiRequest(request, type, options = {}) {
  const limited = enforceRateLimit(request, { prefix: `ai-${type}`, limit: options.limit || 20, windowMs: 60_000 });
  if (limited) return limited;

  const body = await request.json();
  const result = await runAgent({ type, input: body });

  logAiAction({
    type,
    prompt: JSON.stringify(body),
    response: result.response,
    mocked: result.mocked,
  });

  return ok({ success: true, data: result });
}
