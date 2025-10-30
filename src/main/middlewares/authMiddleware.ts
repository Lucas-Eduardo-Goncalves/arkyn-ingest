import { HttpAdapter } from "../../infra/adapters/httpAdapter";
import { JwtAdapter } from "../../infra/adapters/jwtAdapter";
import { RouteDTO } from "../types/routeDTO";

class AuthMiddleware {
  static async authenticate(route: RouteDTO) {
    const token = route?.request?.headers?.authorization?.replace(
      "Bearer ",
      ""
    );

    if (!token) throw HttpAdapter.badRequest("No token provided");

    const jwtAdapter = new JwtAdapter();
    const { userId } = await jwtAdapter.verify(token);

    return { userId, token };
  }
}

export { AuthMiddleware };
