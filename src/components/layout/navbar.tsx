"use client";

import { LoginButton } from "@/components/auth/login-button";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { docsConfig } from "@/config/docs";
import { marketingConfig } from "@/config/marketing";
import { siteConfig } from "@/config/site";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { ArrowRight, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

interface NavBarProps {
  scroll?: boolean;
  large?: boolean;
}

export function NavBar({ scroll = false }: NavBarProps) {
  const scrolled = useScroll(50);
  const { data: session, status } = useSession();
  const selectedLayout = useSelectedLayoutSegment();
  // const documentation = (selectedLayout === "docs");

  const configMap = {
    docs: docsConfig.mainNav,
  };

  const links =
    (selectedLayout && configMap[selectedLayout]) || marketingConfig.mainNav;

  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex w-full justify-center bg-background/60 backdrop-blur-xl transition-all',
        scroll ? (scrolled ? "border-b" : "bg-transparent") : "border-b"
      )}
    >

      <MaxWidthWrapper className="flex h-16 items-center justify-between">
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

        <div className="flex items-center space-x-3">
          {/* TODO: removed right header for docs */}
          {/* {documentation ? (
            <div className="hidden flex-1 items-center space-x-4 sm:justify-end lg:flex">
              <div className="hidden lg:flex lg:grow-0">
                <DocsSearch />
              </div>
              <div className="flex lg:hidden">
                <Search className="size-6 text-muted-foreground" />
              </div>
              <div className="flex space-x-4">
                <Link
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github className="size-7" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </div>
            </div>
          ) : null} */}

          {session ? (
            <Link
              href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"}
              className="hidden md:block">
              <Button
                className="gap-2 px-5 rounded-full"
                variant="default"
                size="sm">
                <span>Dashboard</span>
              </Button>
            </Link>
          ) : status === "unauthenticated" ? (
            <LoginButton mode="modal" asChild>
              <Button
                className="hidden gap-2 px-5 rounded-full md:flex"
                variant="default"
                size="sm">
                <span>Sign In</span>
                <ArrowRight className="size-4" />
              </Button>
            </LoginButton>
          ) : (
            <Skeleton className="hidden h-9 w-28 rounded-full lg:flex" />
          )}
        </div>
      </MaxWidthWrapper>
    </header>
  );
}
