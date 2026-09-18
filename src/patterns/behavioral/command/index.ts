export interface JobCommand {
  readonly type: string;
  execute(): void;
}

export class EmailService {
  send(to: string, subject: string) {
    console.log(`Email to ${to}: ${subject}`);
  }
}

export class InvoiceService {
  generate(orderId: string) {
    console.log(`Invoice generated for ${orderId}`);
  }
}

export class SendEmailCommand implements JobCommand {
  readonly type = 'send-email';
  constructor(
    private readonly service: EmailService,
    private readonly to: string,
    private readonly subject: string
  ) {}
  execute() {
    this.service.send(this.to, this.subject);
  }
}

export class GenerateInvoiceCommand implements JobCommand {
  readonly type = 'generate-invoice';
  constructor(
    private readonly service: InvoiceService,
    private readonly orderId: string
  ) {}
  execute() {
    this.service.generate(this.orderId);
  }
}
type QueuedJob = { command: JobCommand; attempts: number };

export class JobQueue {
  private readonly jobs: QueuedJob[] = [];
  constructor(private readonly maxAttempts = 3) {}
  enqueue(command: JobCommand) {
    this.jobs.push({ command, attempts: 0 });
  }
  process(): void {
    while (this.jobs.length) {
      const job = this.jobs.shift()!;
      try {
        job.attempts++;
        job.command.execute();
        console.log(`${job.command.type} completed`);
      } catch (error) {
        console.log(`${job.command.type} failed on attempt ${job.attempts}`);
        if (job.attempts < this.maxAttempts) this.jobs.push(job);
        else console.error(error);
      }
    }
  }
}

export function run() {
  const queue = new JobQueue();
  queue.enqueue(new SendEmailCommand(new EmailService(), 'ada@example.com', 'Welcome'));
  queue.enqueue(new GenerateInvoiceCommand(new InvoiceService(), 'order-42'));
  queue.process();
}

if (require.main === module) run();
