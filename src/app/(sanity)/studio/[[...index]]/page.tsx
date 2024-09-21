"use client";

import config from "@/sanity.config";
import { NextStudio } from "next-sanity/studio";

/**
 * https://www.sanity.io/plugins/next-sanity#studio-route-with-app-router
 */
// export const dynamic = 'force-static';
// export { metadata, viewport } from 'next-sanity/studio';

export default function Studio() {
    return <NextStudio config={config} />
}