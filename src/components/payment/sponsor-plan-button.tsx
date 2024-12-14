"use client";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import type { ItemInfo } from "@/types";
import { ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface SponsorPlanButtonProps {
  item?: ItemInfo;
  className?: string;
}

export function SponsorPlanButton({ item, className }: SponsorPlanButtonProps) {
  // console.log('SponsorPlanButton, item:', item);
  const router = useRouter();

  const handleClick = () => {
    console.log("SponsorPlanButton, handleClick, item.sponsor:", item?.sponsor);
    if (!item) {
      // no specific item in pricing page
      router.push("/submit");
    } else if (item) {
      // in payment page go to contact us
      window.location.href = `mailto:${siteConfig.mail}`;
    } else {
      console.error("SponsorPlanButton, invalid sponsor item");
    }
  };

  return (
    <Button
      size="lg"
      variant="outline"
      className={cn(
        "overflow-hidden rounded-full",
        "group transition-transform duration-300 ease-in-out hover:scale-105",
        className,
      )}
      onClick={handleClick}
    >
      {!item ? (
        <div className="flex items-center justify-center gap-2">
          <span>Go Submit</span>
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <span>Contact Us</span>
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
        </div>
      )}
    </Button>
  );
}
