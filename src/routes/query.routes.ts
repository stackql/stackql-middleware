import { Context } from "./../types/context.ts";
import * as queryController from "./../controllers/query.ts";

/**
 * run a stackql SELECT query
 * call by USER
 */
const runQuery = [
    // userGuard(UserRole.ADMIN),
    async (ctx: Context) => {
        await queryController.runQuery(ctx);
    },
];

export { runQuery };