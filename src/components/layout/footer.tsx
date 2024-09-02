import { ModeToggle } from "@/components/layout/mode-toggle";
import { footerLinks } from "@/config/site";
import { cn } from "@/lib/utils";
import Link from "next/link";
import * as React from "react";
import Container from "../shared/container";
import { SiteFooterInfo } from "../site-footer-info";

export function Footer({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn("border-t", className)}>
      <Container className="grid grid-cols-2 gap-6 py-12 md:grid-cols-6">
        <div className="flex flex-col items-start col-span-full md:col-span-2">
          <SiteFooterInfo />
        </div>
        
        {footerLinks.map((section) => (
          <div key={section.title} className="col-span-1 md:col-span-1 items-start">
            <span className="text-sm font-semibold text-foreground font-serif">
              {section.title}
            </span>
            <ul className="mt-4 list-inside space-y-3">
              {section.items?.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="border-t py-4">
        <Container className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} All rights reserved
          </span>

          <div className="flex items-center gap-3">
            <ModeToggle />
          </div>
        </Container>
      </div>
    </footer>
  );
}
