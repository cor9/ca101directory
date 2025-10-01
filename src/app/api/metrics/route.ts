import { monitoring } from "@/lib/monitoring";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Metrics API Endpoint
 *
 * Provides system metrics for monitoring and analytics
 * GET /api/metrics
 */

export async function GET(request: NextRequest) {
  try {
    // Get recent metrics
    const recentMetrics = monitoring.performance.getRecentMetrics(100);
    const recentErrors = monitoring.error.getRecentErrors(50);
    const recentEvents = monitoring.analytics.getRecentEvents(100);

    // Calculate summary statistics
    const pageLoadTimes = recentMetrics
      .filter((m) => m.name === "page_load_time")
      .map((m) => m.value);

    const apiResponseTimes = recentMetrics
      .filter((m) => m.name === "api_response_time")
      .map((m) => m.value);

    const databaseQueryTimes = recentMetrics
      .filter((m) => m.name === "database_query_time")
      .map((m) => m.value);

    // Calculate averages
    const avgPageLoadTime =
      pageLoadTimes.length > 0
        ? pageLoadTimes.reduce((a, b) => a + b, 0) / pageLoadTimes.length
        : 0;

    const avgApiResponseTime =
      apiResponseTimes.length > 0
        ? apiResponseTimes.reduce((a, b) => a + b, 0) / apiResponseTimes.length
        : 0;

    const avgDatabaseQueryTime =
      databaseQueryTimes.length > 0
        ? databaseQueryTimes.reduce((a, b) => a + b, 0) /
          databaseQueryTimes.length
        : 0;

    // Count events by type
    const eventCounts = recentEvents.reduce(
      (acc, event) => {
        acc[event.event] = (acc[event.event] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const response = {
      timestamp: new Date().toISOString(),
      summary: {
        totalMetrics: recentMetrics.length,
        totalErrors: recentErrors.length,
        totalEvents: recentEvents.length,
        averagePageLoadTime: Math.round(avgPageLoadTime),
        averageApiResponseTime: Math.round(avgApiResponseTime),
        averageDatabaseQueryTime: Math.round(avgDatabaseQueryTime),
        eventCounts,
      },
      recentMetrics: recentMetrics.slice(-20), // Last 20 metrics
      recentErrors: recentErrors.slice(-10), // Last 10 errors
      recentEvents: recentEvents.slice(-20), // Last 20 events
      version: process.env.NEXT_PUBLIC_APP_VERSION || "unknown",
      environment: process.env.NODE_ENV || "unknown",
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    // Track the error
    monitoring.error.trackError(error as Error, {
      action: "metrics_retrieval",
      page: "/api/metrics",
    });

    return NextResponse.json(
      {
        error: "Failed to retrieve metrics",
        timestamp: new Date().toISOString(),
        version: process.env.NEXT_PUBLIC_APP_VERSION || "unknown",
        environment: process.env.NODE_ENV || "unknown",
      },
      { status: 500 },
    );
  }
}
