import { ok } from "@/lib/api";
import { listAiActions } from "@/lib/ai-log";

export async function GET() {
  return ok({ data: listAiActions() });
}
