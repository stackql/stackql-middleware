// middleware/error.middleware.ts
import { Context } from "../types/context.types.ts";
import { logger } from "../services/logger.service.ts";

export async function errorHandler(
  ctx: Context,
  next: () => Promise<unknown>
) {
  try {
    await next();
  } catch (err) {
    logger.error(`Unhandled error: ${err.message}`);
    ctx.response.status = err.status || 500;
    ctx.response.body = {
      error: err.message || 'Internal server error'
    };
  }
}
