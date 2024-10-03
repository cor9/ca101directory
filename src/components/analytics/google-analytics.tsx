'use client'

import Script from "next/script";

const GoogleAnalytics = () => {
    return (
        <section>
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=G-0JFX0BMGRE`}
            />
            <Script
                id="google-analytics-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-0JFX0BMGRE');
                    `,
                }}
            />
        </section>
    )
}

export default GoogleAnalytics;