# Patterns

Each pattern has its own folder with an executable `index.ts` demo and a `README.md` focused on practical use.

Every pattern README follows this structure:

1. Problem
2. Naive Solution
3. Pattern
4. Structure Diagram
5. TypeScript Implementation
6. When It Is Useful
7. When Not To Use It
8. Trade-Offs

Run a specific demo:

```bash
npm run demo -- <pattern-name>
```

Example names: `observer`, `singleton`, `factory-method`, `decorator`, `strategy`, `visitor`, and `chain-of-responsibility`.

Each pattern folder contains exactly the executable implementation and its documentation:

```text
<pattern-name>/
  index.ts
  README.md
```
