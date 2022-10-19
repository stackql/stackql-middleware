import { Context } from "./../types/context.ts";
import * as metaController from "./../controllers/meta.ts";
import { 
    logger,
    formatDetailedLogMessage, 
} from "./../shared/logger.ts";

const fileName = 'routes/meta.routes.ts';

/**
 * show all providers installed
 * call by USER
 */
const getProviders = [
    // userGuard(UserRole.ADMIN),
    async (ctx: Context) => {
        logger.debug(formatDetailedLogMessage(`getProviders route invoked`, fileName, 'getProviders'));
        await metaController.showProviders(ctx);
    },
];

/**
 * show all services in a specified provider
 * call by USER
 */
 const getServices = [
    // userGuard(UserRole.ADMIN),
    async (ctx: Context) => {
        logger.debug(formatDetailedLogMessage(`getServices route invoked, context: ${JSON.stringify(ctx)}`, fileName, 'getServices'));
        await metaController.showServices(ctx);
    },
];

/**
 * show all resources in a specified service
 * call by USER
 */
 const getResources = [
    // userGuard(UserRole.ADMIN),
    async (ctx: Context) => {
        logger.debug(formatDetailedLogMessage(`getResources route invoked, context: ${JSON.stringify(ctx)}`, fileName, 'getResources'));
        await metaController.showResources(ctx);
    },
];

/**
 * show all fields in a specified resource
 * call by USER
 */
 const getResourceFields = [
    // userGuard(UserRole.ADMIN),
    async (ctx: Context) => {
        logger.debug(formatDetailedLogMessage(`getResourceFields route invoked, context: ${JSON.stringify(ctx)}`, fileName, 'getResourceFields'));
        await metaController.describeResource(ctx);
    },
];

/**
 * show all methods for a specified resource
 * call by USER
 */
 const getResourceMethods = [
    // userGuard(UserRole.ADMIN),
    async (ctx: Context) => {
        logger.debug(formatDetailedLogMessage(`getResourceMethods route invoked, context: ${JSON.stringify(ctx)}`, fileName, 'getResourceMethods'));
        await metaController.showMethods(ctx);
    },
];

export { 
    getProviders,
    getServices,
    getResources,
    getResourceFields,
    getResourceMethods,
 };