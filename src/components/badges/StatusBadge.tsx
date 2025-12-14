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
            "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-white border",
            className,
          )}
          style={{
            backgroundColor: "#0F141B",
            borderColor: "#2DD4BF", // teal/cyan
          }}
        >
          <CheckCircle className="h-3 w-3" style={{ color: "#2DD4BF" }} />
          <span>Verified</span>
        </div>
      );

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
