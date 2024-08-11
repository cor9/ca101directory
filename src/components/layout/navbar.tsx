"use client";

import { LoginButton } from "@/components/auth/login-button";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { Button } from "@/components/ui/button";
import { marketingConfig } from "@/config/marketing";
import { siteConfig } from "@/config/site";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { ArrowRight, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { UserAccountNav } from "./user-account-nav";

interface NavBarProps {
  scroll?: boolean;
}

export function Navbar({ scroll = false }: NavBarProps) {
  const scrolled = useScroll(50);
  const { data: session, status } = useSession();
  const selectedLayout = useSelectedLayoutSegment();
  const links = marketingConfig.mainNav;

  return (
    <header
      className={cn(
        'hidden md:flex sticky top-0 z-40 w-full justify-center bg-background/60 backdrop-blur-xl transition-all',
        scroll ? (scrolled ? "border-b" : "bg-transparent") : "border-b"
      )}
    >
      <MaxWidthWrapper className="flex h-16 items-center justify-between">
        {/* navbar left show logo and links */}
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-1.5">
            <Sparkles />
            <span className="font-urban text-xl font-bold">
              {siteConfig.name}
            </span>
          </Link>

          {links && links.length > 0 ? (
            <nav className="hidden gap-6 md:flex">
              {links.map((item, index) => (
                <Link
                  key={index}
                  href={item.disabled ? "#" : item.href}
                  prefetch={true}
                  className={cn(
                    "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                    item.href.startsWith(`/${selectedLayout}`)
                      ? "text-foreground"
                      : "text-foreground/60",
                    item.disabled && "cursor-not-allowed opacity-80",
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>

        {/* navbar right show sign in or account */}
        <div className="flex items-center gap-x-4">
          {session ? (
            <div className="">
              <UserAccountNav />
            </div>
          ) : status === "unauthenticated" ? (
            <LoginButton mode="modal" asChild>
              <Button
                className="flex gap-2 px-5 rounded-full"
                variant="default"
                size="sm">
                <span>Sign In</span>
                <ArrowRight className="size-4" />
              </Button>
            </LoginButton>
          ) : (
            null
          )}

          {/* uncomment to enable mode toggle  */}
          {/* <ModeToggle /> */}
        </div>
      </MaxWidthWrapper>
    </header>
  );
}
