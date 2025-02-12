// controllers/duckdb.controller.ts
import { Context } from "../types/context.types.ts";
import { QueryRequest, QueryResponse } from "../types/api.types.ts";
import { duckdb } from "../services/duckdb.service.ts";
import { logger } from "../services/logger.service.ts";

export async function executeQuery(ctx: Context) {
  if (!ctx.request.hasBody) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Request body required" };
    return;
  }

  try {
    const body = await ctx.request.body.json();
    const reqData: QueryRequest = typeof body === "string" ? JSON.parse(body) : body;
    logger.debug(`DuckDB request: ${JSON.stringify(reqData)}`);

    const startTime = new Date().toISOString();
    const t0 = performance.now();
    
    const rows = duckdb.query(reqData.query);
    logger.debug('DuckDB raw result:', JSON.stringify(rows));

    // Try wrapping result in a more basic structure
    const data = Array.isArray(rows) ? rows : [rows];
    logger.debug('Processed result:', JSON.stringify(data));

    const response: QueryResponse = {
      data,
      ...((reqData.showMetadata !== false) && {
        metadata: {
          operation: {
            startTime,
            endTime: new Date().toISOString(),
            duration: `${performance.now() - t0} ms`,
            status: 'OK'
          },
          result: {
            rowCount: data.length
          },
          request: {
            query: reqData.query
          }
        }
      })
    };

    logger.debug('Final response:', JSON.stringify(response));

    ctx.response.type = 'application/json';
    ctx.response.status = 200;
    ctx.response.body = response;

  } catch (error) {
    logger.error(`DuckDB query execution failed: ${error.message}`);
    logger.error(`Stack trace: ${error.stack}`);
    ctx.response.status = 400;
    ctx.response.body = { error: error.message };
  }
}