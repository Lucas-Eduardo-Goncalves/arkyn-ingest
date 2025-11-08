import { EnqueueLogDataUseCase } from "../../app/useCases/enqueueLogDataUseCase";
import { EnqueueLogDataController } from "../../infra/controllers/enqueueLogDataController";
import { QueueService } from "../../infra/service/queueService";

const queueService = new QueueService();

const enqueueLogDataUseCase = new EnqueueLogDataUseCase(queueService);

const enqueueLogDataController = new EnqueueLogDataController(
  enqueueLogDataUseCase
);

const enqueueLogData = {
  handle: enqueueLogDataController.handle.bind(enqueueLogDataController),
};

export { enqueueLogData };
