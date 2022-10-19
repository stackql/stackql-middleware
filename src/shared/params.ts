import { Context } from "./../types/context.ts";
import { 
    logger,
    formatDetailedLogMessage, 
} from "./logger.ts";

/**
 * return values for specified path params
 */
 async function getPathParams(ctx: Context, fileName: string, functionName: string): Promise< Record<string, string> >{
    logger.debug(formatDetailedLogMessage(`pathParams: ${JSON.stringify(ctx.params)}`, fileName, functionName));
    return ctx.params;
}

/**
 * return state for known query params
 */
async function getQueryParams(ctx: Context, fileName: string, functionName: string): Promise<{ showMetadata: boolean; dts: boolean; }>{
    let showMetadata = false;
    let dts = false;
    ctx.request.url.searchParams.get('showMetadata') === '' ? showMetadata = true : showMetadata = false;
    ctx.request.url.searchParams.get('dts') === '' ? dts = true : dts = false;
    logger.debug(formatDetailedLogMessage(`searchParams: ${JSON.stringify(Array.from(ctx.request.url.searchParams.values()))}`, fileName, functionName));
    return { showMetadata: showMetadata, dts: dts };
}

async function getQueryFilter(ctx: Context): Promise<string>{
    // exact match
    if (ctx.request.url.searchParams.get('name')){
        return ` LIKE '${ctx.request.url.searchParams.get('name')}'`;
    } 
    // fuzzy match
    if (ctx.request.url.searchParams.get('like')) {
        return ` LIKE '%${ctx.request.url.searchParams.get('like')}%'`
    } 
    // no filters
    return '';
}

export {
    getPathParams,
    getQueryParams,
    getQueryFilter,
}