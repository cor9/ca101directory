/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
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
        ],
    },
};

import { withContentlayer } from 'next-contentlayer2';

// https://contentlayer.dev/docs/reference/next-contentlayer-e6e7eb3a#withcontentlayer
export default withContentlayer(nextConfig);
