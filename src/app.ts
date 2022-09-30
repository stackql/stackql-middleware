import { Application } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { router } from "./routes/routes.ts";
import _404 from "./controllers/404.ts";
import { Context } from "./types/context.ts";
import * as logger from "./shared/logger.ts";

const env = Deno.env.toObject()
const HOST = env.HOST || '0.0.0.0'
const PORT = env.PORT || 8080
const LOGLEVEL = env.LOGLEVEL || 'info'

const app = new Application<Context>();

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(_404);

app.addEventListener("listen", ({ hostname, port, serverType }) => {
    logger.info(`Server started on ${hostname}:${port} using ${serverType}`);
});

app.addEventListener(
    "error",
    (e) => logger.error(`Server error : ${e.message}`)
);

await app.listen({ hostname: HOST, port: PORT });