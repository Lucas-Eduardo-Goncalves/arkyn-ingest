import { SendIngestLogUseCase } from "../../app/useCases/sendIngestLog";
import { AuthMiddleware } from "../../main/middlewares/authMiddleware";
import { RouteDTO } from "../../main/types/routeDTO";
import { ErrorHandlerAdapter } from "../adapters/errorHandlerAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { ingestLogSchema } from "../schemas/internal/ingestLog";

class SendIngestLogController {
  constructor(private sendIngestLogUseCase: SendIngestLogUseCase) {}

  async handle(route: RouteDTO) {
    try {
      const { token } = await AuthMiddleware.authenticate(route);
      const schemaValidator = new SchemaValidatorAdapter(ingestLogSchema);

      const data = schemaValidator.validate(route.request.body);
      await this.sendIngestLogUseCase.execute(data, token);

      return route.response.json(null, 201);
    } catch (error) {
      return ErrorHandlerAdapter.handle(error);
    }
  }
}

export { SendIngestLogController };
