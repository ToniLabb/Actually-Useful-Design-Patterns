# Interpreter

> Practical example: Search Filter Language

## Problem

Users need filters such as `status:active AND price<100 AND country:ES` evaluated consistently over products.

## Naive Solution

Split strings inside repository code and add special cases whenever syntax grows.

## Pattern

Interpreter separates the part that changes behind a focused object contract. The client works with that abstraction instead of coordinating concrete implementations directly.

## TypeScript Implementation

`QueryParser` creates expression objects for equality, comparison, and conjunction; the resulting tree interprets each product.

Run it with:

```bash
npm run demo -- interpreter
```

## When It Is Useful

A small, stable domain language provides real value and needs composable grammar rules.

## When Not To Use It

The grammar is complex enough for a parser library or only one fixed filter is needed.

## Trade-Offs

The language model is extensible and testable, but parsing, precedence, and error reporting grow quickly.

