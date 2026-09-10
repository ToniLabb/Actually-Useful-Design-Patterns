# Composite

> Practical example: File and Folder Permissions

## Problem

Permissions must apply to a file or recursively to an entire folder tree through one API.

## Naive Solution

Write separate code paths for files and folders, manually walking children in every operation.

## Pattern

Composite separates the part that changes behind a focused object contract. The client works with that abstraction instead of coordinating concrete implementations directly.

## TypeScript Implementation

`Resource` defines uniform permission operations. `FileResource` is a leaf and `FolderResource` forwards grants and revocations recursively.

Run it with:

```bash
npm run demo -- composite
```

## When It Is Useful

Clients should treat individual objects and nested groups uniformly.

## When Not To Use It

Leaf and container behavior differs substantially or recursive propagation is unsafe.

## Trade-Offs

Tree-wide operations become simple, but implicit recursion can be expensive and permission inheritance needs clear rules.

