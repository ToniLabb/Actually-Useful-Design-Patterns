export type CartItem = { sku: string; quantity: number; unitPrice: number };
export type CheckoutResult = { orderId: string; paymentId: string; total: number };

export class InventoryService {
  private stock = new Map([['BOOK-1', 5], ['MUG-1', 2]]);
  reserve(items: CartItem[]): void {
    for (const item of items) if ((this.stock.get(item.sku) ?? 0) < item.quantity) throw new Error(`Insufficient stock for ${item.sku}`);
    for (const item of items) this.stock.set(item.sku, (this.stock.get(item.sku) ?? 0) - item.quantity);
  }
  release(items: CartItem[]): void {
    for (const item of items) this.stock.set(item.sku, (this.stock.get(item.sku) ?? 0) + item.quantity);
  }
}
export class PaymentService {
  charge(token: string, amount: number): string {
    if (!token.startsWith('tok_')) throw new Error('Payment was declined');
    return `pay_${Math.round(amount * 100)}`;
  }
}
export class OrderService {
  create(customerId: string, items: CartItem[], paymentId: string): string {
    return `order_${customerId}_${items.length}_${paymentId.slice(-3)}`;
  }
}
export class NotificationService {
  sendConfirmation(email: string, orderId: string): void { console.log(`Confirmation for ${orderId} sent to ${email}`) }
}

export class CheckoutFacade {
  constructor(
    private readonly inventory = new InventoryService(),
    private readonly payments = new PaymentService(),
    private readonly orders = new OrderService(),
    private readonly notifications = new NotificationService(),
  ) {}
  checkout(input: { customerId: string; email: string; paymentToken: string; items: CartItem[] }): CheckoutResult {
    if (input.items.length === 0) throw new Error('The cart is empty');
    const total = input.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    this.inventory.reserve(input.items);
    try {
      const paymentId = this.payments.charge(input.paymentToken, total);
      const orderId = this.orders.create(input.customerId, input.items, paymentId);
      this.notifications.sendConfirmation(input.email, orderId);
      return { orderId, paymentId, total };
    } catch (error) {
      this.inventory.release(input.items);
      throw error;
    }
  }
}

export function run(){
  const checkout = new CheckoutFacade();
  console.log(checkout.checkout({ customerId: 'c42', email: 'ada@example.com', paymentToken: 'tok_demo', items: [{ sku: 'BOOK-1', quantity: 2, unitPrice: 24.5 }] }));
}
if (require.main === module) run();
