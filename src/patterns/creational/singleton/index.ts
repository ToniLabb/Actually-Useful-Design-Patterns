export type Environment = Record<string, string | undefined>;

export class AppConfig {
  private static instance?: AppConfig;
  private constructor(
    public readonly environment: 'development' | 'test' | 'production',
    public readonly port: number,
    public readonly databaseUrl: string
  ) {}
  static load(env: Environment = process.env): AppConfig {
    if (!this.instance) {
      const environment = env.NODE_ENV ?? 'development';
      if (!['development', 'test', 'production'].includes(environment))
        throw new Error(`Invalid NODE_ENV: ${environment}`);
      if (!env.DATABASE_URL) throw new Error('DATABASE_URL is required');
      this.instance = new AppConfig(
        environment as AppConfig['environment'],
        Number(env.PORT ?? 3000),
        env.DATABASE_URL
      );
    }
    return this.instance;
  }
  static resetForTests() {
    this.instance = undefined;
  }
}

export function run() {
  const first = AppConfig.load({
    NODE_ENV: 'production',
    PORT: '8080',
    DATABASE_URL: 'postgres://db/app'
  });
  const second = AppConfig.load({ DATABASE_URL: 'ignored' });
  console.log(first, 'Same config:', first === second);
}

if (require.main === module) run();
