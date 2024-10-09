'use client';

import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

if (typeof window !== 'undefined') {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    
    if (posthogKey && posthogHost) {
        posthog.init(posthogKey, {
            api_host: posthogHost,
            person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
        });
    } else {
        console.warn('PostHog initialization skipped: Missing NEXT_PUBLIC_POSTHOG_KEY or NEXT_PUBLIC_POSTHOG_HOST');
    }
}

export function CSPostHogProvider({ children }) {
    if (process.env.NODE_ENV !== "production") {
        return null;
    }

    return (
        <PostHogProvider client={posthog}>
            {children}
        </PostHogProvider>
    )
}