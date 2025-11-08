import { jwtVerify } from "jose";

import { environmentVariables } from "../../main/config/environmentVariables";
import { HttpAdapter } from "./httpAdapter";

class JwtAdapter {
  static async verify(bearerToken: string) {
    try {
      const secret = new TextEncoder().encode(environmentVariables.JWT_KEY);
      const token = bearerToken.replace("Bearer ", "");
      const { payload } = await jwtVerify(token, secret);
      const userId = payload?.id;

      if (typeof userId !== "string") {
        throw HttpAdapter.unauthorized("Invalid token");
      }
      return { userId, token };
    } catch (error) {
      throw HttpAdapter.unauthorized("Invalid token");
    }
  }
}

export { JwtAdapter };
