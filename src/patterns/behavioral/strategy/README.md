# Strategy

> Practical example: Pricing and Discount Engine

## Problem

Pricing began as base price times quantity, then VIP, Black Friday, coupons, and subscriptions added competing branches.

## Naive Solution

Grow one pricing function with an `if/else` for every campaign and customer segment.

## Pattern

Strategy separates the part that changes behind a focused object contract. The client works with that abstraction instead of coordinating concrete implementations directly.

## TypeScript Implementation

Each `PricingStrategy` owns one algorithm. `PricingEngine` validates shared input and switches strategy at runtime.

Run it with:

```bash
npm run demo -- strategy
```

## When It Is Useful

Algorithms vary independently and are selected by campaign, tenant, customer, or runtime configuration.

## When Not To Use It

There are only one or two tiny branches or a callback is sufficient.

## Trade-Offs

Pricing rules are isolated and testable, but selection and compatibility between strategies remain client responsibilities.

