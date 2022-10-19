import { Context } from "./../types/context.ts";
import * as queryController from "./../controllers/query.ts";
import { 
    logger,
    formatDetailedLogMessage, 
} from "./../shared/logger.ts";

const fileName = 'routes/query.routes.ts';

/**
 * run a stackql SELECT query
 * call by USER
 */
const runQuery = [
    // userGuard(UserRole.ADMIN),
    async (ctx: Context) => {
        logger.debug(formatDetailedLogMessage(`runQuery route invoked, context: ${JSON.stringify(ctx)}`, fileName, 'runQuery'));
        await queryController.runQuery(ctx);
    },
];

export { runQuery };