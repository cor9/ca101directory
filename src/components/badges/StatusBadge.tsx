"use client";

import { cn } from "@/lib/utils";
import { CheckCircle, Star, Info } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export type BadgeType = "verified" | "featured" | "pro";

interface StatusBadgeProps {
  type: BadgeType;
  className?: string;
  profileVerifiedAt?: string | null;
}

const PROFILE_VERIFIED_TOOLTIP =
  "Profile Verified means the provider has claimed this listing and it's been reviewed by Child Actor 101 for basic legitimacy and completeness. It is not a criminal background check.";

function formatVerifiedDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function VerifiedBadge({
  className,
  profileVerifiedAt,
}: {
  className?: string;
  profileVerifiedAt?: string | null;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

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

      {showTooltip && (
        <div
          ref={tooltipRef}
          className="absolute z-50 top-full left-0 mt-2 w-64 p-3 rounded-lg bg-[#1A1F2B] border border-white/10 shadow-lg text-xs text-gray-300 leading-relaxed"
        >
          {PROFILE_VERIFIED_TOOLTIP}
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

export function StatusBadge({ type, className, profileVerifiedAt }: StatusBadgeProps) {
  switch (type) {
    case "verified":
      return <VerifiedBadge className={className} profileVerifiedAt={profileVerifiedAt} />;

    case "featured":
      return (
        <div
          className={cn(
            "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-white border",
            className,
          )}
          style={{
            backgroundColor: "#0F141B",
            borderColor: "#FACC15", // gold
          }}
        >
          <Star className="h-3 w-3" style={{ color: "#FACC15" }} />
          <span>Featured</span>
        </div>
      );

    case "pro":
      return (
        <div
          className={cn(
            "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-white border",
            className,
          )}
          style={{
            backgroundColor: "#0F141B",
            borderColor: "#B24BF3", // purple
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: "#B24BF3" }}
          />
          <span>Pro</span>
        </div>
      );
  }
}

/**
 * Badge stack with priority: Verified → Featured → Pro
 * If all 3 exist, show Verified + Pro only (Featured rotates, not stacked)
 * Badges sit top-left with consistent spacing
 */
export function BadgeStack({
  verified = false,
  featured = false,
  pro = false,
  maxBadges = 2,
  profileVerifiedAt,
}: {
  verified?: boolean;
  featured?: boolean;
  pro?: boolean;
  maxBadges?: number;
  profileVerifiedAt?: string | null;
}) {
  const badges: BadgeType[] = [];

  // Priority order: Verified → Featured → Pro
  if (verified) badges.push("verified");
  if (featured && badges.length < maxBadges) badges.push("featured");
  if (pro && badges.length < maxBadges) {
    // If all 3 exist, show Verified + Pro only
    if (verified && featured && pro) {
      badges.pop(); // Remove Featured
      badges.push("pro");
    } else {
      badges.push("pro");
    }
  }

  // Limit to maxBadges
  const displayBadges = badges.slice(0, maxBadges);

  return (
    <div className="flex flex-wrap gap-2">
      {displayBadges.map((type) => (
        <StatusBadge
          key={type}
          type={type}
          profileVerifiedAt={type === "verified" ? profileVerifiedAt : undefined}
        />
      ))}
    </div>
  );
}
