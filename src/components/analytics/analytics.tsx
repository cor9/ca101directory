import GoogleAnalytics from "./google-analytics";
import ClarityAnalytics from "./clarity-analytics";
import { OpenPanelComponent } from '@openpanel/nextjs';

export function Analytics() {
    if (process.env.NODE_ENV !== "production") {
        return null;
    }

    return (
        <section>
            {/* https://docs.openpanel.dev/docs/sdks/nextjs#options */}
            <OpenPanelComponent
                clientId="ef74810e-6c02-4089-b4b0-ef6fb0d47afb"
                trackScreenViews={true}
                trackAttributes={true}
                trackOutgoingLinks={true}
            />

            {/* google analytics */}
            {/* <GoogleAnalytics /> */}
        </section>
    )
}