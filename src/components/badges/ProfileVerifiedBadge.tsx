"use client";

import { cn } from "@/lib/utils";
import { CheckCircle, Info } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ProfileVerifiedBadgeProps {
  profileVerifiedAt?: string | null;
  className?: string;
}

const TOOLTIP_TEXT =
  "Profile Verified means the provider has claimed this listing and it's been reviewed by Child Actor 101 for basic legitimacy and completeness. It is not a criminal background check.";

function formatVerifiedDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function ProfileVerifiedBadge({
  profileVerifiedAt,
  className,
}: ProfileVerifiedBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  // Close tooltip when clicking outside (for mobile)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        badgeRef.current &&
        !badgeRef.current.contains(event.target as Node)
      ) {
        setShowTooltip(false);
      }
    }

    if (showTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showTooltip]);

  const dateLabel = profileVerifiedAt
    ? `Verified: ${formatVerifiedDate(profileVerifiedAt)}`
    : null;

  return (
    <div className="relative inline-flex" ref={badgeRef}>
      <div
        className={cn(
          "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-white border cursor-default",
          className
        )}
        style={{
          backgroundColor: "#0F141B",
          borderColor: "#2DD4BF",
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip((prev) => !prev)}
      >
        <CheckCircle className="h-3 w-3" style={{ color: "#2DD4BF" }} />
        <span>Profile Verified</span>
        <Info className="h-3 w-3 text-gray-400" />
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div
          ref={tooltipRef}
          className="absolute z-50 top-full left-0 mt-2 w-64 p-3 rounded-lg bg-[#1A1F2B] border border-white/10 shadow-lg text-xs text-gray-300 leading-relaxed"
        >
          {TOOLTIP_TEXT}
          {dateLabel && (
            <div className="mt-2 pt-2 border-t border-white/10 text-white font-medium">
              {dateLabel}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

