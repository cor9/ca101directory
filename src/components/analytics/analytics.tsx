import GoogleAnalytics from "./google-analytics";
import OpenPanelAnalytics from "./open-panel-analytics";

export function Analytics() {
    if (process.env.NODE_ENV !== "production") {
        return null;
    }

    return (
        <section>
            {/* openpanel analytics */}
            <OpenPanelAnalytics />

            {/* google analytics */}
            <GoogleAnalytics />
        </section>
    )
}