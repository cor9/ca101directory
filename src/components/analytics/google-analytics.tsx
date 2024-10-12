"use client";

import Script from "next/script";

/**
 * Google Analytics
 *
 * https://analytics.google.com
 */
export default function GoogleAnalytics() {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  const analyticsId = process.env.GOOGLE_ANALYTICS_ID;
  if (!analyticsId) {
    return null;
  }

  return (
    <section>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{
          __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${analyticsId}');
                    `,
        }}
      />
    </section>
  );
}
