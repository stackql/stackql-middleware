// import * as logger from "./../shared/logger.ts";
import { Context } from "./../types/context.ts";
import { getQueryParams } from "./../shared/params.ts";
import { getData } from "../shared/data.ts";

async function parseReqBody(body: any): Promise<{ queryOrError: string; showMetadata: boolean; respStatus: number; }> {
    let inputData : any;
    let respStatus = 200;
    let queryOrError = "";
    let showMetadata = false;
    // try to parse the request body
    try {
        inputData = JSON.parse(await body.value);
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
    else if (inputData.query === undefined) {
        respStatus = 400;
        queryOrError = "Malformed Request - no query field";
    }
    // is the query valid?
    else if(!inputData.query.toLowerCase().startsWith("select")){
        respStatus = 405;
        queryOrError = "Method Not Allowed - methods other than SELECT are not supported in middleware server mode";
    }

    // looks good, return the query
    queryOrError = inputData.query;
    showMetadata = inputData.showMetadata;
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

    let showMetadata = false;

    // parse query params
    const queryParams = await getQueryParams(ctx);

    // parse body
    const bodyObj = await parseReqBody(await ctx.request.body());

    if (queryParams.showMetadata || bodyObj.showMetadata) {
        showMetadata = true;
    }

    const dts = queryParams.dts || false;

    if(bodyObj.respStatus != 200){
        // something went wrong, get out
        ctx.response.status = bodyObj.respStatus;
        ctx.response.body = { error: bodyObj.queryOrError };
        return;
    }

    const iqlQuery = bodyObj.queryOrError;

    const respData = await getData(iqlQuery, showMetadata, dts);
    ctx.response.status = respData.respStatus;
    ctx.response.type = respData.respType;
    ctx.response.body = respData.respBody;

};
