type IssueLevel = "error" | "warning" | "info";

type ErrorContext = Record<string, unknown> | undefined;

type SentryScope = {
  setTag?: (key: string, value: string) => void;
  setContext?: (key: string, value: Record<string, unknown>) => void;
};

type SentryFacade = {
  captureException?: (error: unknown) => void;
  captureMessage?: (message: string, level?: string) => void;
  withScope?: (callback: (scope: SentryScope) => void) => void;
};

function resolveSentryFacade(): SentryFacade | null {
  if (!process.env.SENTRY_DSN) {
    return null;
  }

  const globalAny = globalThis as Record<string, any>;
  const direct = globalAny.Sentry;
  if (direct && typeof direct === "object") {
    return direct as SentryFacade;
  }

  const sentryNamespace = globalAny.__SENTRY__;
  const hub =
    sentryNamespace?.hub ||
    (typeof sentryNamespace?.getCurrentHub === "function"
      ? sentryNamespace.getCurrentHub()
      : undefined);

  if (hub && typeof hub === "object") {
    return hub as SentryFacade;
  }

  return null;
}

function logToConsole(level: IssueLevel, message: string, payload: Record<string, unknown>) {
  const logPayload = { ...payload, timestamp: new Date().toISOString() };

  if (level === "error") {
    console.error(message, logPayload);
  } else if (level === "warning") {
    console.warn(message, logPayload);
  } else {
    console.info(message, logPayload);
  }
}

function notifySentry(
  facade: SentryFacade | null,
  level: IssueLevel,
  message: string,
  normalizedError: Error,
  context?: ErrorContext,
) {
  if (!facade) {
    return;
  }

  const withScope = typeof facade.withScope === "function" ? facade.withScope.bind(facade) : null;
  const captureException =
    typeof facade.captureException === "function" ? facade.captureException.bind(facade) : null;
  const captureMessage =
    typeof facade.captureMessage === "function" ? facade.captureMessage.bind(facade) : null;

  if (level === "error" && captureException) {
    if (withScope) {
      withScope((scope) => {
        scope.setTag?.("component", "stripe");
        if (context) {
          scope.setContext?.("stripe_context", context as Record<string, unknown>);
        }
        captureException(normalizedError);
      });
      return;
    }

    captureException(normalizedError);
    return;
  }

  if (!captureMessage) {
    return;
  }

  const sentryLevel = level === "warning" ? "warning" : "info";

  if (withScope) {
    withScope((scope) => {
      scope.setTag?.("component", "stripe");
      if (context) {
        scope.setContext?.("stripe_context", context as Record<string, unknown>);
      }
      captureMessage(`[Stripe] ${message}`, sentryLevel);
    });
    return;
  }

  captureMessage(`[Stripe] ${message}`, sentryLevel);
}

export async function reportStripeIssue(
  level: IssueLevel,
  message: string,
  error?: unknown,
  context?: ErrorContext,
) {
  const payload: Record<string, unknown> = {
    context,
    error:
      error instanceof Error
        ? { message: error.message, stack: error.stack, name: error.name }
        : error,
  };

  logToConsole(level, `[Stripe] ${message}`, payload);

  const facade = resolveSentryFacade();
  if (!facade) {
    return;
  }

  const normalizedError =
    error instanceof Error ? error : new Error(message, { cause: error });

  try {
    notifySentry(facade, level, message, normalizedError, context);
  } catch (sentryError) {
    console.warn("Failed to report Stripe issue to Sentry:", sentryError);
  }
}

export async function reportStripeError(
  message: string,
  error?: unknown,
  context?: ErrorContext,
) {
  return reportStripeIssue("error", message, error, context);
}
