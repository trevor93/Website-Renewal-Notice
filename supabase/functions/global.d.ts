declare namespace Deno {
  interface Env {
    get(key: string): string | undefined;
  }

  interface ServeInit {
    port?: number;
    hostname?: string;
    onListen?: (details: { port: number; hostname: string }) => void;
  }

  function serve(
    handler: (request: Request) => Response | Promise<Response>,
    options?: ServeInit,
  ): Promise<void>;

  const env: Env;
}