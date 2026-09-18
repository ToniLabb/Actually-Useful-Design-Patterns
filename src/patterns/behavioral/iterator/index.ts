export type Page<T> = { items: T[]; nextCursor?: string };

export interface PaginatedApi<T> {
  fetchPage(cursor?: string): Page<T>;
}

export class InMemoryProductsApi implements PaginatedApi<string> {
  constructor(
    private readonly items: string[],
    private readonly pageSize = 2
  ) {}
  fetchPage(cursor?: string): Page<string> {
    const start = cursor ? Number(cursor) : 0;
    const items = this.items.slice(start, start + this.pageSize);
    const next = start + items.length;
    return { items, nextCursor: next < this.items.length ? String(next) : undefined };
  }
}

export class PaginatedApiCollection<T> implements Iterable<T> {
  constructor(private readonly api: PaginatedApi<T>) {}
  *[Symbol.iterator](): Iterator<T> {
    let cursor: string | undefined;
    do {
      const page = this.api.fetchPage(cursor);
      yield* page.items;
      cursor = page.nextCursor;
    } while (cursor !== undefined);
  }
}

export function run() {
  const products = new PaginatedApiCollection(
    new InMemoryProductsApi(['keyboard', 'mouse', 'monitor', 'desk', 'chair'])
  );
  for (const product of products) console.log(product);
}

if (require.main === module) run();
