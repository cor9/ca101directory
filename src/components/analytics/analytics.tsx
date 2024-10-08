import GoogleAnalytics from "./google-analytics";
import ClarityAnalytics from "./clarity-analytics";
import { SpeedInsights } from "./vercel-speed-insights";
import { VercelAnalytics } from "./vercel-analytics";
import { OpenPanelComponent } from '@openpanel/nextjs';

export function Analytics() {
    // if (process.env.NODE_ENV !== "production") {
    //     return null;
    // }

    return (
        <section>
            {/* vercel analytics */}
            {/* <VercelAnalytics /> */}
            {/* <SpeedInsights /> */}

            {/* https://docs.openpanel.dev/docs/sdks/nextjs#options */}
            <OpenPanelComponent
                clientId="ef74810e-6c02-4089-b4b0-ef6fb0d47afb"
                trackScreenViews={true}
                trackAttributes={true}
                trackOutgoingLinks={true}
            />

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