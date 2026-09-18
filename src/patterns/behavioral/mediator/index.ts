export interface CheckoutMediator {
  notify(sender: CheckoutComponent, event: string): void;
}

export abstract class CheckoutComponent {
  protected mediator?: CheckoutMediator;
  setMediator(mediator: CheckoutMediator) {
    this.mediator = mediator;
  }
}

export class AddressForm extends CheckoutComponent {
  country = '';
  updateCountry(country: string) {
    this.country = country;
    this.mediator?.notify(this, 'address.changed');
  }
}

export class ShippingSelector extends CheckoutComponent {
  options: string[] = [];
  selected?: string;
  loadFor(country: string) {
    this.options = country === 'ES' ? ['standard', 'express'] : ['international'];
    this.selected = this.options[0];
  }
}

export class PaymentForm extends CheckoutComponent {
  enabledMethods: string[] = [];
  updateFor(country: string) {
    this.enabledMethods = country === 'ES' ? ['card', 'bizum'] : ['card', 'paypal'];
  }
}

export class OrderSummary extends CheckoutComponent {
  shippingCost = 0;
  refresh(method?: string) {
    this.shippingCost = method === 'express' ? 9.99 : 3.99;
  }
}

export class CheckoutCoordinator implements CheckoutMediator {
  constructor(
    private address: AddressForm,
    private shipping: ShippingSelector,
    private payment: PaymentForm,
    private summary: OrderSummary
  ) {
    for (const component of [address, shipping, payment, summary]) component.setMediator(this);
  }
  notify(sender: CheckoutComponent, event: string): void {
    if (sender === this.address && event === 'address.changed') {
      this.shipping.loadFor(this.address.country);
      this.payment.updateFor(this.address.country);
      this.summary.refresh(this.shipping.selected);
    }
  }
}

export function run() {
  const address = new AddressForm(),
    shipping = new ShippingSelector(),
    payment = new PaymentForm(),
    summary = new OrderSummary();
  new CheckoutCoordinator(address, shipping, payment, summary);
  address.updateCountry('ES');
  console.log({
    shipping: shipping.options,
    payments: payment.enabledMethods,
    shippingCost: summary.shippingCost
  });
}

if (require.main === module) run();
