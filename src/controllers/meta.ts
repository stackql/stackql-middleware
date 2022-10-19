// import * as logger from "./../shared/logger.ts";
import { Context } from "./../types/context.ts";
import { 
    getPathParams,
    getQueryParams, 
    getQueryFilter 
} from "./../shared/params.ts";
import { getData } from "../shared/data.ts";
import { 
    logger,
    formatDetailedLogMessage, 
} from "./../shared/logger.ts";

const fileName = 'controllers/meta.ts';

/**
 * return all providers installed
 */
const showProviders = async (ctx: Context) => {

    const functionName = 'showProviders';

    // parse query params
    const queryParams = await getQueryParams(ctx, fileName, functionName);

    // set query
    const iqlQuery = `SHOW PROVIDERS`;
    logger.debug(formatDetailedLogMessage(`iqlQuery: ${iqlQuery}`, fileName, functionName));

    // return results
    const respData = await getData(iqlQuery, queryParams.showMetadata);
    logger.debug(formatDetailedLogMessage(`respData: ${JSON.stringify(respData)}`, fileName, functionName));
    ctx.response.status = respData.respStatus;
    ctx.response.type = respData.respType;
    ctx.response.body = respData.respBody;
};

/**
 * return all services available in a provider
 */
const showServices = async (ctx: Context) => {

    const functionName = 'showServices';

    // get path params
    const pathParams = await getPathParams(ctx, fileName, functionName);
    const providerName = pathParams.providerName;

    // parse query params
    const queryParams = await getQueryParams(ctx, fileName, functionName);

    // filter param?
    const filterParam = await getQueryFilter(ctx);
    logger.debug(formatDetailedLogMessage(`filterParam: ${filterParam}`, fileName, functionName));

    // run query
    const iqlQuery = `SHOW EXTENDED SERVICES IN ${providerName}${filterParam}`;
    logger.debug(formatDetailedLogMessage(`iqlQuery: ${iqlQuery}`, fileName, functionName));

    // return results
    const respData = await getData(iqlQuery, queryParams.showMetadata);
    logger.debug(formatDetailedLogMessage(`respData: ${JSON.stringify(respData)}`, fileName, functionName));
    ctx.response.status = respData.respStatus;
    ctx.response.type = respData.respType;
    ctx.response.body = respData.respBody;
};

/**
 * return all resources available in a service
 */
 const showResources = async (ctx: Context) => {

    const functionName = 'showResources';

    // get path params
    const pathParams = await getPathParams(ctx, fileName, functionName);
    const providerName = pathParams.providerName;
    const serviceName = pathParams.serviceName;
    
    // parse query params
    const queryParams = await getQueryParams(ctx, fileName, functionName);

    // filter param?
    const filterParam = await getQueryFilter(ctx);

    // run query
    const iqlQuery = `SHOW EXTENDED RESOURCES IN ${providerName}.${serviceName}${filterParam}`;
    logger.debug(formatDetailedLogMessage(`iqlQuery: ${iqlQuery}`, fileName, functionName));

    // return results
    const respData = await getData(iqlQuery, queryParams.showMetadata);
    logger.debug(formatDetailedLogMessage(`respData: ${JSON.stringify(respData)}`, fileName, functionName));
    ctx.response.status = respData.respStatus;
    ctx.response.type = respData.respType;
    ctx.response.body = respData.respBody;
};

/**
 * return all fields available in a resource
 */
 const describeResource = async (ctx: Context) => {

    const functionName = 'describeResource';

    // get path params
    const pathParams = await getPathParams(ctx, fileName, functionName);
    const providerName = pathParams.providerName;
    const serviceName = pathParams.serviceName;
    const resourceName = pathParams.resourceName;

    // parse query params
    const queryParams = await getQueryParams(ctx, fileName, functionName);

    // run query
    const iqlQuery = `DESCRIBE EXTENDED ${providerName}.${serviceName}.${resourceName}`;
    logger.debug(formatDetailedLogMessage(`iqlQuery: ${iqlQuery}`, fileName, functionName));

    // return results
    const respData = await getData(iqlQuery, queryParams.showMetadata);
    logger.debug(formatDetailedLogMessage(`respData: ${JSON.stringify(respData)}`, fileName, functionName));
    ctx.response.status = respData.respStatus;
    ctx.response.type = respData.respType;
    ctx.response.body = respData.respBody;
};

/**
 * return all methods available on a resource
 */
 const showMethods = async (ctx: Context) => {

    const functionName = 'showMethods';

    // get path params
    const pathParams = await getPathParams(ctx, fileName, functionName);
    const providerName = pathParams.providerName;
    const serviceName = pathParams.serviceName;
    const resourceName = pathParams.resourceName;

    // parse query params
    const queryParams = await getQueryParams(ctx, fileName, functionName);

    // run query
    const iqlQuery = `SHOW EXTENDED METHODS IN ${providerName}.${serviceName}.${resourceName}`;
    logger.debug(formatDetailedLogMessage(`iqlQuery: ${iqlQuery}`, fileName, functionName));

    // return results
    const respData = await getData(iqlQuery, queryParams.showMetadata);
    logger.debug(formatDetailedLogMessage(`respData: ${JSON.stringify(respData)}`, fileName, functionName));
    ctx.response.status = respData.respStatus;
    ctx.response.type = respData.respType;
    ctx.response.body = respData.respBody;
};

export {
    showProviders,
    showServices,
    showResources,
    describeResource,
    showMethods,
}