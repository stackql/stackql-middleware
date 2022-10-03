// import * as logger from "./../shared/logger.ts";
import * as stackql from "../db/db.ts";

async function parseIqlResults(iqlResult: any, allRows: boolean): Promise< any[] > {
    
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
            if (!allRows) {
                break;
            }
        }
    }
    return rows;
}

async function getData(iqlQuery: string, showMetadata: boolean, dts: boolean): Promise< { respStatus: number; respType: string; respBody: string; } > {
    
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
        const data = await parseIqlResults(iqlResult, true);

        if (showMetadata){
            metadata.result['rowCount'] = data.length;
            metadata.operation['status'] = iqlResult.status;
            metadata.operation['endTime'] = new Date().toISOString();
            metadata.operation['duration'] = `${performance.now() - t0} ms`;
        }
        
        let respData = {
            data: data,
            metadata : showMetadata ? metadata : null
        }

        stackqlConn.end();
        stackqlConn.destroy();        

        return { respStatus: 200, respType: 'application/json', respBody: `${JSON.stringify(respData)}\n` };
    } catch (error) {
        const errResp = {
            error: error.message.replace(/\n/g, ""),
        };
        return { respStatus: 400, respType: 'application/json', respBody: `${JSON.stringify(errResp)}\n` };
    }
}

async function getTypes(iqlQuery: string): Promise< { respStatus: number; respType: string; respBody: string; } > {
    
    // run query and get types
    try {

        // connect, run query and get results
        const stackqlConn = await stackql.connect();
        const iqlResult = await stackqlConn.query(iqlQuery);        

        // parse results
        const data = await parseIqlResults(iqlResult, false);

        // TODO get types here

        stackqlConn.end();
        stackqlConn.destroy();        

        return { respStatus: 200, respType: 'application/text', respBody: `types here` };
    } catch (error) {
        const errResp = {
            error: error.message.replace(/\n/g, ""),
        };
        return { respStatus: 400, respType: 'application/json', respBody: `${JSON.stringify(errResp)}\n` };
    }
}

export {
    getData,
    getTypes,
}