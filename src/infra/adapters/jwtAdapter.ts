import { jwtVerify } from "jose";

import { environmentVariables } from "../../main/config/environmentVariables";
import { HttpAdapter } from "./httpAdapter";

class JwtAdapter {
  constructor() {}

  async verify(rawToken: string) {
    try {
      const secret = new TextEncoder().encode(environmentVariables.JWT_KEY);
      const token = rawToken.replace("Bearer ", "");
      const { payload } = await jwtVerify(token, secret);
      const userId = payload?.id;

      if (typeof userId !== "string") {
        throw HttpAdapter.unauthorized("Invalid token");
      }
      return { userId };
    } catch (error) {
      throw HttpAdapter.unauthorized("Invalid token");
    }
  }
}

export { JwtAdapter };
