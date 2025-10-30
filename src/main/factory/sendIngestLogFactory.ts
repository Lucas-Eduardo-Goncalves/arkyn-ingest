import { SendIngestLogUseCase } from "../../app/useCases/sendIngestLog";
import { SendIngestLogController } from "../../infra/controllers/sendIngestLogController";
import { UserGateway } from "../../infra/gateways/user";
import { QueueService } from "../../infra/service/queueService";

const queueService = new QueueService();
const userGateway = new UserGateway();

const sendIngestLogUseCase = new SendIngestLogUseCase(
  queueService,
  userGateway
);

const sendIngestLogController = new SendIngestLogController(
  sendIngestLogUseCase
);

const sendIngestLog = {
  handle: sendIngestLogController.handle.bind(sendIngestLogController),
};

export { sendIngestLog };
