import GoogleAnalytics from "./google-analytics";
import ClarityAnalytics from "./clarity-analytics";
import { SpeedInsights } from "./vercel-speed-insights";
import { VercelAnalytics } from "./vercel-analytics";

export function Analytics() {
    if (process.env.NODE_ENV !== "production") {
        return null;
    }

    return (
        <section>
            {/* vercel analytics */}
            <VercelAnalytics />
            <SpeedInsights />

            {/* google analytics */}
            {/* <GoogleAnalytics /> */}

            {/* clarity analytics */}
            {/* <ClarityAnalytics /> */}

            {/* umami analytics, CORS policy blocks */}
            {/* <script defer src="https://cloud.umami.is/script.js"
                data-website-id="a8eb270e-f183-4500-8a43-a8ac5707c3ba">
            </script> */}
        </section>
    )
}