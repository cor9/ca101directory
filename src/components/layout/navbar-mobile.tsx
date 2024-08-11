"use client";

import { docsConfig } from "@/config/docs";
import { marketingConfig } from "@/config/marketing";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { useEffect, useState } from "react";
import { SearchButton } from "../search-button";
import { ModeToggle } from "./mode-toggle";

export function NavMobile() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const selectedLayout = useSelectedLayoutSegment();

  const configMap = {
    docs: docsConfig.mainNav,
  };

  const links = (selectedLayout && configMap[selectedLayout])
    || marketingConfig.mainNav;

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
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed right-2 top-3 z-50 rounded-full p-2 transition-colors duration-200 hover:bg-muted focus:outline-none active:bg-muted md:hidden",
          open && "hover:bg-muted active:bg-muted",
        )}
      >
        {open ? (
          <X className="size-5 text-muted-foreground" />
        ) : (
          <Menu className="size-5 text-muted-foreground" />
        )}
      </button>

      <nav
        className={cn(
          "fixed inset-0 z-20 hidden w-full overflow-auto bg-background px-5 py-16 md:hidden",
          open && "block",
        )}
      >
        <ul className="grid divide-y divide-muted">
          {links && links.length > 0 && links.map(({ title, href }) => (
            <li key={href} className="py-3">
              <Link
                href={href}
                onClick={() => setOpen(false)}
                className="flex w-full font-medium capitalize"
              >
                {title}
              </Link>
            </li>
          ))}

          {session ? (
            <>
              <li className="py-3">
                <Link
                  href="/dashboard"
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  className="flex w-full font-medium capitalize"
                >
                  Dashboard
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="py-3">
                <Link
                  href="/login"
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  className="flex w-full font-medium capitalize"
                >
                  Sign in
                </Link>
              </li>

              <li className="py-3">
                <Link
                  href="/register"
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  className="flex w-full font-medium capitalize"
                >
                  Sign up
                </Link>
              </li>
            </>
          )}
        </ul>

        <div className="mt-8 flex items-center justify-end space-x-2">
          <SearchButton clickAction={() => setOpen(false)} />
          <ModeToggle />
        </div>
      </nav>
    </>
  );
}
