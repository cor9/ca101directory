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
        <meta name="impact-site-verification" value="72d79363-1a4b-42ec-be63-d24c04b73026" />
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
