import { BetaAnalyticsDataClient } from "@google-analytics/data";

const propertyId = process.env.GA4_PROPERTY_ID;

// Use Service Account credentials for server-to-server communication
const client = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    // Handle escaped newlines in Vercel environment variables
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

export interface TrafficMetrics {
  totalUsers: number;
  sessions: number;
  views: number;
  engagementRate: number;
}

export interface PageMetrics {
  path: string;
  title: string;
  views: number;
  activeUsers: number;
}

export interface TrafficSource {
  sourceMedium: string;
  sessions: number;
}

export interface TrendData {
  date: string;
  views: number;
  users: number;
}

/**
 * Helper to safely query GA4
 */
async function queryGa4(request: any, fallback: any) {
  if (
    !propertyId ||
    !process.env.GOOGLE_CLIENT_EMAIL ||
    !process.env.GOOGLE_PRIVATE_KEY
  ) {
    console.warn("GA4 credentials not configured.");
    return fallback;
  }
  try {
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      ...request,
    });
    return response.rows || [];
  } catch (error) {
    console.error("GA4 Analytics Error:", error);
    return fallback;
  }
}

/**
 * Overall directory traffic (past N days)
 */
export async function getOverallTraffic(
  days: number = 30
): Promise<TrafficMetrics> {
  const rows = await queryGa4(
    {
      dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
      metrics: [
        { name: "totalUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "engagementRate" },
      ],
    },
    []
  );

  if (!rows || rows.length === 0) {
    return { totalUsers: 0, sessions: 0, views: 0, engagementRate: 0 };
  }

  const row = rows[0];
  const totalUsers = parseInt(row.metricValues?.[0]?.value || "0", 10);
  const sessions = parseInt(row.metricValues?.[1]?.value || "0", 10);
  const views = parseInt(row.metricValues?.[2]?.value || "0", 10);
  const engagementRate = parseFloat(row.metricValues?.[3]?.value || "0");

  return { totalUsers, sessions, views, engagementRate };
}

/**
 * Top viewed vendor pages
 */
export async function getTopVendorPages(
  days: number = 30,
  limit: number = 5
): Promise<PageMetrics[]> {
  const rows = await queryGa4(
    {
      dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
      dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
      metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
      dimensionFilter: {
        filter: {
          fieldName: "pagePath",
          stringFilter: {
            matchType: "BEGINS_WITH",
            value: "/item/", // Vendor listing pages start with /item/
          },
        },
      },
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit,
    },
    []
  );

  return rows.map((row: any) => ({
    path: row.dimensionValues?.[0]?.value || "",
    title: row.dimensionValues?.[1]?.value || "Unknown",
    views: parseInt(row.metricValues?.[0]?.value || "0", 10),
    activeUsers: parseInt(row.metricValues?.[1]?.value || "0", 10),
  }));
}

/**
 * Traffic Sources Summary
 */
export async function getTrafficSources(
  days: number = 30,
  limit: number = 5
): Promise<TrafficSource[]> {
  const rows = await queryGa4(
    {
      dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
      dimensions: [{ name: "sessionSourceMedium" }],
      metrics: [{ name: "sessions" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit,
    },
    []
  );

  return rows.map((row: any) => ({
    sourceMedium: row.dimensionValues?.[0]?.value || "direct / (none)",
    sessions: parseInt(row.metricValues?.[0]?.value || "0", 10),
  }));
}

/**
 * Date-based trend data
 */
export async function getTrafficTrend(days: number = 30): Promise<TrendData[]> {
  const rows = await queryGa4(
    {
      dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
      orderBys: [{ dimension: { dimensionName: "date" }, desc: false }],
    },
    []
  );

  return rows.map((row: any) => {
    // Format YYYYMMDD to YYYY-MM-DD
    const rawDate = row.dimensionValues?.[0]?.value || "";
    const formattedDate =
      rawDate.length === 8
        ? `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`
        : rawDate;

    return {
      date: formattedDate,
      views: parseInt(row.metricValues?.[0]?.value || "0", 10),
      users: parseInt(row.metricValues?.[1]?.value || "0", 10),
    };
  });
}

/**
 * Get metrics for a specific vendor path
 */
export async function getVendorPageMetrics(
  path: string,
  days: number = 30
): Promise<{ views: number; users: number }> {
  const rows = await queryGa4(
    {
      dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
      dimensionFilter: {
        filter: {
          fieldName: "pagePath",
          stringFilter: {
            matchType: "EXACT",
            value: path,
          },
        },
      },
    },
    []
  );

  if (!rows || rows.length === 0) {
    return { views: 0, users: 0 };
  }

  const row = rows[0];
  return {
    views: parseInt(row.metricValues?.[0]?.value || "0", 10),
    users: parseInt(row.metricValues?.[1]?.value || "0", 10),
  };
}
