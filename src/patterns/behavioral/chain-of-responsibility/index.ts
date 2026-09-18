export type HttpRequest = {
  path: string;
  method: string;
  headers: Record<string, string>;
  body?: unknown;
  userId?: string;
};

export type HttpResponse = { status: number; body: unknown };

export abstract class Middleware {
  private next?: Middleware;
  linkWith(next: Middleware): Middleware {
    this.next = next;
    return next;
  }
  handle(request: HttpRequest): HttpResponse {
    return this.next ? this.next.handle(request) : { status: 404, body: 'No route matched' };
  }
}

export class RequestLogger extends Middleware {
  handle(request: HttpRequest) {
    console.log(`${request.method} ${request.path}`);
    return super.handle(request);
  }
}

export class AuthenticationMiddleware extends Middleware {
  handle(request: HttpRequest): HttpResponse {
    const token = request.headers.authorization;
    if (!token?.startsWith('Bearer ')) return { status: 401, body: 'Missing access token' };
    request.userId = token.slice('Bearer '.length);
    return super.handle(request);
  }
}

export class RateLimitMiddleware extends Middleware {
  private readonly requests = new Map<string, number>();
  constructor(private readonly limit: number) {
    super();
  }
  handle(request: HttpRequest): HttpResponse {
    const client = request.headers['x-client-id'] ?? 'anonymous';
    const count = (this.requests.get(client) ?? 0) + 1;
    this.requests.set(client, count);
    return count > this.limit ? { status: 429, body: 'Too many requests' } : super.handle(request);
  }
}

export class AuthorizationMiddleware extends Middleware {
  handle(request: HttpRequest): HttpResponse {
    if (request.path.startsWith('/admin') && request.headers['x-role'] !== 'admin')
      return { status: 403, body: 'Insufficient permissions' };
    return super.handle(request);
  }
}

export class JsonBodyMiddleware extends Middleware {
  handle(request: HttpRequest): HttpResponse {
    if (request.method === 'POST' && request.headers['content-type'] !== 'application/json') {
      return { status: 415, body: 'Expected application/json' };
    }
    return super.handle(request);
  }
}

export class ProfileController extends Middleware {
  handle(request: HttpRequest): HttpResponse {
    if (request.path === '/profile' && request.method === 'POST')
      return { status: 200, body: { updatedBy: request.userId, changes: request.body } };
    return super.handle(request);
  }
}

export function createHttpPipeline(): Middleware {
  const first = new RequestLogger();
  first
    .linkWith(new RateLimitMiddleware(10))
    .linkWith(new AuthenticationMiddleware())
    .linkWith(new AuthorizationMiddleware())
    .linkWith(new JsonBodyMiddleware())
    .linkWith(new ProfileController());
  return first;
}

export function run() {
  const pipeline = createHttpPipeline();
  console.log(
    pipeline.handle({
      path: '/profile',
      method: 'POST',
      headers: { authorization: 'Bearer user-42', 'content-type': 'application/json' },
      body: { name: 'Ada' }
    })
  );
  console.log(pipeline.handle({ path: '/profile', method: 'POST', headers: {} }));
}

if (require.main === module) run();
