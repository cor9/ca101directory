import { monitoring } from "@/lib/monitoring";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Health Check API Endpoint
 *
 * Provides system health status for monitoring and load balancers
 * GET /api/health
 */

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Run all health checks
    const healthChecks = await monitoring.health.runHealthChecks();
    const isHealthy = await monitoring.health.isHealthy();

    const responseTime = Date.now() - startTime;

    // Track the health check performance
    monitoring.performance.trackApiResponse(
      "/api/health",
      responseTime,
      isHealthy ? 200 : 503,
    );

    const response = {
      status: isHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      checks: healthChecks,
      version: process.env.NEXT_PUBLIC_APP_VERSION || "unknown",
      environment: process.env.NODE_ENV || "unknown",
    };

    return NextResponse.json(response, {
      status: isHealthy ? 200 : 503,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;

    // Track the error
    monitoring.error.trackError(error as Error, {
      action: "health_check",
      page: "/api/health",
    });

    monitoring.performance.trackApiResponse("/api/health", responseTime, 500);

    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        responseTime: `${responseTime}ms`,
        error: "Health check failed",
        version: process.env.NEXT_PUBLIC_APP_VERSION || "unknown",
        environment: process.env.NODE_ENV || "unknown",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
  }
}
