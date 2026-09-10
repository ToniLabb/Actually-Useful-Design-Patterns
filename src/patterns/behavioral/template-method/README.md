# Template Method

> Practical example: Data Import Pipeline

## Problem

CSV and JSON imports share read, validate, transform, and persist stages while parsing differs by format.

## Naive Solution

Duplicate the full import workflow for every format, allowing validation or persistence order to drift.

## Pattern

Template Method separates the part that changes behind a focused object contract. The client works with that abstraction instead of coordinating concrete implementations directly.

## TypeScript Implementation

`DataImporter.import()` fixes the algorithm skeleton. Subclasses implement parsing and may override controlled steps.

Run it with:

```bash
npm run demo -- template-method
```

## When It Is Useful

Several workflows share a stable sequence with a few format-specific steps.

## When Not To Use It

Steps must be freely reordered or composition would provide more flexibility.

## Trade-Offs

The invariant workflow stays consistent, but inheritance couples variants to the template class.

