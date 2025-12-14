import { cn } from "@/lib/utils";
import { CheckCircle, Star } from "lucide-react";

export type BadgeType = "verified" | "featured" | "pro";

interface StatusBadgeProps {
  type: BadgeType;
  className?: string;
}

export function StatusBadge({ type, className }: StatusBadgeProps) {
  switch (type) {
    case "verified":
      return (
        <div
          className={cn(
            "flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm border border-white/10 border-l-2 border-l-accent-aqua",
            className,
          )}
        >
          <CheckCircle className="h-3 w-3 text-accent-aqua" />
          <span>Verified</span>
        </div>
      );

    case "featured":
      return (
        <div
          className={cn(
            "flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm border border-white/10 border-l-2 border-l-accent-gold",
            className,
          )}
        >
          <Star className="h-3 w-3 text-accent-gold" />
          <span>Featured</span>
        </div>
      );

    case "pro":
      return (
        <div
          className={cn(
            "flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm border border-accent-purple/40",
            className,
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent-purple" />
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
}: {
  verified?: boolean;
  featured?: boolean;
  pro?: boolean;
  maxBadges?: number;
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
        <StatusBadge key={type} type={type} />
      ))}
    </div>
  );
}
