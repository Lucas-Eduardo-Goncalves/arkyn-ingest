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
  token: string;
};

class EnqueueLogDataUseCase {
  constructor(private queueService: QueueService) {}

  async execute(input: InputProps) {
    await this.queueService.initialize();
    await this.queueService.sendMessage(JSON.stringify(input));
    await this.queueService.disconnect();

    return;
  }
}

export { EnqueueLogDataUseCase };
