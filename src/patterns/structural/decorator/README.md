# Decorator

> Practical example: HTTP Client Middleware

## Problem

An HTTP client needs caching and logging today, with retry, metrics, or auth likely later. Different callers need different combinations.

## Naive Solution

Add every feature to the base client or create subclasses for all feature combinations.

## Pattern

Decorator separates the part that changes behind a focused object contract. The client works with that abstraction instead of coordinating concrete implementations directly.

## TypeScript Implementation

Each `HttpClientDecorator` preserves the `HttpClient` contract. Caching and logging wrappers can be stacked around `ApiHttpClient` at runtime.

Run it with:

```bash
npm run demo -- decorator
```

## When It Is Useful

Cross-cutting features must be optional, composable, and ordered per client instance.

## When Not To Use It

A single fixed behavior belongs directly in the client or a configuration flag is clearer.

## Trade-Offs

Features compose without subclass explosion, but wrapper order matters and debugging crosses multiple objects.

