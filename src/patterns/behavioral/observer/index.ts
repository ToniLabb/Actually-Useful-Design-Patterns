export type DomainEvent =
  | { type: 'order.placed'; orderId: string; email: string; total: number }
  | { type: 'order.paid'; orderId: string; email: string; total: number }
  | { type: 'order.shipped'; orderId: string; trackingCode: string };

export type EventHandler<T extends DomainEvent = DomainEvent> = (event: T) => void;

export class EventBus {
  private readonly handlers = new Map<DomainEvent['type'], Set<EventHandler>>();
  subscribe<T extends DomainEvent['type']>(
    type: T,
    handler: EventHandler<Extract<DomainEvent, { type: T }>>
  ): () => void {
    const handlers = this.handlers.get(type) ?? new Set<EventHandler>();
    handlers.add(handler as EventHandler);
    this.handlers.set(type, handlers);
    return () => handlers.delete(handler as EventHandler);
  }
  publish(event: DomainEvent): void {
    for (const handler of [...(this.handlers.get(event.type) ?? [])]) {
      try {
        handler(event);
      } catch (error) {
        console.error(`Subscriber for ${event.type} failed:`, error);
      }
    }
  }
}

export class EmailNotifier {
  onOrderPlaced(event: Extract<DomainEvent, { type: 'order.placed' }>): void {
    console.log(`Email sent to ${event.email} for order ${event.orderId}`);
  }
}

export class AnalyticsTracker {
  onOrderPlaced(event: Extract<DomainEvent, { type: 'order.placed' }>): void {
    console.log(`Analytics: order ${event.orderId}, revenue ${event.total}`);
  }
}

export class ShippingDashboard {
  onOrderShipped(event: Extract<DomainEvent, { type: 'order.shipped' }>): void {
    console.log(`Shipping: ${event.orderId} uses ${event.trackingCode}`);
  }
}

export class InvoiceGenerator {
  onOrderPaid(event: Extract<DomainEvent, { type: 'order.paid' }>): void {
    console.log(`Invoice generated for ${event.orderId}`);
  }
}

export class InventoryUpdater {
  onOrderPaid(event: Extract<DomainEvent, { type: 'order.paid' }>): void {
    console.log(`Inventory committed for ${event.orderId}`);
  }
}

export function run() {
  const bus = new EventBus();
  const email = new EmailNotifier();
  const analytics = new AnalyticsTracker();
  const shipping = new ShippingDashboard();
  const invoices = new InvoiceGenerator();
  const inventory = new InventoryUpdater();
  const unsubscribeEmail = bus.subscribe('order.placed', (event) => email.onOrderPlaced(event));
  bus.subscribe('order.placed', (event) => analytics.onOrderPlaced(event));
  bus.subscribe('order.shipped', (event) => shipping.onOrderShipped(event));
  bus.subscribe('order.paid', (event) => invoices.onOrderPaid(event));
  bus.subscribe('order.paid', (event) => inventory.onOrderPaid(event));
  bus.publish({ type: 'order.placed', orderId: 'o-42', email: 'ada@example.com', total: 79 });
  unsubscribeEmail();
  bus.publish({ type: 'order.paid', orderId: 'o-42', email: 'ada@example.com', total: 79 });
  bus.publish({ type: 'order.shipped', orderId: 'o-42', trackingCode: 'TRACK-123' });
}

if (require.main === module) run();
