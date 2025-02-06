// routes/query.routes.ts
import { Router } from "../deps.ts";
import * as queryController from "../controllers/query.controller.ts";

export const queryRouter = new Router()
  .post("/stackql", queryController.executeQuery);