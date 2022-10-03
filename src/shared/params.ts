import { Context } from "./../types/context.ts";

/**
 * return state for known query params
 */
async function getQueryParams(ctx: Context): Promise<{ showMetadata: boolean; dts: boolean; }>{
    let showMetadata = false;
    let dts = false;
    ctx.request.url.searchParams.get('showMetadata') === '' ? showMetadata = true : showMetadata = false;
    ctx.request.url.searchParams.get('dts') === '' ? dts = true : dts = false;
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
    getQueryParams,
    getQueryFilter,
}