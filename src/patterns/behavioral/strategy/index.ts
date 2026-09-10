export type PricingContext = { basePrice: number; quantity: number; isVip?: boolean; couponPercent?: number };
export interface PricingStrategy { calculate(context: PricingContext): number }
const round = (value: number) => Math.round(value * 100) / 100;
export class StandardPricing implements PricingStrategy { calculate(context: PricingContext){ return round(context.basePrice * context.quantity) } }
export class VipPricing implements PricingStrategy { calculate(context: PricingContext){ return round(context.basePrice * context.quantity * (context.isVip ? 0.85 : 1)) } }
export class BlackFridayPricing implements PricingStrategy { calculate(context: PricingContext){ return round(context.basePrice * context.quantity * 0.7) } }
export class CouponPricing implements PricingStrategy {
  calculate(context: PricingContext){ const discount = Math.min(context.couponPercent ?? 0, 50) / 100; return round(context.basePrice * context.quantity * (1 - discount)) }
}
export class PricingEngine {
  constructor(private strategy: PricingStrategy) {}
  use(strategy: PricingStrategy){ this.strategy = strategy }
  price(context: PricingContext){ if (context.basePrice < 0 || context.quantity < 1) throw new Error('Invalid pricing input'); return this.strategy.calculate(context) }
}
export function run(){
  const engine = new PricingEngine(new StandardPricing());
  console.log('Standard:', engine.price({ basePrice: 100, quantity: 2 }));
  engine.use(new VipPricing()); console.log('VIP:', engine.price({ basePrice: 100, quantity: 2, isVip: true }));
  engine.use(new BlackFridayPricing()); console.log('Black Friday:', engine.price({ basePrice: 100, quantity: 2 }));
}
if (require.main === module) run();
