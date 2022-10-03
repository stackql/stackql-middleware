import { Router } from "https://deno.land/x/oak/mod.ts";

import * as miscRoutes from "./misc.routes.ts";
import * as queryRoutes from "./query.routes.ts";
import * as metaRoutes from "./meta.routes.ts";

const router: Router = new Router();

router
  .get("/ping", ...miscRoutes.ping);

router
  .post("/stackql", ...queryRoutes.runQuery);

router
  .get("/providers", ...metaRoutes.getProviders)
  .get("/providers/:providerName/services", ...metaRoutes.getServices)
  .get("/providers/:providerName/services/:serviceName/resources", ...metaRoutes.getResources)
  .get("/providers/:providerName/services/:serviceName/resources/:resourceName", ...metaRoutes.getResourceFields)
  .get("/providers/:providerName/services/:serviceName/resources/:resourceName/methods", ...metaRoutes.getResourceMethods);

export { router };