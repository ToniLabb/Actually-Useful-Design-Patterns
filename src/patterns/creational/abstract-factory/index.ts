export interface ObjectStorage {
  upload(key: string, content: string): string;
}

export interface MessageQueue {
  publish(topic: string, payload: string): string;
}

export interface CloudFactory {
  createStorage(): ObjectStorage;
  createQueue(): MessageQueue;
}

export class S3Storage implements ObjectStorage {
  upload(key: string) {
    return `s3://app-bucket/${key}`;
  }
}

export class SqsQueue implements MessageQueue {
  publish(topic: string, payload: string) {
    return `SQS ${topic}: ${payload}`;
  }
}

export class AzureBlobStorage implements ObjectStorage {
  upload(key: string) {
    return `https://account.blob.core.windows.net/app/${key}`;
  }
}

export class AzureServiceBus implements MessageQueue {
  publish(topic: string, payload: string) {
    return `Service Bus ${topic}: ${payload}`;
  }
}

export class AwsFactory implements CloudFactory {
  createStorage() {
    return new S3Storage();
  }
  createQueue() {
    return new SqsQueue();
  }
}

export class AzureFactory implements CloudFactory {
  createStorage() {
    return new AzureBlobStorage();
  }
  createQueue() {
    return new AzureServiceBus();
  }
}

export class ReportPublisher {
  constructor(
    private readonly storage: ObjectStorage,
    private readonly queue: MessageQueue
  ) {}
  publish(filename: string, content: string) {
    const url = this.storage.upload(filename, content);
    return { url, event: this.queue.publish('report.ready', JSON.stringify({ url })) };
  }
}

export function configureCloud(provider: 'aws' | 'azure'): ReportPublisher {
  const factory: CloudFactory = provider === 'aws' ? new AwsFactory() : new AzureFactory();
  return new ReportPublisher(factory.createStorage(), factory.createQueue());
}

export function run() {
  console.log(configureCloud('aws').publish('sales.csv', 'total,42'));
  console.log(configureCloud('azure').publish('sales.csv', 'total,42'));
}

if (require.main === module) run();
