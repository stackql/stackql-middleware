// routes/health.routes.ts
import { Router } from "../deps.ts";
import * as healthController from "../controllers/health.controller.ts";

export const healthRouter = new Router()
  .get("/health", healthController.healthCheck);