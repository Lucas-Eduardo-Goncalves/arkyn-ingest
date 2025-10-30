import { UserGatewayDTO } from "../../domain/gateways/user";
import { QueueService } from "../../infra/service/queueService";
import { HttpMethod } from "../../main/types/httpMethod";

type InputProps = {
  domainUrl: string;
  pathnameUrl: string;
  trafficSourceId: string;
  status: number;
  protocol: "http" | "https";
  method: HttpMethod;
  trafficUserId: string | null;
  requestHeaders: string;
  requestBody: string | null;
  queryParams: string;
  responseHeaders: string;
  responseBody: string | null;
  elapsedTime: number;
};

class SendIngestLogUseCase {
  constructor(
    private queueService: QueueService,
    private userGateway: UserGatewayDTO
  ) {}

  async execute(input: InputProps, token: string) {
    await this.userGateway.validateUserId(token);

    await this.queueService.initialize();
    await this.queueService.sendMessage(JSON.stringify(input));
    await this.queueService.disconnect();

    return;
  }
}

export { SendIngestLogUseCase };
