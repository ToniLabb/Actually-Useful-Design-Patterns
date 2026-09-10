export type Payment = { amount: number; currency: string; source: string };
export type PaymentResult = { id: string; status: 'succeeded' | 'failed' };
export interface PaymentGateway { charge(payment: Payment): PaymentResult }
export class StripeSdk {
  createPaymentIntent(input: { amountInCents: number; currency: string; token: string }){ return { id: 'pi_42', paid: input.token.startsWith('tok_') } }
}
export class PayPalSdk {
  executePayment(total: string, currencyCode: string, payerId: string){ return { transactionId: 'pp_42', state: payerId ? 'approved' : 'denied' } }
}
export class StripeAdapter implements PaymentGateway {
  constructor(private readonly stripe: StripeSdk) {}
  charge(payment: Payment): PaymentResult {
    const result = this.stripe.createPaymentIntent({ amountInCents: Math.round(payment.amount * 100), currency: payment.currency.toLowerCase(), token: payment.source });
    return { id: result.id, status: result.paid ? 'succeeded' : 'failed' };
  }
}
export class PayPalAdapter implements PaymentGateway {
  constructor(private readonly paypal: PayPalSdk) {}
  charge(payment: Payment): PaymentResult {
    const result = this.paypal.executePayment(payment.amount.toFixed(2), payment.currency, payment.source);
    return { id: result.transactionId, status: result.state === 'approved' ? 'succeeded' : 'failed' };
  }
}
export class BillingService {
  constructor(private readonly gateway: PaymentGateway) {}
  collect(payment: Payment){ if (payment.amount <= 0) throw new Error('Amount must be positive'); return this.gateway.charge(payment) }
}
export function run(){
  console.log(new BillingService(new StripeAdapter(new StripeSdk())).collect({ amount: 49.99, currency: 'EUR', source: 'tok_visa' }));
  console.log(new BillingService(new PayPalAdapter(new PayPalSdk())).collect({ amount: 49.99, currency: 'EUR', source: 'payer-42' }));
}
if (require.main === module) run();
