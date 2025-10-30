import { Context } from "hono";
import { RouteDTO } from "../../main/types/routeDTO";

type Route = (rawRoute: RouteDTO) => Promise<any>;

class RouteAdapter {
  async adaptRoute(context: Context, rawRoute: Route) {
    async function safeParseJson(): Promise<any> {
      if (context.req.method === "get") return {};
      try {
        return await context.req.json();
      } catch (error) {
        return null;
      }
    }

    return await rawRoute({
      request: {
        body: await safeParseJson(),
        params: context.req.param(),
        query: context.req.query(),
        headers: context.req.header(),
      },
      response: {
        json: (data: any, status?: any) => {
          return context.json(data);
        },
      },
    });
  }
}

export { RouteAdapter };
