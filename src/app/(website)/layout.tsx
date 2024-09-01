import "@/styles/globals.css";

import {
  fontSourceSerif,
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
          fontSourceSerif.className,
        )}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            
            {children}

            <Toaster richColors closeButton />
            
            <TailwindIndicator />

          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
