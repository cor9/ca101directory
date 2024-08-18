"use client";

import { LoginButton } from "@/components/auth/login-button";
import DocsSearch from "@/components/docs/docs-search";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { docsConfig } from "@/config/docs";
import { marketingConfig } from "@/config/marketing";
import { siteConfig } from "@/config/site";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { ArrowRight, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserAccountNav } from "./user-account-nav";
import { DocsSearchCommand } from "../docs/docs-search-command";
import CommandMenu from "../docs/docs-command-menu";

interface NavBarProps {
  scroll?: boolean;
}

export function Navbar({ scroll = false }: NavBarProps) {
  const scrolled = useScroll(50);
  const { data: session, status } = useSession();
  const pathname = usePathname();
  console.log(`Navbar, pathname: ${pathname}`);
  const isDocsPage = pathname.startsWith('/docs');
  console.log(`Navbar, isDocsPage: ${isDocsPage}`);
  const links = isDocsPage ? docsConfig.mainNav : marketingConfig.mainNav;
  console.log(`Navbar, links: ${links.map((link) => link.title)}`);

  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    // console.log(`Navbar, href: ${href}, pathname: ${pathname}`);
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        'hidden md:flex sticky top-0 z-40 w-full justify-center bg-background/60 backdrop-blur-xl transition-all',
        scroll ? (scrolled ? "border-b" : "bg-transparent") : "border-b"
      )}
    >
      <MaxWidthWrapper className="flex h-16 items-center justify-between">
        {/* navbar left show logo and links */}
        <div className="flex items-center gap-6 md:gap-10">

          {/* logo */}
          <Link href="/" className="flex items-center space-x-1.5">
            <Sparkles />
            <span className="font-urban text-xl font-bold">
              {siteConfig.name}
            </span>
          </Link>

          {/* links */}
          {links && links.length > 0 ? (
            <NavigationMenu>
              <NavigationMenuList>
                {links.map((item, index) => (
                  <NavigationMenuItem key={index}>
                    <Link href={item.disabled ? "#" : item.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          'px-2 bg-transparent focus:bg-transparent',
                          isLinkActive(item.href)
                            ? "text-foreground"
                            : "text-foreground/60",
                          item.disabled && "cursor-not-allowed opacity-80"
                        )}
                      >
                        {item.title}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          ) : null}
        </div>

        {/* navbar right show sign in or account */}
        <div className="flex items-center gap-x-4">
          {/* if in docs page show search */}
          {isDocsPage && (
            <DocsSearchCommand />
            // <CommandMenu />
          )}

          {/* {session ? (
            <div className="">
              <UserAccountNav />
            </div>
          ) : status === "unauthenticated" ? (
            <LoginButton mode="modal" asChild>
              <Button
                className="flex gap-2 px-5 rounded-full"
                variant="default"
                size="default">
                <span>Sign In</span>
                <ArrowRight className="size-4" />
              </Button>
            </LoginButton>
          ) : (
            null
          )} */}
        </div>
      </MaxWidthWrapper>
    </header>
  );
}