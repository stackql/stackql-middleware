import { Context } from "./../types/context.ts";
import * as metaController from "./../controllers/meta.ts";

/**
 * show all providers installed
 * call by USER
 */
const getProviders = [
    // userGuard(UserRole.ADMIN),
    async (ctx: Context) => {
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