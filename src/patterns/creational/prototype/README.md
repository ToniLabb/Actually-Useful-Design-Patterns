# Prototype

> Practical example: Document Template Cloning

## Problem

Invoices and reports usually begin from a standard template, then receive per-customer content and metadata.

## Naive Solution

Rebuild every document from scratch or mutate one shared template, risking leaked data between documents.

## Pattern

Prototype separates the part that changes behind a focused object contract. The client works with that abstraction instead of coordinating concrete implementations directly.

## TypeScript Implementation

`DocumentTemplate.clone()` deep-copies nested sections and metadata. `TemplateRegistry` stores named prototypes and creates independent documents.

Run it with:

```bash
npm run demo -- prototype
```

## When It Is Useful

Creating an object is expensive or most of its nested configuration should be copied from known templates.

## When Not To Use It

A fresh object is cheap and has little default state.

## Trade-Offs

Cloning removes repetitive setup, but deep-copy semantics and mutable fields must be defined carefully.

