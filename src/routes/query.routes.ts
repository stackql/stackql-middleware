import { Context } from "./../types/context.ts";
import * as queryController from "./../controllers/query.ts";

/**
 * run a stackql SELECT query
 * call by USER
 */
const runQuery = [
    // userGuard(UserRole.ADMIN),
    async (ctx: Context) => {
        const queryResp = await queryController.runQuery(ctx);
        //ctx.response.body = await queryResp.body.query.value;
        //ctx.response.status = queryResp.status;
    },
];

export { runQuery };