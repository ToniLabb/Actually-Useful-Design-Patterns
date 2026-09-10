export type HttpResponse = { status: number; body: string; headers: Record<string, string> };
export interface HttpClient { get(url: string): HttpResponse }

export class ApiHttpClient implements HttpClient {
  public requests = 0;
  get(url: string): HttpResponse {
    this.requests++;
    return { status: 200, body: JSON.stringify({ url, request: this.requests }), headers: {} };
  }
}

export abstract class HttpClientDecorator implements HttpClient {
  constructor(protected readonly wrapped: HttpClient) {}
  get(url: string){ return this.wrapped.get(url) }
}

type CacheEntry = { response: HttpResponse; expiresAt: number };
export class CachingHttpClient extends HttpClientDecorator {
  private readonly cache = new Map<string, CacheEntry>();
  constructor(client: HttpClient, private readonly ttlMs: number, private readonly now = () => Date.now()) { super(client) }
  get(url: string): HttpResponse {
    const cached = this.cache.get(url);
    if (cached && cached.expiresAt > this.now()) {
      return { ...cached.response, headers: { ...cached.response.headers, 'x-cache': 'HIT' } };
    }
    const response = super.get(url);
    if (response.status >= 200 && response.status < 300) this.cache.set(url, { response, expiresAt: this.now() + this.ttlMs });
    return { ...response, headers: { ...response.headers, 'x-cache': 'MISS' } };
  }
  invalidate(url: string){ this.cache.delete(url) }
}

export class LoggingHttpClient extends HttpClientDecorator {
  get(url: string): HttpResponse {
    const response = super.get(url);
    console.log(`GET ${url} -> ${response.status} (${response.headers['x-cache'] ?? 'uncached'})`);
    return response;
  }
}

export function run(){
  const origin = new ApiHttpClient();
  const cached = new CachingHttpClient(origin, 60_000);
  const client: HttpClient = new LoggingHttpClient(cached);
  console.log(client.get('/products').body);
  console.log(client.get('/products').body);
  console.log('Origin requests:', origin.requests);
}
if (require.main === module) run();
