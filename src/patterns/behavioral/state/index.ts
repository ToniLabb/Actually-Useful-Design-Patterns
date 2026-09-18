export type OrderData = { id: string; paidAt?: Date; shippedAt?: Date; cancelledAt?: Date };

export interface OrderState {
  readonly name: string;
  pay(order: Order): void;
  ship(order: Order): void;
  cancel(order: Order): void;
  deliver(order: Order): void;
  refund(order: Order): void;
}
abstract class BaseOrderState implements OrderState {
  abstract readonly name: string;
  pay(_order: Order): void {
    throw new Error(`Cannot pay an order in ${this.name} state`);
  }
  ship(_order: Order): void {
    throw new Error(`Cannot ship an order in ${this.name} state`);
  }
  cancel(_order: Order): void {
    throw new Error(`Cannot cancel an order in ${this.name} state`);
  }
  deliver(_order: Order): void {
    throw new Error(`Cannot deliver an order in ${this.name} state`);
  }
  refund(_order: Order): void {
    throw new Error(`Cannot refund an order in ${this.name} state`);
  }
}

export class PendingPaymentState extends BaseOrderState {
  readonly name = 'pending-payment';
  pay(order: Order) {
    order.data.paidAt = new Date();
    order.transitionTo(new PaidState());
  }
  cancel(order: Order) {
    order.data.cancelledAt = new Date();
    order.transitionTo(new CancelledState());
  }
}

export class PaidState extends BaseOrderState {
  readonly name = 'paid';
  ship(order: Order) {
    order.data.shippedAt = new Date();
    order.transitionTo(new ShippedState());
  }
  cancel(order: Order) {
    console.log(`Refund issued for ${order.data.id}`);
    order.data.cancelledAt = new Date();
    order.transitionTo(new CancelledState());
  }
  refund(order: Order) {
    console.log(`Refund issued for ${order.data.id}`);
    order.transitionTo(new RefundedState());
  }
}

export class ShippedState extends BaseOrderState {
  readonly name = 'shipped';
  deliver(order: Order) {
    order.transitionTo(new DeliveredState());
  }
}

export class DeliveredState extends BaseOrderState {
  readonly name = 'delivered';
}

export class RefundedState extends BaseOrderState {
  readonly name = 'refunded';
}

export class CancelledState extends BaseOrderState {
  readonly name = 'cancelled';
}

export class Order {
  private state: OrderState = new PendingPaymentState();
  private readonly history: string[] = [this.state.name];
  constructor(public readonly data: OrderData) {}
  get status() {
    return this.state.name;
  }
  get stateHistory() {
    return [...this.history];
  }
  transitionTo(state: OrderState) {
    this.state = state;
    this.history.push(state.name);
  }
  pay() {
    this.state.pay(this);
  }
  ship() {
    this.state.ship(this);
  }
  cancel() {
    this.state.cancel(this);
  }
  deliver() {
    this.state.deliver(this);
  }
  refund() {
    this.state.refund(this);
  }
}

export function run() {
  const order = new Order({ id: 'order-42' });
  order.pay();
  order.ship();
  order.deliver();
  console.log('Status:', order.status, 'History:', order.stateHistory);
  try {
    order.cancel();
  } catch (error) {
    console.log((error as Error).message);
  }
}

if (require.main === module) run();
