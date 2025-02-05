// app.ts
import { Application } from "./deps.ts";
import { oakCors } from "./deps.ts";
import { Context } from "./types/context.types.ts";
import { config } from "./config/environment.ts";
import { logger } from "./services/logger.service.ts";
import { db } from "./services/database.service.ts";
import { errorHandler } from "./middleware/error.middleware.ts";
import { healthRouter } from "./routes/health.routes.ts";
import { queryRouter } from "./routes/query.routes.ts";
import { metaRouter } from "./routes/meta.routes.ts";

const app = new Application<Context>();

// Debug logging middleware
app.use(async (ctx, next) => {
  logger.debug(`Request: ${ctx.request.method} ${ctx.request.url}`);
  logger.debug('Headers:', ctx.request.headers);
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  logger.debug(`Response: ${ctx.response.status} in ${ms}ms`);
});

app.use(oakCors());
app.use(errorHandler);

app.use(healthRouter.routes());
app.use(queryRouter.routes());
app.use(metaRouter.routes());

app.use(healthRouter.allowedMethods());
app.use(queryRouter.allowedMethods());
app.use(metaRouter.allowedMethods());

app.addEventListener("error", (evt) => {
  logger.error(`Uncaught error: ${evt.error}`);
});

logger.debug('Config:', config);
await db.connect();
logger.info(`Starting server on ${config.server.host}:${config.server.port}`);

await app.listen({
  port: config.server.port,
  hostname: config.server.host,
});