import { Hono } from "hono";
import { hostname } from "os";
import { version } from "../package.json";

import { environmentVariables } from "./main/config/environmentVariables";
import { RouteLogMiddleware } from "./main/middlewares/routeLogMiddleware";

import { cacheDb } from "./infra/adapters/cacheDbAdapter";
import { RouteAdapter } from "./infra/adapters/routeAdapter";
import { sendIngestLog } from "./main/factory/sendIngestLogFactory";

const app = new Hono();
const { adaptRoute } = new RouteAdapter();

cacheDb.connect();

app.use("*", (c, next) => RouteLogMiddleware.logRoute(c, next));

app.get("/health-check", (c) =>
  c.text(`${hostname()} - Service is healthy on version ${version}`)
);

app.post("/ingest-log", async (c) => adaptRoute(c, sendIngestLog.handle));

export default {
  port: environmentVariables.PORT,
  fetch: app.fetch,
};
