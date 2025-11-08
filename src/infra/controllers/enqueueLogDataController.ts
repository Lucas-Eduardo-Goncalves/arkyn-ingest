import { EnqueueLogDataUseCase } from "../../app/useCases/enqueueLogDataUseCase";
import { AuthMiddleware } from "../../main/middlewares/authMiddleware";
import { RouteDTO } from "../../main/types/routeDTO";
import { ErrorHandlerAdapter } from "../adapters/errorHandlerAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { ingestLogSchema } from "../schemas/internal/ingestLog";

class EnqueueLogDataController {
  constructor(private enqueueLogDataUseCase: EnqueueLogDataUseCase) {}

  async handle(route: RouteDTO) {
    try {
      const { token } = await AuthMiddleware.authenticate(route);
      const schemaValidator = new SchemaValidatorAdapter(ingestLogSchema);

      const data = schemaValidator.validate({ ...route.request.body, token });
      await this.enqueueLogDataUseCase.execute(data);

      return route.response.json(null, 200);
    } catch (error) {
      return ErrorHandlerAdapter.handle(error);
    }
  }
}

export { EnqueueLogDataController };
