# Adapter

> Practical example: Payment Gateway Integration

## Problem

Stripe and PayPal expose different names, units, payloads, and status values, while billing needs one stable contract.

## Naive Solution

Teach the billing service every SDK and branch on the selected vendor during each payment.

## Pattern

Adapter separates the part that changes behind a focused object contract. The client works with that abstraction instead of coordinating concrete implementations directly.

## TypeScript Implementation

`StripeAdapter` and `PayPalAdapter` translate the common `PaymentGateway` contract to each SDK and normalize their responses.

Run it with:

```bash
npm run demo -- adapter
```

## When It Is Useful

Integrating third-party or legacy APIs whose interfaces you cannot control.

## When Not To Use It

You own both APIs and can establish one contract directly.

## Trade-Offs

Vendor churn stays at the boundary, but adapters must preserve meaningful provider differences and errors.

