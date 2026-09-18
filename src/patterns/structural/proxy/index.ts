export type ApiRequest = { clientId: string; path: string };

export type ApiResponse = { status: number; body: string };

export interface ApiService {
  request(input: ApiRequest): ApiResponse;
}

export class RealApiService implements ApiService {
  request(input: ApiRequest): ApiResponse {
    return { status: 200, body: `Data for ${input.path}` };
  }
}

type Window = { startedAt: number; requests: number };

export class RateLimitingProxy implements ApiService {
  private readonly windows = new Map<string, Window>();
  constructor(
    private readonly target: ApiService,
    private readonly limit: number,
    private readonly windowMs: number,
    private readonly now = () => Date.now()
  ) {}
  request(input: ApiRequest): ApiResponse {
    const timestamp = this.now();
    let window = this.windows.get(input.clientId);
    if (!window || timestamp - window.startedAt >= this.windowMs) {
      window = { startedAt: timestamp, requests: 0 };
      this.windows.set(input.clientId, window);
    }
    if (window.requests >= this.limit) {
      const retryAfter = Math.ceil((this.windowMs - (timestamp - window.startedAt)) / 1000);
      return { status: 429, body: `Rate limit exceeded. Retry in ${retryAfter}s` };
    }
    window.requests++;
    return this.target.request(input);
  }
}

export function run() {
  const api: ApiService = new RateLimitingProxy(new RealApiService(), 2, 60_000);
  for (let attempt = 1; attempt <= 3; attempt++)
    console.log(`Attempt ${attempt}:`, api.request({ clientId: 'client-1', path: '/reports' }));
}

if (require.main === module) run();
