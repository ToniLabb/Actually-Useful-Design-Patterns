# Visitor

> Practical example: Document AST Processing

## Problem

The same document tree needs HTML rendering, validation, word counts, and future exports without filling nodes with unrelated operations.

## Naive Solution

Add every operation as methods on every AST node or use repeated type checks outside the tree.

## Pattern

Visitor separates the part that changes behind a focused object contract. The client works with that abstraction instead of coordinating concrete implementations directly.

## TypeScript Implementation

Each node dispatches through `accept()`. Visitors implement one operation across heading, paragraph, and link node types.

Run it with:

```bash
npm run demo -- visitor
```

## When It Is Useful

The element structure is stable while new operations are added frequently.

## When Not To Use It

New node types are added more often than operations, because every visitor then needs modification.

## Trade-Offs

Operations stay grouped and double dispatch preserves node types, but adding an element is deliberately expensive.

