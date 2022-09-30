import * as logger from "./../shared/logger.ts";
import { Context } from "./../types/context.ts";
import { stackql } from "../db/db.ts";

async function parseReqBody(body: any): Promise<{ queryOrError: string; showMetadata: boolean; respStatus: number; }> {
    let inputData : any;
    let respStatus = 200;
    let queryOrError = "";
    let showMetadata = false;

    // try to parse the request body
    try {
        inputData = await body.value;
    } catch(err) {
        respStatus = 400;
        queryOrError = "Bad Request";
        return { queryOrError: queryOrError, respStatus: respStatus, showMetadata: showMetadata };
    }

    // post body is not json
    if(typeof inputData != "object") {
        respStatus = 400;
        queryOrError = "Bad Request - invalid request body";
    }

    // does a query field exist?
    if (inputData.query === undefined) {
        respStatus = 400;
        queryOrError = "Malformed Request - no query field";
    }

    // is the query valid?
    if(!inputData.query.startsWith("SELECT") && !inputData.query.startsWith("SHOW") && !inputData.query.startsWith("DESCRIBE")){
        respStatus = 405;
        queryOrError = "Method Not Allowed - methods other than SELECT, SHOW, DESCRIBE are not supported in middleware server mode";
    }

    return { queryOrError: queryOrError, respStatus: respStatus, showMetadata: showMetadata };
}

/**
 * return results from query
 */
export const runQuery = async (ctx: Context) => {

    // exit if body is empty
    if (!ctx.request.hasBody) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Bad Request - no body" };
        return;
    }

    // parse body
    const bodyObj = parseReqBody(await ctx.request.body());

    if((await bodyObj).respStatus != 200){
        // something went wrong, get out
        ctx.response.status = (await bodyObj).respStatus;
        ctx.response.body = { error: (await bodyObj).queryOrError };
        return;
    }


    const reqBody = ctx.request.body();
    let bodyData : any;

    // parse request body
    try {
        bodyData = await reqBody.value;
      } catch(err) {
        logger.error(err);
        return;
      }
  
      if (bodyData.query === undefined) {
        console.log('query not found');
        return;
      } else if(!bodyData.query.startsWith("SELECT") && !bodyData.query.startsWith("SHOW") && !bodyData.query.startsWith("DESCRIBE")){
        console.log('query not supported');
        return;
      }
  
      const showMetadata = bodyData.showMetadata || false;
      
      const iqlQuery = bodyData.query;

    try {

        const pgresult = await stackql.query(iqlQuery);        
        const cols : string[] = [];
        for (const column of pgresult.columns) {
            cols.push(column.name);
        }
        logger.info(JSON.stringify(cols));

        // resp['body'] = await stackql.query(query);
        // resp['status'] = 200;
        // console.log(resp);
        // return resp;
        return;
    } catch (error) {
        console.log(error);
        return;
        // resp = error;
    }
};