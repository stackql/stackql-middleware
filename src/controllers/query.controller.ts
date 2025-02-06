// controllers/query.controller.ts
import { Context } from "../types/context.types.ts";
import { QueryRequest, QueryResponse, ErrorResponse, RespData } from "../types/api.types.ts";
import { db } from "../services/database.service.ts";
import { logger } from "../services/logger.service.ts";
import { validateQuery, substituteParams } from "../utils/query.utils.ts";
import { generateTypes } from "https://deno.land/x/dts/mod.ts";

async function getTypes(renderedQuery: string): Promise<RespData> {
  const firstRow = (await db.query(renderedQuery))[0];
  if (!firstRow) {
    return {
      status: 400,
      type: 'application/json',
      body: { error: "No data returned to generate types" }
    };
  }
 
  const typeDef = await generateTypes(firstRow);
  return {
    status: 200,
    type: 'text/plain', 
    body: typeDef
  };
 }

export async function executeQuery(ctx: Context) {
  if (!ctx.request.hasBody) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Request body required" };
    return;
  }

  const queryParams = new URLSearchParams(ctx.request.url.search);
  const dts = queryParams.has('dts');
  let respData: RespData;

  try {
    const body = await ctx.request.body.json();
    logger.debug(`Request body: ${JSON.stringify(body)}`);

    const reqData: QueryRequest = typeof body === "string" ? JSON.parse(body) : body;
    logger.debug(`Request data: ${JSON.stringify(reqData)}`);

    const renderedQuery = substituteParams(reqData.query, reqData.params);
    if(renderedQuery !== reqData.query) {
      logger.debug(`Rendered query: ${renderedQuery}`);
    }

    const validationError = validateQuery(reqData.query);
    if (validationError) {
      ctx.response.status = 405;
      ctx.response.body = { error: validationError };
      return;
    }

    const startTime = new Date().toISOString();
    const t0 = performance.now();

    const rows = await db.query(renderedQuery);
    
    const response: QueryResponse = {
      data: rows,
      ...((reqData.showMetadata !== false) && { // Only exclude if explicitly false
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
            query: reqData.query,
            ...(reqData.params && {
              params: reqData.params,
              renderedQuery: renderedQuery
            })
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