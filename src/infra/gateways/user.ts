import { UserGatewayDTO } from "../../domain/gateways/user";
import { HttpAdapter } from "../adapters/httpAdapter";
import { microAuth } from "../https/microAuth";

class UserGateway implements UserGatewayDTO {
  async validateUserId(token: string): Promise<string> {
    const apiResponse = await microAuth.post(`/users/validate`, { token });

    if (!apiResponse.success) {
      throw HttpAdapter.badGateway(apiResponse.message, apiResponse.cause);
    }

    const userId = apiResponse.response?.userId;

    if (typeof userId !== "string") {
      throw HttpAdapter.badRequest("Invalid user ID");
    }

    return userId;
  }
}

export { UserGateway };
