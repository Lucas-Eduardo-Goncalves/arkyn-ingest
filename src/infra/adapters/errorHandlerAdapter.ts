import { errorHandler } from "@arkyn/server";

class ErrorHandlerAdapter {
  static handle(error: any) {
    console.error(error);
    return errorHandler(error);
  }
}

export { ErrorHandlerAdapter };
