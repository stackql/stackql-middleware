import { generateTypes } from "https://deno.land/x/dts/mod.ts";
import { Client } from "https://deno.land/x/postgres@v0.16.1/mod.ts";
import { 
    logger,
    formatDetailedLogMessage, 
} from "./logger.ts";

const fileName = 'shared/data.ts';

/*
* get stackql srv env vars and initiate connection
*/

const env = Deno.env.toObject()
const DB_HOST = env.DB_HOST || 'localhost'
const DB_PORT = parseInt(env.DB_PORT) || 5444

const client = new Client({
    applicationName: 'stackql',
    hostname: DB_HOST,
    port: DB_PORT,
    database: 'stackql',
    user: 'stackql',
});

try {
    console.log(`connecting to stackql server : ${DB_HOST}:${DB_PORT}`);
    await client.connect();
} catch (error) {
    console.log(`Error connecting to stackql server ${DB_HOST}:${DB_PORT} : ${error.message}`);
    throw error;
}

function reType(input: any): any {
    try {
        // its an object
        return JSON.parse(input);
    } catch (error) {
        // its a primitive
        return input;
    }
}

async function getData(iqlQuery: string, showMetadata: boolean): Promise< { respStatus: number; respType: string; respBody: string; } > {
    
    const functionName = 'getData';
    
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
        const data = await client.queryObject(iqlQuery);

        if (showMetadata){
            metadata.result['rowCount'] = data.rows.length;
            metadata.operation['status'] = 'OK';
            metadata.operation['endTime'] = new Date().toISOString();
            metadata.operation['duration'] = `${performance.now() - t0} ms`;
        }
        
        let respData = {
            data: data.rows,
            metadata : showMetadata ? metadata : null
        }

        logger.debug(formatDetailedLogMessage(`respData: ${JSON.stringify(respData)}`, fileName, functionName));

        return { respStatus: 200, respType: 'application/json', respBody: `${JSON.stringify(respData)}\n` };

    } catch (error) {
        logger.debug(formatDetailedLogMessage(`error: ${JSON.stringify(error)}`, fileName, functionName));
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
        const data = await client.queryObject(iqlQuery);
        const firstRow = data.rows[0];

        // parse each field
        const castedFields = {};
        Object.keys(firstRow).forEach(k => {
            castedFields[k] = reType(firstRow[k]);
        });

        // get types
        const result = await generateTypes(castedFields);

        return { respStatus: 200, respType: 'application/text', respBody: result };

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