// services/logger.service.ts
import * as log from "https://deno.land/std@0.208.0/log/mod.ts";
import { config } from "../config/environment.ts";

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler(config.logging.level),
  },
  loggers: {
    default: {
      level: config.logging.level,
      handlers: ["console"],
    },
  }
});

export const logger = log.getLogger();