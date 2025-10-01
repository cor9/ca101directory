/**
 * Production Monitoring and Analytics
 *
 * Centralized monitoring, error tracking, and analytics for production deployment
 */

// Error tracking
export interface ErrorContext {
  userId?: string;
  userRole?: string;
  page?: string;
  action?: string;
  timestamp?: Date;
  userAgent?: string;
  url?: string;
  referrer?: string;
}

// Performance monitoring
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  context?: Record<string, any>;
}

// User analytics
export interface UserEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  timestamp?: Date;
}

/**
 * Error tracking and logging
 */
export class ErrorTracker {
  private static instance: ErrorTracker;
  private errors: Error[] = [];
  private maxErrors = 100;

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  /**
   * Track an error with context
   */
  trackError(error: Error, context?: ErrorContext): void {
    const errorWithContext = {
      ...error,
      context: {
        ...context,
        timestamp: new Date(),
        userAgent:
          typeof window !== "undefined" ? window.navigator.userAgent : "server",
        url: typeof window !== "undefined" ? window.location.href : "server",
      },
    };

    this.errors.push(errorWithContext);

    // Keep only the most recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error tracked:", errorWithContext);
    }

    // Send to external service in production
    if (process.env.NODE_ENV === "production") {
      this.sendToExternalService(errorWithContext);
    }
  }

  /**
   * Send error to external monitoring service
   */
  private async sendToExternalService(error: any): Promise<void> {
    try {
      // Example: Send to Sentry, LogRocket, or custom endpoint
      if (process.env.SENTRY_DSN) {
        // Sentry integration would go here
        console.log("Sending error to Sentry:", error);
      }

      // Custom error endpoint
      if (process.env.ERROR_TRACKING_ENDPOINT) {
        await fetch(process.env.ERROR_TRACKING_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(error),
        });
      }
    } catch (sendError) {
      console.error("Failed to send error to external service:", sendError);
    }
  }

  /**
   * Get recent errors
   */
  getRecentErrors(limit = 10): Error[] {
    return this.errors.slice(-limit);
  }

  /**
   * Clear all errors
   */
  clearErrors(): void {
    this.errors = [];
  }
}

/**
 * Performance monitoring
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 1000;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Track a performance metric
   */
  trackMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);

    // Keep only the most recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log("Performance metric:", metric);
    }

    // Send to external service in production
    if (process.env.NODE_ENV === "production") {
      this.sendToExternalService(metric);
    }
  }

  /**
   * Track page load time
   */
  trackPageLoad(page: string, loadTime: number): void {
    this.trackMetric({
      name: "page_load_time",
      value: loadTime,
      unit: "ms",
      timestamp: new Date(),
      context: { page },
    });
  }

  /**
   * Track API response time
   */
  trackApiResponse(
    endpoint: string,
    responseTime: number,
    statusCode: number,
  ): void {
    this.trackMetric({
      name: "api_response_time",
      value: responseTime,
      unit: "ms",
      timestamp: new Date(),
      context: { endpoint, statusCode },
    });
  }

  /**
   * Track database query time
   */
  trackDatabaseQuery(query: string, queryTime: number): void {
    this.trackMetric({
      name: "database_query_time",
      value: queryTime,
      unit: "ms",
      timestamp: new Date(),
      context: { query },
    });
  }

  /**
   * Send metric to external service
   */
  private async sendToExternalService(
    metric: PerformanceMetric,
  ): Promise<void> {
    try {
      // Example: Send to DataDog, New Relic, or custom endpoint
      if (process.env.METRICS_ENDPOINT) {
        await fetch(process.env.METRICS_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(metric),
        });
      }
    } catch (sendError) {
      console.error("Failed to send metric to external service:", sendError);
    }
  }

  /**
   * Get recent metrics
   */
  getRecentMetrics(limit = 100): PerformanceMetric[] {
    return this.metrics.slice(-limit);
  }

  /**
   * Get metrics by name
   */
  getMetricsByName(name: string, limit = 100): PerformanceMetric[] {
    return this.metrics.filter((metric) => metric.name === name).slice(-limit);
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
  }
}

/**
 * User analytics and event tracking
 */
export class UserAnalytics {
  private static instance: UserAnalytics;
  private events: UserEvent[] = [];
  private maxEvents = 1000;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  static getInstance(): UserAnalytics {
    if (!UserAnalytics.instance) {
      UserAnalytics.instance = new UserAnalytics();
    }
    return UserAnalytics.instance;
  }

  /**
   * Track a user event
   */
  trackEvent(event: UserEvent): void {
    const eventWithContext = {
      ...event,
      sessionId: this.sessionId,
      timestamp: new Date(),
    };

    this.events.push(eventWithContext);

    // Keep only the most recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log("User event tracked:", eventWithContext);
    }

    // Send to external service in production
    if (process.env.NODE_ENV === "production") {
      this.sendToExternalService(eventWithContext);
    }
  }

  /**
   * Track page view
   */
  trackPageView(page: string, userId?: string): void {
    this.trackEvent({
      event: "page_view",
      properties: { page },
      userId,
    });
  }

  /**
   * Track user action
   */
  trackAction(
    action: string,
    properties?: Record<string, any>,
    userId?: string,
  ): void {
    this.trackEvent({
      event: "user_action",
      properties: { action, ...properties },
      userId,
    });
  }

  /**
   * Track conversion
   */
  trackConversion(
    conversionType: string,
    value?: number,
    userId?: string,
  ): void {
    this.trackEvent({
      event: "conversion",
      properties: { conversionType, value },
      userId,
    });
  }

  /**
   * Track error
   */
  trackUserError(
    error: string,
    context?: Record<string, any>,
    userId?: string,
  ): void {
    this.trackEvent({
      event: "user_error",
      properties: { error, ...context },
      userId,
    });
  }

  /**
   * Send event to external service
   */
  private async sendToExternalService(event: UserEvent): Promise<void> {
    try {
      // Example: Send to Google Analytics, Mixpanel, or custom endpoint
      if (process.env.GOOGLE_ANALYTICS_ID) {
        // Google Analytics integration would go here
        console.log("Sending event to Google Analytics:", event);
      }

      // Custom analytics endpoint
      if (process.env.ANALYTICS_ENDPOINT) {
        await fetch(process.env.ANALYTICS_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        });
      }
    } catch (sendError) {
      console.error("Failed to send event to external service:", sendError);
    }
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get recent events
   */
  getRecentEvents(limit = 100): UserEvent[] {
    return this.events.slice(-limit);
  }

  /**
   * Get events by type
   */
  getEventsByType(eventType: string, limit = 100): UserEvent[] {
    return this.events
      .filter((event) => event.event === eventType)
      .slice(-limit);
  }

  /**
   * Clear all events
   */
  clearEvents(): void {
    this.events = [];
  }
}

/**
 * Health check monitoring
 */
export class HealthMonitor {
  private static instance: HealthMonitor;
  private healthChecks: Map<string, () => Promise<boolean>> = new Map();

  static getInstance(): HealthMonitor {
    if (!HealthMonitor.instance) {
      HealthMonitor.instance = new HealthMonitor();
    }
    return HealthMonitor.instance;
  }

  /**
   * Register a health check
   */
  registerHealthCheck(name: string, check: () => Promise<boolean>): void {
    this.healthChecks.set(name, check);
  }

  /**
   * Run all health checks
   */
  async runHealthChecks(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};

    for (const [name, check] of Array.from(this.healthChecks.entries())) {
      try {
        results[name] = await check();
      } catch (error) {
        console.error(`Health check failed for ${name}:`, error);
        results[name] = false;
      }
    }

    return results;
  }

  /**
   * Check if all health checks pass
   */
  async isHealthy(): Promise<boolean> {
    const results = await this.runHealthChecks();
    return Object.values(results).every((result) => result === true);
  }
}

/**
 * Utility functions for monitoring
 */
export const monitoring = {
  error: ErrorTracker.getInstance(),
  performance: PerformanceMonitor.getInstance(),
  analytics: UserAnalytics.getInstance(),
  health: HealthMonitor.getInstance(),
};

/**
 * React hook for error tracking
 */
export function useErrorTracking() {
  const trackError = (error: Error, context?: ErrorContext) => {
    monitoring.error.trackError(error, context);
  };

  return { trackError };
}

/**
 * React hook for performance tracking
 */
export function usePerformanceTracking() {
  const trackMetric = (metric: PerformanceMetric) => {
    monitoring.performance.trackMetric(metric);
  };

  const trackPageLoad = (page: string, loadTime: number) => {
    monitoring.performance.trackPageLoad(page, loadTime);
  };

  return { trackMetric, trackPageLoad };
}

/**
 * React hook for user analytics
 */
export function useUserAnalytics() {
  const trackEvent = (event: UserEvent) => {
    monitoring.analytics.trackEvent(event);
  };

  const trackPageView = (page: string, userId?: string) => {
    monitoring.analytics.trackPageView(page, userId);
  };

  const trackAction = (
    action: string,
    properties?: Record<string, any>,
    userId?: string,
  ) => {
    monitoring.analytics.trackAction(action, properties, userId);
  };

  const trackConversion = (
    conversionType: string,
    value?: number,
    userId?: string,
  ) => {
    monitoring.analytics.trackConversion(conversionType, value, userId);
  };

  return { trackEvent, trackPageView, trackAction, trackConversion };
}

/**
 * Initialize monitoring for production
 */
export function initializeMonitoring(): void {
  // Register health checks
  monitoring.health.registerHealthCheck("database", async () => {
    try {
      // Check database connection
      // This would be implemented based on your database setup
      return true;
    } catch {
      return false;
    }
  });

  monitoring.health.registerHealthCheck("stripe", async () => {
    try {
      // Check Stripe API connection
      // This would be implemented based on your Stripe setup
      return true;
    } catch {
      return false;
    }
  });

  monitoring.health.registerHealthCheck("storage", async () => {
    try {
      // Check Vercel Blob storage
      // This would be implemented based on your storage setup
      return true;
    } catch {
      return false;
    }
  });

  // Track application startup
  monitoring.analytics.trackEvent({
    event: "app_startup",
    properties: {
      environment: process.env.NODE_ENV,
      version: process.env.NEXT_PUBLIC_APP_VERSION || "unknown",
    },
  });

  console.log("Monitoring initialized for production");
}

export default monitoring;
