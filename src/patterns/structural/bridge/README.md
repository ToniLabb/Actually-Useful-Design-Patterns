# Bridge

> Practical example: Notifications and Delivery Channels

## Problem

Order, security, and marketing notifications can each be delivered by email, SMS, or push. Subclassing both dimensions creates a class explosion.

## Naive Solution

Create classes such as `EmailOrderNotification`, `SmsOrderNotification`, and every future combination.

## Pattern

Bridge separates the part that changes behind a focused object contract. The client works with that abstraction instead of coordinating concrete implementations directly.

## TypeScript Implementation

Notification types form the abstraction hierarchy; `DeliveryChannel` implementations form a separate hierarchy connected by composition.

Run it with:

```bash
npm run demo -- bridge
```

## When It Is Useful

Two independent dimensions need to evolve and combine freely.

## When Not To Use It

Only one dimension varies or simple function composition communicates the design better.

## Trade-Offs

New notification types and channels are added independently, though the extra indirection requires clear naming.

