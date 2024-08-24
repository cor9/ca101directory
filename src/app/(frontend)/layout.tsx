import "@/styles/globals.css";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { fontGeist, fontHeading, fontSans, fontUrban, fontSourceSerif, fontSourceCode, fontSourceSans } from "@/assets/fonts";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

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
          // fontSourceCode.className,
          // fontSourceSerif.className,
          GeistSans.className,
          // GeistMono.className,
          GeistSans.variable,
          GeistMono.variable,
          // fontSans.variable,
          // fontUrban.variable,
          // fontHeading.variable,
          // fontGeist.variable,
        )}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors closeButton />
            <TailwindIndicator />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
