import * as log from "https://deno.land/std@0.160.0/log/mod.ts";

const env = Deno.env.toObject()
const LOGLEVEL = env.LOGLEVEL || 'INFO'

console.log(`LOGLEVEL: ${LOGLEVEL}`);

await log.setup({
    handlers: {
        console: new log.handlers.ConsoleHandler(LOGLEVEL),
    },
    loggers: {
        default: {
            level: LOGLEVEL,
            handlers: ["console"],
        },
    }  
});

const logger = log.getLogger();

const formatDetailedLogMessage = (msg: string, fileName: string, functionName: string): string => {
    return `${msg} (${fileName}, ${functionName})`;
}

export {
    logger,
    formatDetailedLogMessage,
}