export interface DeliveryChannel {
  send(recipient: string, subject: string, body: string): void;
}

export class EmailChannel implements DeliveryChannel {
  send(recipient: string, subject: string, body: string) {
    console.log(`EMAIL to ${recipient}: ${subject} - ${body}`);
  }
}

export class SmsChannel implements DeliveryChannel {
  send(recipient: string, subject: string, body: string) {
    console.log(`SMS to ${recipient}: ${subject}: ${body}`);
  }
}

export class PushChannel implements DeliveryChannel {
  send(recipient: string, subject: string, body: string) {
    console.log(`PUSH to ${recipient}: ${subject} | ${body}`);
  }
}

export abstract class Notification {
  constructor(protected readonly channel: DeliveryChannel) {}
  abstract send(recipient: string): void;
}

export class OrderNotification extends Notification {
  constructor(
    channel: DeliveryChannel,
    private readonly orderId: string
  ) {
    super(channel);
  }
  send(recipient: string) {
    this.channel.send(recipient, 'Order confirmed', `Order ${this.orderId} is being prepared`);
  }
}

export class SecurityNotification extends Notification {
  constructor(
    channel: DeliveryChannel,
    private readonly location: string
  ) {
    super(channel);
  }
  send(recipient: string) {
    this.channel.send(recipient, 'New sign-in', `A sign-in was detected from ${this.location}`);
  }
}

export function run() {
  new OrderNotification(new EmailChannel(), 'order-42').send('ada@example.com');
  new SecurityNotification(new SmsChannel(), 'Madrid').send('+34123456789');
}

if (require.main === module) run();
