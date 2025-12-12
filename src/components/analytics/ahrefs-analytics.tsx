import Script from "next/script";

/**
 * Ahrefs Analytics Component
 * Loads Ahrefs analytics script for tracking website performance
 */
export function AhrefsAnalytics() {
  // Only load in production
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <Script
      src="https://analytics.ahrefs.com/analytics.js"
      data-key="Dho7xCIClGUSR+vfa4LGSA"
      strategy="afterInteractive"
      async
    />
  );
}
