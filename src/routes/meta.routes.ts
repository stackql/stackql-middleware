// routes/meta.routes.ts
import { Router } from "../deps.ts";
import * as metaController from "../controllers/meta.controller.ts";

export const metaRouter = new Router()
  .get("/providers", metaController.getProviders)
  .get("/providers/:provider/services", metaController.getServices)
  .get("/providers/:provider/services/:service/resources", metaController.getResources)
  .get("/providers/:provider/services/:service/resources/:resource", metaController.getResourceDetails)
  .get("/providers/:provider/services/:service/resources/:resource/methods", metaController.getResourceMethods);
