import { NextResponse } from "next/server";

/**
 * Simple Health Check API Endpoint
 *
 * Lightweight health check for load balancers and monitoring
 * GET /api/health/simple
 */

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || "unknown",
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    },
  );
}
