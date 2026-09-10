# State

> Practical example: Order Lifecycle

## Problem

Paying, shipping, delivering, cancelling, and refunding are allowed only in certain order states. Repeated status switches become brittle.

## Naive Solution

Put a growing `switch(order.status)` in every operation and manually keep transition rules synchronized.

## Pattern

State separates the part that changes behind a focused object contract. The client works with that abstraction instead of coordinating concrete implementations directly.

## TypeScript Implementation

`Order` delegates operations to an `OrderState`; concrete states define allowed actions and perform explicit transitions while recording history.

Run it with:

```bash
npm run demo -- state
```

## When It Is Useful

Behavior and permitted operations change materially across a lifecycle.

## When Not To Use It

There are only two simple states with almost no state-specific behavior.

## Trade-Offs

Transitions become explicit and local, but more lifecycle states mean more classes and transition tests.

