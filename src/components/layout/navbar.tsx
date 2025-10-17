"use client";

import { LoginWrapper } from "@/components/auth/login-button";
import Container from "@/components/container";
import { Icons } from "@/components/icons/icons";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { UserButton } from "@/components/layout/user-button";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import type { DashboardConfig, MarketingConfig } from "@/types";
import type { ExtendedUser } from "@/types/next-auth";
import { ArrowRightIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";
import { Logo } from "../logo";

interface NavBarProps {
  scroll?: boolean;
  config: DashboardConfig | MarketingConfig;
  user?: ExtendedUser | undefined;
}

export function Navbar({ scroll = false, config, user }: NavBarProps) {
  const scrolled = useScroll(50);
  // console.log(`navbar: user:`, user);

  const pathname = usePathname();
  // console.log(`Navbar, pathname: ${pathname}`);
  const links = config.menus;
  // console.log(`Navbar, links: ${links.map((link) => link.title)}`);

  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    // console.log(`Navbar, href: ${href}, pathname: ${pathname}`);
    return pathname.startsWith(href);
  };

  const [open, setOpen] = useState(false);
  // prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  return (
    <div className="sticky top-0 z-40 w-full">
      {/* Desktop View */}
      <header
        className={cn(
          "hidden md:flex justify-center bg-background/60 backdrop-blur-xl transition-all",
          scroll ? (scrolled ? "border-b" : "bg-transparent") : "border-b",
        )}
      >
        <Container className="flex h-16 items-center justify-between">
          {/* navbar left show logo and links */}
          <div className="flex items-center gap-6 md:gap-10">
            {/* logo */}
            <Link href="/" className="flex items-center">
              <Logo size="lg" variant="hero" />
            </Link>

            {/* links */}
            {links && links.length > 0 ? (
              <NavigationMenu>
                <NavigationMenuList>
                  {links.map((item) => (
                    <NavigationMenuItem key={item.title}>
                      <NavigationMenuLink
                        href={item.disabled ? "#" : item.href}
                        target={item.external ? "_blank" : ""}
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "px-2 bg-transparent focus:bg-transparent text-base",
                          item.disabled && "cursor-not-allowed opacity-80",
                        )}
                        style={{
                          color: isLinkActive(item.href)
                            ? "#1B1F29"
                            : "#1B1F2999",
                          fontWeight: isLinkActive(item.href) ? "600" : "400",
                        }}
                      >
                        {item.title}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            ) : null}
          </div>

          {/* navbar right show sign in or account */}
          <div className="flex items-center gap-x-4">
            {user ? (
              <div className="flex items-center">
                <UserButton />
              </div>
            ) : (
              <LoginWrapper mode="modal" asChild>
                <Button
                  className="flex gap-2 px-5 rounded-full"
                  variant="default"
                  size="default"
                >
                  <span>Sign In</span>
                  <ArrowRightIcon className="size-4" />
                </Button>
              </LoginWrapper>
            )}

            {/* <ModeToggle /> */}
          </div>
        </Container>
      </header>

      {/* Mobile View */}
      <header className="md:hidden flex justify-center bg-background/60 backdrop-blur-xl transition-all">
        <div className="w-full px-4 h-16 flex items-center justify-between">
          {/* mobile navbar left show menu icon when closed & show sheet when menu is open */}
          <div className="flex items-center gap-x-4">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-9 shrink-0"
                >
                  <MenuIcon className="size-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col p-0">
                <div className="flex h-screen flex-col">
                  {/* logo */}
                  <Link
                    href="/"
                    className="pl-4 pt-4"
                    onClick={() => setOpen(false)}
                  >
                    <Logo size="lg" variant="hero" />
                  </Link>

                  <nav className="flex flex-1 flex-col gap-2 p-2 pt-8 font-medium">
                    {links.map((item) => {
                      const Icon = Icons[item.icon || "arrowRight"];
                      return (
                        <Link
                          key={item.title}
                          href={item.disabled ? "#" : item.href}
                          target={item.external ? "_blank" : ""}
                          onClick={() => {
                            if (!item.disabled) setOpen(false);
                          }}
                          className={cn(
                            "flex items-center rounded-md gap-2 p-2 text-sm font-medium hover:bg-muted",
                            isLinkActive(item.href) && "bg-muted",
                            item.disabled &&
                              "cursor-not-allowed opacity-80 hover:bg-transparent",
                          )}
                          style={{
                            color: "#1B1F29",
                          }}
                        >
                          <Icon className="size-5" />
                          {item.title}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            {/* logo */}
            <Link href="/" onClick={() => setOpen(false)}>
              <Logo size="md" variant="hero" />
            </Link>
          </div>

          {/* mobile navbar right show sign in or account */}
          <div className="flex items-center gap-x-4">
            {user ? (
              <div className="flex items-center">
                <UserButton />
              </div>
            ) : (
              <LoginWrapper mode="redirect" asChild>
                <Button
                  className="flex gap-2 px-5 rounded-full"
                  variant="default"
                  size="default"
                >
                  <span>Sign In</span>
                  <ArrowRightIcon className="size-4" />
                </Button>
              </LoginWrapper>
            )}

            {/* <ModeToggle /> */}
          </div>
        </div>
      </header>
    </div>
  );
}
