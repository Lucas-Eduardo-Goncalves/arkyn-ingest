import { Hono } from "hono";
import { hostname } from "os";
import { name, version } from "../package.json";

import { environmentVariables } from "./main/config/environmentVariables";
import { RouteLogMiddleware } from "./main/middlewares/routeLogMiddleware";

import { RouteAdapter } from "./infra/adapters/routeAdapter";
import { enqueueLogData } from "./main/factory/enqueueLogDataFactory";

const app = new Hono();
const { adaptRoute } = new RouteAdapter();

app.use("*", (c, next) => RouteLogMiddleware.logRoute(c, next));

app.get("/health-check", (c) => {
  const message = `Service ${name} is healthy on container ${hostname()} using version ${version}`;
  return c.text(message);
});

app.post("/ingest-log", async (c) => adaptRoute(c, enqueueLogData.handle));

export default {
  port: environmentVariables.PORT,
  fetch: app.fetch,
};
