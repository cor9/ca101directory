import { siteConfig } from "@/config/site";
import { Metadata } from "next";

/**
 * Construct the metadata object for the current page (in docs/guides)
 */
export function constructMetadata({
    title = siteConfig.name,
    description = siteConfig.description,
    image = siteConfig.image,
    noIndex = false,
  }: {
    title?: string;
    description?: string;
    image?: string;
    noIndex?: boolean;
  } = {}): Metadata {
    return {
      title: {
        default: siteConfig.name,
        template: `%s - ${siteConfig.name}`,
      },
      description,
      keywords: [
        "Directory",
        "Template",
        "Boilerplate",
        "Sanity",
        "Next.js",
        "Auth.js",
        "Tailwindcss",
        "Shadcn/ui",
        "Resend",
        "Stripe",
      ],
      authors: [
        {
          name: siteConfig.author,
        },
      ],
      creator: siteConfig.author,
      openGraph: {
        type: "website",
        locale: "en_US",
        url: siteConfig.url,
        title,
        description,
        siteName: title,
        images: [image],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
        creator: siteConfig.author,
      },
      icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon-32x32.png",
        apple: "/apple-touch-icon.png",
      },
      metadataBase: new URL(siteConfig.url),
      manifest: `${siteConfig.url}/site.webmanifest`,
      ...(noIndex && {
        robots: {
          index: false,
          follow: false,
        },
      }),
    };
  }