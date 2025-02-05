// controllers/health.controller.ts
import { Context } from "../types/context.types.ts";

export async function healthCheck(ctx: Context) {
  ctx.response.body = { status: "healthy" };
}