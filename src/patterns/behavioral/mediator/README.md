# Mediator

> Practical example: Checkout Form Orchestration

## Problem

Changing a shipping address affects shipping options, payment methods, and totals. Direct component references create a dependency web.

## Naive Solution

Let every form component know and call every component affected by its changes.

## Pattern

Mediator separates the part that changes behind a focused object contract. The client works with that abstraction instead of coordinating concrete implementations directly.

## TypeScript Implementation

`CheckoutCoordinator` receives component events and coordinates updates; components depend only on the mediator contract.

Run it with:

```bash
npm run demo -- mediator
```

## When It Is Useful

Many peer components interact and their coordination rules belong in one place.

## When Not To Use It

Only two components communicate or the mediator starts absorbing their core business logic.

## Trade-Offs

Components remain independent, but the mediator can become complex if its scope is not bounded.

