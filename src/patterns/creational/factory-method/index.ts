export type NotificationMessage = { recipient: string; subject: string; body: string };

export interface NotificationProvider {
  send(message: NotificationMessage): string;
}

export abstract class NotificationService {
  protected abstract createProvider(): NotificationProvider;
  notify(message: NotificationMessage): string {
    if (!message.recipient || !message.body) throw new Error('Recipient and body are required');
    return this.createProvider().send(message);
  }
}

export class EmailProvider implements NotificationProvider {
  send(message: NotificationMessage) {
    return `Email sent to ${message.recipient}: ${message.subject}`;
  }
}

export class SmsProvider implements NotificationProvider {
  send(message: NotificationMessage) {
    return `SMS sent to ${message.recipient}: ${message.body}`;
  }
}

export class SlackProvider implements NotificationProvider {
  send(message: NotificationMessage) {
    return `Slack message posted in ${message.recipient}: ${message.body}`;
  }
}

export class EmailNotificationService extends NotificationService {
  protected createProvider() {
    return new EmailProvider();
  }
}

export class SmsNotificationService extends NotificationService {
  protected createProvider() {
    return new SmsProvider();
  }
}

export class SlackNotificationService extends NotificationService {
  protected createProvider() {
    return new SlackProvider();
  }
}

export function run() {
  const message = {
    recipient: 'ada@example.com',
    subject: 'Order ready',
    body: 'Your order is ready'
  };
  console.log(new EmailNotificationService().notify(message));
  console.log(new SlackNotificationService().notify({ ...message, recipient: '#orders' }));
}

if (require.main === module) run();
