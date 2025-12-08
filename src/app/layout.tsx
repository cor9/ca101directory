import "@/styles/globals.css";
import "@/styles/tokens.css";

import {
  fontBricolageGrotesque as fontBricolage,
  fontSourceSans,
  fontSourceSerif,
  fontWorkSans,
} from "@/assets/fonts";
import { auth } from "@/auth";
import { AhrefsAnalytics } from "@/components/analytics/ahrefs-analytics";
import { Analytics } from "@/components/analytics/analytics";
import { FacebookSDK } from "@/components/analytics/facebook-sdk";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Toaster } from "@/components/ui/sonner";
import { constructMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import Script from "next/script";

export const metadata = constructMetadata();

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  // https://youtu.be/1MTyCvS05V4?t=21464
  let session = null;

  try {
    session = await auth();
  } catch (error) {
    console.warn("Auth failed in layout:", error);
    // Continue without session if auth fails
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="impact-site-verification" content="72d79363-1a4b-42ec-be63-d24c04b73026" />
        <Script id="impact-stat" strategy="afterInteractive">
          {`(function(i,m,p,a,c,t){c.ire_o=p;c[p]=c[p]||function(){(c[p].a=c[p].a||[]).push(arguments)};t=a.createElement(m);var z=a.getElementsByTagName(m)[0];t.async=1;t.src=i;z.parentNode.insertBefore(t,z)})('https://utt.impactcdn.com/P-A4798761-60ea-47a3-9269-a8e8a25503651.js','script','impactStat',document,window);impactStat('transformLinks');impactStat('trackImpression');`}
        </Script>
      </head>
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          fontBricolage.className,
          // fontSourceSans.className,
          // fontSourceSerif.className,
          // fontWorkSans.className,
          fontSourceSerif.variable,
          fontSourceSans.variable,
          fontWorkSans.variable,
          fontBricolage.variable,
        )}
      >
        {/* Impact verification text in first body section */}
        <p className="sr-only">
          Impact-Site-Verification: 72d79363-1a4b-42ec-be63-d24c04b73026
        </p>
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}

            {/* https://sonner.emilkowal.ski/toaster */}
            <Toaster richColors position="top-right" offset={64} />

            <TailwindIndicator />

            <Analytics />
            <FacebookSDK />
            <AhrefsAnalytics />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
