// import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Configure `pageExtensions` to include markdown and MDX files
    // https://nextjs.org/docs/pages/building-your-application/configuring/mdx
    // pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

    // https://www.npmjs.com/package/geist#using-with-nextjs
    transpilePackages: ["geist"],

    // https://nextjs.org/docs/pages/api-reference/next-config-js/reactStrictMode
    // if enabled, new-verification-form will trigger twice and seems buggy in dev mode,
    // but it's not a problem in production, so you can try to comment it out and let it go.
    reactStrictMode: false,

    // <w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (306kiB) impacts deserialization performance 
    // (consider using Buffer instead and decode when needed)
    // ReferenceError: path is not defined
    // webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    //     config.cache = {
    //         type: 'filesystem',
    //         cacheDirectory: path.resolve(__dirname, '.next/cache'),
    //         store: 'pack',
    //         buildDependencies: {
    //             config: [__filename],
    //         },
    //         maxAge: 86400000, // 1 day
    //         compression: 'gzip',
    //         name: 'webpack-cache',
    //         version: buildId,
    //         // Increase the size limit (e.g., to 1MB)
    //         memoryCacheUnaffected: 1024 * 1024,
    //     };
    //     return config;
    // },

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
        ],
    },
};

export default nextConfig;