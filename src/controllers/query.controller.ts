// controllers/query.controller.ts
import { Context } from "../types/context.types.ts";
import { QueryRequest, QueryResponse, ErrorResponse } from "../types/api.types.ts";
import { db } from "../services/database.service.ts";
import { logger } from "../services/logger.service.ts";
import { validateQuery } from "../utils/query.utils.ts";

export async function executeQuery(ctx: Context) {
  if (!ctx.request.hasBody) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Request body required" };
    return;
  }

  try {
    // const body = await ctx.request.body.value;
    const body = await ctx.request.body.json();
    logger.info(`Request body: ${JSON.stringify(body)}`);

    const reqData: QueryRequest = typeof body === "string" ? JSON.parse(body) : body;
    logger.info(`Request data: ${JSON.stringify(reqData)}`);

    const validationError = validateQuery(reqData.query);
    if (validationError) {
      ctx.response.status = 405;
      ctx.response.body = { error: validationError };
      return;
    }

    const startTime = new Date().toISOString();
    const t0 = performance.now();

    const rows = await db.query(reqData.query);
    
    const response: QueryResponse = {
      data: rows,
      ...(reqData.showMetadata && {
        metadata: {
          operation: {
            startTime,
            endTime: new Date().toISOString(),
            duration: `${performance.now() - t0} ms`,
            status: 'OK'
          },
          result: {
            rowCount: rows.length
          },
          request: {
            query: reqData.query
          }
        }
      })
    };

    ctx.response.body = response;
  } catch (error) {
    logger.error(`Query execution failed: ${error.message}`);
    ctx.response.status = 400;
    const errorResponse: ErrorResponse = {
      error: error.message.replace(/\n/g, "")
    };
    ctx.response.body = errorResponse;
  }
}