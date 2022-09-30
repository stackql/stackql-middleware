import * as logger from "./../shared/logger.ts";
import { Context } from "./../types/context.ts";
import * as stackql from "../db/db.ts";

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
    if(!inputData.query.toLowerCase().startsWith("select")){
        respStatus = 405;
        queryOrError = "Method Not Allowed - methods other than SELECT are not supported in middleware server mode";
    }

    // looks good, return the query
    queryOrError = inputData.query;
    showMetadata = inputData.showMetadata;

    return { queryOrError: queryOrError, respStatus: respStatus, showMetadata: showMetadata };
}

async function parseIqlResults(iqlResult: any): Promise< any[] > {
    
    const cols : string[] = [];
    for (const column of iqlResult.columns) {
        cols.push(column.name);
    }
    
    const rows : any[] = [];
    for (const sub of iqlResult.results) {
        for (const row of sub.rows) {
        const rowobj : any = {};
        for (let i = 0; i < row.length; i++) {
            rowobj[cols[i]] = row[i];
        }
        rows.push(rowobj);
        }
    }
    return rows;
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
    const bodyObj = await parseReqBody(await ctx.request.body());

    if(bodyObj.respStatus != 200){
        // something went wrong, get out
        ctx.response.status = bodyObj.respStatus;
        ctx.response.body = { error: bodyObj.queryOrError };
        return;
    }

    const showMetadata = bodyObj.showMetadata || false;
    const iqlQuery = bodyObj.queryOrError;

    // run query
    try {

        // init metadata

        // get operation start time
        const t0 = performance.now();

        let metadata = {
            operation: {},
            result: {},
            request: {},
        };

        if (showMetadata){
            metadata.operation['startTime'] = new Date().toISOString();;
            metadata.request['query'] = iqlQuery;
        }

        // connect, run query and get results
        const stackqlConn = await stackql.connect();
        const iqlResult = await stackqlConn.query(iqlQuery);        

        // parse results
        const data = await parseIqlResults(iqlResult);

        if (showMetadata){
            metadata.result['rowCount'] = data.length;
            metadata.operation['status'] = iqlResult.status;
            metadata.operation['endTime'] = new Date().toISOString();
            metadata.operation['duration'] = `${performance.now() - t0} ms`;
        }

        // prep resp
        ctx.response.status = 200;
        ctx.response.type = "application/json";
        
        let respData = {
            data: data,
            metadata : showMetadata ? metadata : null
        }

        ctx.response.body = `${JSON.stringify(respData)}\n`;

        stackqlConn.end();
        stackqlConn.destroy();        

        return;
    } catch (error) {
        ctx.response.status = 400;
        const errResp = {
            error: error.message.replace(/\n/g, ""),
        };
        ctx.response.body = `${JSON.stringify(errResp)}\n`;
        return;
    }
};
