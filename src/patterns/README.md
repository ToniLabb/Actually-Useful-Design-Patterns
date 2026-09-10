# Patterns

Each pattern has its own folder with an executable `index.ts` demo and a `README.md` focused on practical use.

The preferred README structure is:

1. Problem
2. Naive Solution
3. Pattern
4. TypeScript Implementation
5. When It Is Useful
6. When Not To Use It
7. Trade-Offs

Run a specific demo:

```bash
npm run demo -- <pattern-name>
```

Example names: `observer`, `singleton`, `factory-method`, `decorator`, `strategy`, `visitor`, and `chain-of-responsibility`.

Long-term folder shape for richer examples:

```text
/pattern-name
  README.md
  naive.ts
  pattern.ts
  example.ts
  pattern.test.ts
```
