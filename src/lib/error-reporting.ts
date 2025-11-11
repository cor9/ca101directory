type IssueLevel = "error" | "warning" | "info";

type ErrorContext = Record<string, unknown> | undefined;

let sentryModulePromise: Promise<typeof import("@sentry/nextjs") | null> | null = null;

async function loadSentry() {
  if (!process.env.SENTRY_DSN) {
    return null;
  }

  if (!sentryModulePromise) {
    sentryModulePromise = import("@sentry/nextjs")
      .then((mod) => mod)
      .catch((error) => {
        console.warn("Sentry SDK not available:", error);
        return null;
      });
  }

  return sentryModulePromise;
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

  try {
    const sentry = await loadSentry();
    if (!sentry) {
      return;
    }

    const normalizedError =
      error instanceof Error ? error : new Error(message, { cause: error });

    if (level === "error") {
      sentry.withScope((scope) => {
        scope.setTag("component", "stripe");
        if (context) {
          scope.setContext("stripe_context", context as Record<string, any>);
        }
        sentry.captureException(normalizedError);
      });
      return;
    }

    const captureMessage = (sentry as any).captureMessage as
      | ((msg: string, lvl?: string) => void)
      | undefined;

    if (captureMessage) {
      const sentryLevel = level === "warning" ? "warning" : "info";
      sentry.withScope((scope) => {
        scope.setTag("component", "stripe");
        if (context) {
          scope.setContext("stripe_context", context as Record<string, any>);
        }
        captureMessage(`[Stripe] ${message}`, sentryLevel);
      });
    }
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
