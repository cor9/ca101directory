declare module "@sentry/nextjs" {
  type ScopeCallback = (scope: {
    setContext: (name: string, context: Record<string, any>) => void;
    setTag: (key: string, value: string) => void;
    setLevel?: (level: string) => void;
  }) => void;

  export function captureException(error: unknown): string;
  export function captureMessage(message: string, level?: string): string;
  export function withScope(callback: ScopeCallback): void;
}
