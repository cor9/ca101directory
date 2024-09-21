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
import { auth } from "@/auth";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await auth();
  
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
        {/* 20240918，之前这里并没有加session={session}，但是看authy代码是有的，不知道为什么当初删掉了 */}
        {/* https://github.com/javayhu/Authy/blob/main/app/layout.tsx#L24 */}
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>

            {children}

            {/* https://sonner.emilkowal.ski/toaster */}
            {/* <Toaster richColors position="top-right" offset={64} /> */}
            <Toaster richColors position="bottom-right" offset={64} />

            <TailwindIndicator />

          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
