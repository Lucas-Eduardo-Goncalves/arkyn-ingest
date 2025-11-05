import { Hono } from "hono";
import { hostname } from "os";
import { version, name } from "../package.json";

import { environmentVariables } from "./main/config/environmentVariables";
import { RouteLogMiddleware } from "./main/middlewares/routeLogMiddleware";

import { cacheDb } from "./infra/adapters/cacheDbAdapter";
import { RouteAdapter } from "./infra/adapters/routeAdapter";
import { sendIngestLog } from "./main/factory/sendIngestLogFactory";

const app = new Hono();
const { adaptRoute } = new RouteAdapter();

cacheDb.connect();

app.use("*", (c, next) => RouteLogMiddleware.logRoute(c, next));

app.get("/health-check", (c) => {
  const message = `Service ${name} is healthy on container ${hostname()} using version ${version}`;
  return c.text(message);
});

app.post("/ingest-log", async (c) => adaptRoute(c, sendIngestLog.handle));

export default {
  port: environmentVariables.PORT,
  fetch: app.fetch,
};
