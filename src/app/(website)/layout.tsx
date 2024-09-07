import "@/styles/globals.css";

import {
  fontBricolageGrotesque as fontBricolage,
  fontSourceSans,
  fontSourceSerif,
  fontWorkSans,
} from "@/assets/fonts";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          // fontSourceSans.className,
          fontBricolage.className,
          fontSourceSerif.variable,
          fontSourceSans.variable,
          fontWorkSans.variable,
          fontBricolage.variable,
        )}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>

            {children}

            {/* https://sonner.emilkowal.ski/toaster */}
            {/* <Toaster richColors position="top-right" offset={64} /> */}
            <Toaster richColors position="top-center" />

            <TailwindIndicator />

          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
