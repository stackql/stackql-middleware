// controllers/query.controller.ts
import { Context } from "../types/context.types.ts";
import { QueryRequest, QueryResponse, ErrorResponse } from "../types/api.types.ts";
import { db } from "../services/database.service.ts";
import { logger } from "../services/logger.service.ts";
import { validateQuery, substituteParams } from "../utils/query.utils.ts";
import { generateTypes } from "https://deno.land/x/dts/mod.ts";

export async function executeQuery(ctx: Context) {
 if (!ctx.request.hasBody) {
   ctx.response.status = 400;
   ctx.response.type = 'application/json';
   ctx.response.body = { error: "Request body required" };
   return;
 }

 try {
   // Parse request
   const body = await ctx.request.body.json();
   const reqData: QueryRequest = typeof body === "string" ? JSON.parse(body) : body;
   logger.debug(`Request data: ${JSON.stringify(reqData)}`);

   // Validate query
   const validationError = validateQuery(reqData.query);
   if (validationError) {
     ctx.response.status = 405;
     ctx.response.type = 'application/json';
     ctx.response.body = { error: validationError };
     return;
   }

   // Process query
   const renderedQuery = substituteParams(reqData.query, reqData.params);
   if(renderedQuery !== reqData.query) {
     logger.debug(`Rendered query: ${renderedQuery}`);
   }

   // Generate types or execute query
   const dts = new URLSearchParams(ctx.request.url.search).has('dts');
   if (dts) {
     const firstRow = (await db.query(renderedQuery))[0];
     if (!firstRow) {
       ctx.response.status = 400;
       ctx.response.type = 'application/json';
       ctx.response.body = { error: "No data returned to generate types" };
       return;
     }
     ctx.response.type = 'text/plain';
     ctx.response.status = 200;
     ctx.response.body = await generateTypes(firstRow);
     return;
   }

   // Execute query and return data
   const startTime = new Date().toISOString();
   const t0 = performance.now();
   const rows = await db.query(renderedQuery);

   const response: QueryResponse = {
     data: rows,
     ...((reqData.showMetadata !== false) && {
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
             renderedQuery
           })
         }
       }
     })
   };

   ctx.response.type = 'application/json';
   ctx.response.status = 200;
   ctx.response.body = response;

 } catch (error) {
   logger.error(`Query execution failed: ${error.message}`);
   ctx.response.type = 'application/json';
   ctx.response.status = 400;
   ctx.response.body = {
     error: error.message.replace(/\n/g, "")
   };
 }
}