import * as logger from "./../shared/logger.ts";
import { Context } from "./../types/context.ts";
import { stackql } from "../db/db.ts";

async function parseReqBody(body: any): Promise<{ query: string; showMetadata: boolean; respStatus: number; }> {

    console.log(await body.value);
    return { query: 'test', respStatus: 200, showMetadata: false };
}



/**
 * return results from query
 */
export const runQuery = async (ctx: Context) => {

    const bodyObj = parseReqBody(await ctx.request.body());

    // if(bodyObj.respStatus != 200){
    //     // something went wrong, get out


    // }


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