// import * as logger from "./../shared/logger.ts";
import { Context } from "./../types/context.ts";
import { getQueryParams } from "./../shared/params.ts";
import { 
    getData,
    getTypes,
 } from "../shared/data.ts";
 import { 
    logger,
    formatDetailedLogMessage, 
} from "./../shared/logger.ts";

const fileName = 'controllers/query.ts';

export interface RespData {
    respStatus: number;
    respType: string;
    respBody: string;
}
  
async function parseReqBody(body: any): Promise<{ queryOrError: string; showMetadata: boolean; respStatus: number; }> {
    let inputData : any;
    let respStatus = 200;
    let queryOrError = "";
    let showMetadata = false;

    // try to parse the request body
    try {
        const bodyData = await body.value;
        if (typeof bodyData === "object") {
            inputData = bodyData;
        } else {
            inputData = JSON.parse(await bodyData);
        }
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
    else if(!inputData.query.toLowerCase().startsWith("select") && !inputData.query.toLowerCase().startsWith("show") && !inputData.query.toLowerCase().startsWith("describe")){
        respStatus = 405;
        queryOrError = "Method Not Allowed - methods other than SELECT, SHOW and DESCRIBE are not supported in middleware server mode";
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

    const functionName = 'runQuery';

    // exit if body is empty
    if (!ctx.request.hasBody) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Bad Request - no body" };
        return;
    }

    // parse query params
    const queryParams = await getQueryParams(ctx, fileName, functionName);

    // parse body
    const bodyObj = await parseReqBody(await ctx.request.body());
    logger.debug(formatDetailedLogMessage(`bodyObj: ${JSON.stringify(bodyObj)}`, fileName, functionName));

    if(bodyObj.respStatus != 200){
        // something went wrong, get out
        ctx.response.status = bodyObj.respStatus;
        ctx.response.body = { error: bodyObj.queryOrError };
        return;
    }

    // show metadata? (ignored if dts is specified)  
    let showMetadata = false;

    if (queryParams.showMetadata || bodyObj.showMetadata) {
        showMetadata = true;
    }

    const iqlQuery = bodyObj.queryOrError;

    let respData: RespData = {
        respStatus: 500,
        respType: 'application/text',
        respBody: 'Something went wrong',
    };

    if(queryParams.dts){
        // get types
        respData = await getTypes(iqlQuery);
    } else {
        // get data
        respData = await getData(iqlQuery, showMetadata);
    }
    logger.debug(formatDetailedLogMessage(`respData: ${JSON.stringify(respData)}`, fileName, functionName));
    ctx.response.status = respData.respStatus;
    ctx.response.type = respData.respType;
    ctx.response.body = respData.respBody;

};
