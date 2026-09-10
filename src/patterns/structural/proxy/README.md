# Proxy

> Practical example: API Rate Limiting

## Problem

An API service must reject clients that exceed a request quota without putting policy code in the real service.

## Naive Solution

Repeat counters and access checks in every endpoint or modify the service for infrastructure concerns.

## Pattern

Proxy separates the part that changes behind a focused object contract. The client works with that abstraction instead of coordinating concrete implementations directly.

## TypeScript Implementation

`RateLimitingProxy` implements the same `ApiService` contract, tracks a window per client, and delegates allowed requests to `RealApiService`.

Run it with:

```bash
npm run demo -- proxy
```

## When It Is Useful

Access to a service needs rate limits, authorization, caching, lazy initialization, or remote-call handling.

## When Not To Use It

The wrapper merely forwards calls or infrastructure already enforces the policy adequately.

## Trade-Offs

The real service stays focused, but proxy state and semantics must match deployment topology.

