export type ProductDetails = Readonly<{
  brand: string;
  category: string;
  taxRate: number;
  imageUrl: string;
}>;

export class ProductDetailsFactory {
  private readonly pool = new Map<string, ProductDetails>();
  get(brand: string, category: string, taxRate: number, imageUrl: string): ProductDetails {
    const key = `${brand}|${category}|${taxRate}|${imageUrl}`;
    let details = this.pool.get(key);
    if (!details) {
      details = Object.freeze({ brand, category, taxRate, imageUrl });
      this.pool.set(key, details);
    }
    return details;
  }
  get size() {
    return this.pool.size;
  }
}

export class CatalogProduct {
  constructor(
    public readonly sku: string,
    public price: number,
    public stock: number,
    public readonly details: ProductDetails
  ) {}
  display() {
    return `${this.sku}: ${this.details.brand} ${this.details.category}, ${this.price} EUR (${this.stock} left)`;
  }
}

export function run() {
  const factory = new ProductDetailsFactory();
  const products = Array.from(
    { length: 10_000 },
    (_, index) =>
      new CatalogProduct(
        `BOOK-${index}`,
        20 + (index % 10),
        index % 5,
        factory.get('Acme', 'Books', 0.04, '/images/book.jpg')
      )
  );
  console.log(
    products[0].display(),
    `Products: ${products.length}, shared detail objects: ${factory.size}`
  );
}

if (require.main === module) run();
