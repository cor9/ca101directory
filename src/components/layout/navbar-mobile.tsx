"use client";

import { sidebarLinks } from "@/config/dashboard";
import { marketingConfig } from "@/config/marketing";
import { cn } from "@/lib/utils";
import { ArrowRight, Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { LoginButton } from "../auth/login-button";
import { Icons } from "../shared/icons";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { UserAccountNav } from "./user-account-nav";
import { usePathname } from "next/navigation";

/**
 * TODO: fix links for mobile, maybe use sections
 */
export function NavbarMobile() {
  const path = usePathname();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const links = marketingConfig.mainNav;

  const filteredLinks = sidebarLinks.map((section) => ({
    ...section,
    items: section.items/* .filter(
      ({ authorizeOnly }) => !authorizeOnly || authorizeOnly === user.role,
    ) */,
  }));

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
          {/* mobile navbar left show menu icon & show sheet when menu is open */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="size-9 shrink-0"
              >
                <Menu className="size-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
              <ScrollArea className="h-full overflow-y-auto">
                <div className="flex h-screen flex-col">
                  <nav className="flex flex-1 flex-col gap-4 p-2 pt-8 text-lg font-medium">

                    {filteredLinks && filteredLinks.map((section) => (
                      <section
                        key={section.title}
                        className="flex flex-col gap-1"
                      >
                        <p className="text-xs text-muted-foreground p-2">
                          {section.title}
                        </p>

                        {section.items.map((item) => {
                          const Icon = Icons[item.icon || "arrowRight"];
                          return (
                            item.href && (
                              <Fragment key={`link-fragment-${item.title}`}>
                                <Link
                                  key={`link-${item.title}`}
                                  onClick={() => {
                                    if (!item.disabled) setOpen(false);
                                  }}
                                  href={item.disabled ? "#" : item.href}
                                  className={cn(
                                    "flex items-center gap-3 rounded-md p-2 text-sm font-medium hover:bg-muted",
                                    path === item.href
                                      ? "bg-muted"
                                      : "text-muted-foreground hover:text-accent-foreground",
                                    item.disabled &&
                                    "cursor-not-allowed opacity-80 hover:bg-transparent hover:text-muted-foreground",
                                  )}
                                >
                                  <Icon className="size-5" />
                                  {item.title}
                                  {item.badge && (
                                    <Badge className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full">
                                      {item.badge}
                                    </Badge>
                                  )}
                                </Link>
                              </Fragment>
                            )
                          );
                        })}
                      </section>
                    ))}

                    {/* <div className="mt-auto">
                  <UpgradeCard />
                </div> */}
                  </nav>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>

          <div className="w-full flex-1">
            {/* TODO: show something here later */}
            {/* <SearchCommand links={filteredLinks} /> */}
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
        </div>
      </header>
    </>
  );
}
