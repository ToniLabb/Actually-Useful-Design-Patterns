export type Product = {
  status: string;
  price: number;
  country: string;
  [key: string]: string | number;
};

export interface Expression {
  interpret(product: Product): boolean;
}

export class EqualsExpression implements Expression {
  constructor(
    private readonly field: string,
    private readonly expected: string
  ) {}
  interpret(product: Product) {
    return String(product[this.field]).toLowerCase() === this.expected.toLowerCase();
  }
}

export class LessThanExpression implements Expression {
  constructor(
    private readonly field: string,
    private readonly limit: number
  ) {}
  interpret(product: Product) {
    return Number(product[this.field]) < this.limit;
  }
}

export class AndExpression implements Expression {
  constructor(private readonly expressions: Expression[]) {}
  interpret(product: Product) {
    return this.expressions.every((expression) => expression.interpret(product));
  }
}

export class QueryParser {
  parse(query: string): Expression {
    const expressions = query.split(/\s+AND\s+/i).map((token) => {
      const equals = token.match(/^(\w+):(.+)$/);
      if (equals) return new EqualsExpression(equals[1], equals[2]);
      const lessThan = token.match(/^(\w+)<(\d+(?:\.\d+)?)$/);
      if (lessThan) return new LessThanExpression(lessThan[1], Number(lessThan[2]));
      throw new Error(`Invalid filter: ${token}`);
    });
    return new AndExpression(expressions);
  }
}

export function run() {
  const filter = new QueryParser().parse('status:active AND price<100 AND country:ES');
  const products: Product[] = [
    { status: 'active', price: 79, country: 'ES' },
    { status: 'active', price: 120, country: 'ES' }
  ];
  console.log(products.filter((product) => filter.interpret(product)));
}

if (require.main === module) run();
