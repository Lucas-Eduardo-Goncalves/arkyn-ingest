import { Kafka, Producer } from "kafkajs";
import { environmentVariables } from "../../main/config/environmentVariables";

class QueueService {
  producer: Producer;

  constructor() {
    const brokers = [environmentVariables.MICRO_QUEUE_IP];
    const kafka = new Kafka({ brokers });
    this.producer = kafka.producer();
  }

  async initialize() {
    await this.producer.connect();
  }

  async sendMessage(message: string) {
    const topic = "ingest-logs";
    await this.producer.send({ topic: topic, messages: [{ value: message }] });
  }

  async disconnect() {
    await this.producer.disconnect();
  }
}

export { QueueService };
