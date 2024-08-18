"use client";

import { docsConfig } from "@/config/docs";
import { marketingConfig } from "@/config/marketing";
import { cn } from "@/lib/utils";
import { ArrowRight, MenuIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LoginButton } from "../auth/login-button";
import { DocsSearchCommand } from "../docs/docs-search-command";
import { DocsSidebarNav } from "../docs/docs-sidebar-nav";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { UserAccountNav } from "./user-account-nav";

export function NavbarMobile() {
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
    <>
      <header className="md:hidden sticky top-0 z-40 flex w-full justify-center bg-background/60 backdrop-blur-xl transition-all">
        <div className="w-full px-4 flex h-16 items-center justify-between">
          {/* mobile navbar left show menu icon when closed & show sheet when menu is open */}
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
              <ScrollArea className="h-full overflow-y-auto">
                <div className="flex h-screen flex-col">
                  <nav className="flex flex-1 flex-col gap-1 p-2 pt-11 text-lg font-medium">
                    {links.map((item) => (
                      <Link
                        key={item.title}
                        href={item.disabled ? "#" : item.href}
                        onClick={() => {
                          if (!item.disabled) setOpen(false);
                        }}
                        className={cn(
                          "flex items-center gap-1 rounded-md p-2 text-sm font-medium hover:bg-muted",
                          isLinkActive(item.href)
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground hover:text-foreground",
                          item.disabled &&
                          "cursor-not-allowed opacity-80 hover:bg-transparent hover:text-muted-foreground"
                        )}
                      >
                        {item.title}
                      </Link>
                    ))}

                    {isDocsPage ? (
                      <div className="p-4">
                        <DocsSidebarNav setOpen={setOpen} />
                      </div>
                    ) : null}
                  </nav>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>

          {/* mobile navbar right show sign in or account */}
          <div className="flex items-center gap-x-4">
            {/* if in docs page show search */}
            {isDocsPage && (
              <DocsSearchCommand />
            )}

            {session ? (
              <div className="">
                <UserAccountNav />
              </div>
            ) : status === "unauthenticated" ? (
              <LoginButton mode="modal" asChild>
                <Button
                  className="flex gap-2 px-5 rounded-full"
                  variant="default"
                  size="default"
                >
                  <span>Sign In</span>
                  <ArrowRight className="size-4" />
                </Button>
              </LoginButton>
            ) : (
              null
            )}
          </div>
        </div>
      </header>
    </>
  );
}