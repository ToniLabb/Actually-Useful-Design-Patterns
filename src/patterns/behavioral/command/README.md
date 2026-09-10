# Command

> Practical example: Job Queue

## Problem

Email and invoice operations must be queued, logged, executed later, and retried without the queue knowing service details.

## Naive Solution

Store callbacks with ad hoc metadata or make the worker switch on every job type.

## Pattern

Command separates the part that changes behind a focused object contract. The client works with that abstraction instead of coordinating concrete implementations directly.

## TypeScript Implementation

Each `JobCommand` packages a receiver and arguments behind `execute()`. `JobQueue` manages attempts and lifecycle uniformly.

Run it with:

```bash
npm run demo -- command
```

## When It Is Useful

Operations need queueing, retry, scheduling, audit, undo, or transport as data.

## When Not To Use It

An immediate function call has no lifecycle requirements.

## Trade-Offs

The queue is decoupled from receivers and commands are testable, but durable serialization needs an explicit command payload design.

