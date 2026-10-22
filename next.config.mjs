import { readFileSync } from "node:fs";

/** @type {import('next').NextConfig} */
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseHostname = supabaseUrl
  ? new URL(supabaseUrl).hostname
  : undefined;

const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  // https://nextjs.org/docs/pages/building-your-application/configuring/mdx
  // pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  // https://nextjs.org/docs/pages/api-reference/next-config-js/reactStrictMode
  // if enabled, new-verification-form will trigger twice and seems buggy in dev mode,
  // but it's not a problem in production, so you can try to comment it out and let it go.
  // reactStrictMode: false,

  // https://nextjs.org/docs/architecture/nextjs-compiler#remove-console
  // Remove all console.* calls in production only
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Production optimizations
  poweredByHeader: false,
  generateEtags: false,

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  // Redirects for production
  async redirects() {
    // Consolidated legacy category slugs -> their primary category (HTTP 308).
    // Generated from src/lib/category-taxonomy.ts (npm run gen:category-redirects).
    const categoryRedirects = JSON.parse(
      readFileSync(
        new URL("./src/lib/category-redirects.generated.json", import.meta.url),
        "utf8",
      ),
    ).map(({ from, to }) => ({
      source: from,
      destination: to,
      permanent: true,
    }));
    return [
      ...categoryRedirects,
      {
        source: "/dashboard",
        destination: "/dashboard/vendor",
        permanent: false,
      },
      // Legacy slug fix: extra dash in "actor-s" -> "actors"
      {
        source: "/listing/real-actor-s-lab-with-sarah-gaboury",
        destination: "/listing/real-actors-lab-with-sarah-gaboury",
        permanent: true,
      },
    ];
  },

  images: {
    // https://vercel.com/docs/image-optimization/managing-image-optimization-costs#minimizing-image-optimization-costs
    // vercel has limits on image optimization, 1000 images per month
    unoptimized: true,
    // https://medium.com/@niniroula/nextjs-upgrade-next-image-and-dangerouslyallowsvg-c934060d79f8
    // The requested resource "https://cdn.sanity.io/images/58a2mkbj/preview/xxx.svg?fit=max&auto=format" has type "image/svg+xml"
    // but dangerouslyAllowSVG is disabled
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io", // https://www.sanity.io/learn/course/day-one-with-sanity-studio/bringing-content-to-a-next-js-front-end
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com", // https://www.sanity.io/learn/course/day-one-with-sanity-studio/bringing-content-to-a-next-js-front-end
      },
      // Allow Supabase Storage public assets (listing images, category icons)
      ...(supabaseHostname
        ? [
            {
              protocol: "https",
              hostname: supabaseHostname,
            },
          ]
        : []),
    ],
  },

  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Experimental features for production
  experimental: {
    // jsdom (pulled in by isomorphic-dompurify, used by RichTextDisplay on
    // /listing/[slug]) loads its UA stylesheet via
    // fs.readFileSync(path.resolve(__dirname, "../../browser/default-stylesheet.css")).
    // If webpack inlines that code into a shared server chunk, __dirname no
    // longer points at jsdom's real install path, so the lookup resolves to
    // a nonexistent .next/browser/default-stylesheet.css and crashes the
    // whole page render. Marking both packages external keeps them as real
    // require() calls at runtime, where __dirname (and Vercel's file
    // tracing) resolves correctly.
    serverComponentsExternalPackages: [
      "@supabase/supabase-js",
      "jsdom",
      "isomorphic-dompurify",
    ],
  },
};

export default nextConfig;
