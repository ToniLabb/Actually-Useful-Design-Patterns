export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export class HttpRequest {
  constructor(
    public readonly method: HttpMethod,
    public readonly url: string,
    public readonly headers: Readonly<Record<string, string>>,
    public readonly body?: string,
    public readonly timeoutMs = 5_000
  ) {}
  describe() {
    return `${this.method} ${this.url} (${this.timeoutMs}ms)`;
  }
}

export class HttpRequestBuilder {
  private method: HttpMethod = 'GET';
  private baseUrl = '';
  private path = '';
  private readonly headers: Record<string, string> = {};
  private readonly query = new URLSearchParams();
  private body?: string;
  private timeoutMs = 5_000;
  setMethod(method: HttpMethod) {
    this.method = method;
    return this;
  }
  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    return this;
  }
  setPath(path: string) {
    this.path = path.startsWith('/') ? path : `/${path}`;
    return this;
  }
  addHeader(name: string, value: string) {
    this.headers[name.toLowerCase()] = value;
    return this;
  }
  addQuery(name: string, value: string | number | boolean) {
    this.query.append(name, String(value));
    return this;
  }
  setJsonBody(value: unknown) {
    this.body = JSON.stringify(value);
    return this.addHeader('content-type', 'application/json');
  }
  setTimeout(timeoutMs: number) {
    this.timeoutMs = timeoutMs;
    return this;
  }
  build(): HttpRequest {
    if (!/^https?:\/\//.test(this.baseUrl)) throw new Error('A valid HTTP base URL is required');
    if (this.timeoutMs <= 0) throw new Error('Timeout must be greater than zero');
    if (this.method === 'GET' && this.body !== undefined)
      throw new Error('GET requests cannot have a body');
    const query = this.query.toString();
    return new HttpRequest(
      this.method,
      `${this.baseUrl}${this.path}${query ? `?${query}` : ''}`,
      { ...this.headers },
      this.body,
      this.timeoutMs
    );
  }
}

export class ApiRequestDirector {
  constructor(
    private readonly baseUrl: string,
    private readonly token: string
  ) {}
  createUser(payload: { name: string; email: string }) {
    return new HttpRequestBuilder()
      .setBaseUrl(this.baseUrl)
      .setPath('/users')
      .setMethod('POST')
      .addHeader('authorization', `Bearer ${this.token}`)
      .setJsonBody(payload)
      .setTimeout(3_000)
      .build();
  }
}

export function run() {
  const search = new HttpRequestBuilder()
    .setBaseUrl('https://api.example.com')
    .setPath('products')
    .addQuery('category', 'books')
    .addQuery('page', 2)
    .addHeader('accept', 'application/json')
    .build();
  const createUser = new ApiRequestDirector('https://api.example.com', 'demo-token').createUser({
    name: 'Ada',
    email: 'ada@example.com'
  });
  console.log(search.describe(), search.headers);
  console.log(createUser.describe(), createUser.body);
}

if (require.main === module) run();
