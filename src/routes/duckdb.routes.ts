// routes/duckdb.routes.ts
import { Router } from "../deps.ts";
import * as duckdbController from "../controllers/duckdb.controller.ts";

export const duckdbRouter = new Router()
  .post("/duckdb", duckdbController.executeQuery);