import { Context } from "./../types/context.ts";
import * as miscController from "./../controllers/misc.ts";

/**
 * check if server is up
 * call by USER
 */
const ping = [
    // userGuard(UserRole.ADMIN),
    async (ctx: Context) => {
        const pingResp = await miscController.ping();
        ctx.response.body = pingResp;
    },
];

export { ping };