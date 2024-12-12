"use client";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import type { ItemInfo } from "@/types";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

interface SponsorPlanButtonProps {
  item?: ItemInfo;
  className?: string;
}

export function SponsorPlanButton({ item, className }: SponsorPlanButtonProps) {
  // console.log('SponsorPlanButton, item:', item);

  return (
    <Button
      size="lg"
      variant="outline"
      className={cn(
        "overflow-hidden rounded-full",
        "group transition-transform duration-300 ease-in-out hover:scale-105",
        className,
      )}
    >
      <Link
        href={`mailto:${siteConfig.mail}`}
        className="flex items-center justify-center gap-2"
      >
        <span>Contact Us</span>
        <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </Button>
  );
}
