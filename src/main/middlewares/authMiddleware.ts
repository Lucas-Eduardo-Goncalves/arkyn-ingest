import { HttpAdapter } from "../../infra/adapters/httpAdapter";
import { JwtAdapter } from "../../infra/adapters/jwtAdapter";
import { SchemaValidatorAdapter } from "../../infra/adapters/schemaValidatorAdapter";
import { userIdSchema } from "../../infra/schemas/internal/user";
import { RouteDTO } from "../types/routeDTO";

class AuthMiddleware {
  static async authenticate(route: RouteDTO) {
    const bearerToken = route?.request?.headers?.authorization;
    if (!bearerToken) throw HttpAdapter.badRequest("No token provided");

    const token = bearerToken.replace("Bearer ", "");

    const jwtAdapter = new JwtAdapter();
    const { userId } = await jwtAdapter.verify(token);

    const schemaValidator = new SchemaValidatorAdapter(userIdSchema);
    schemaValidator.validate({ userId });

    return { token };
  }
}

export { AuthMiddleware };
