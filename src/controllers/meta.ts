// import * as logger from "./../shared/logger.ts";
import { Context } from "./../types/context.ts";
import { 
    getQueryParams, 
    getQueryFilter 
} from "./../shared/params.ts";
import { getData } from "../shared/data.ts";

/**
 * return all providers installed
 */
const showProviders = async (ctx: Context) => {

    // parse query params
    const queryParams = await getQueryParams(ctx);

    // showMetadata
    const showMetadata = queryParams.showMetadata || false;

    // dts
    const dts = queryParams.dts || false;

    // run query
    const iqlQuery = `SHOW PROVIDERS`;

    // return results
    const respData = await getData(iqlQuery, showMetadata, dts);
    ctx.response.status = respData.respStatus;
    ctx.response.type = respData.respType;
    ctx.response.body = respData.respBody;
};

/**
 * return all services available in a provider
 */
const showServices = async (ctx: Context) => {

    // get path params
    const providerName = ctx.params.providerName;

    // parse query params
    const queryParams = await getQueryParams(ctx);

    // filter param?
    const filterParam = await getQueryFilter(ctx);

    // showMetadata
    const showMetadata = queryParams.showMetadata || false;

    // dts
    const dts = queryParams.dts || false;

    // run query
    const iqlQuery = `SHOW EXTENDED SERVICES IN ${providerName}${filterParam}`;

    // return results
    const respData = await getData(iqlQuery, showMetadata, dts);
    ctx.response.status = respData.respStatus;
    ctx.response.type = respData.respType;
    ctx.response.body = respData.respBody;
};

/**
 * return all resources available in a service
 */
 const showResources = async (ctx: Context) => {

    // get path params
    const providerName = ctx.params.providerName;
    const serviceName = ctx.params.serviceName;

    // parse query params
    const queryParams = await getQueryParams(ctx);

    // filter param?
    const filterParam = await getQueryFilter(ctx);

    // showMetadata
    const showMetadata = queryParams.showMetadata || false;

    // dts
    const dts = queryParams.dts || false;

    // run query
    const iqlQuery = `SHOW EXTENDED RESOURCES IN ${providerName}.${serviceName}${filterParam}`;

    // return results
    const respData = await getData(iqlQuery, showMetadata, dts);
    ctx.response.status = respData.respStatus;
    ctx.response.type = respData.respType;
    ctx.response.body = respData.respBody;
};

/**
 * return all fields available in a resource
 */
 const describeResource = async (ctx: Context) => {

    // get path params
    const providerName = ctx.params.providerName;
    const serviceName = ctx.params.serviceName;
    const resourceName = ctx.params.resourceName;

    // parse query params
    const queryParams = await getQueryParams(ctx);

    // showMetadata
    const showMetadata = queryParams.showMetadata || false;

    // dts
    const dts = queryParams.dts || false;

    // run query
    const iqlQuery = `DESCRIBE EXTENDED ${providerName}.${serviceName}.${resourceName}`;

    // return results
    const respData = await getData(iqlQuery, showMetadata, dts);
    ctx.response.status = respData.respStatus;
    ctx.response.type = respData.respType;
    ctx.response.body = respData.respBody;
};

/**
 * return all methods available on a resource
 */
 const showMethods = async (ctx: Context) => {

    // get path params
    const providerName = ctx.params.providerName;
    const serviceName = ctx.params.serviceName;
    const resourceName = ctx.params.resourceName;

    // parse query params
    const queryParams = await getQueryParams(ctx);

    // showMetadata
    const showMetadata = queryParams.showMetadata || false;

    // dts
    const dts = queryParams.dts || false;

    // run query
    const iqlQuery = `SHOW EXTENDED METHODS IN ${providerName}.${serviceName}.${resourceName}`;

    // return results
    const respData = await getData(iqlQuery, showMetadata, dts);
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