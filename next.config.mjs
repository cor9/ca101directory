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
    return [
      {
        source: "/dashboard",
        destination: "/dashboard/vendor",
        permanent: false,
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
    serverComponentsExternalPackages: ["@supabase/supabase-js"],
  },
};

export default nextConfig;
