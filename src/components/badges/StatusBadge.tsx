import { Badge } from "@/components/ui/badge";
import { CheckCircle, Shield, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export type BadgeType = "verified" | "featured" | "pro";

interface StatusBadgeProps {
  type: BadgeType;
  showIcon?: boolean;
  className?: string;
}

const BADGE_CONFIG: Record<
  BadgeType,
  {
    label: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    icon?: typeof CheckCircle;
  }
> = {
  verified: {
    label: "Verified",
    bgColor: "rgba(78,163,255,0.10)",
    borderColor: "rgba(78,163,255,0.60)",
    textColor: "#FFFFFF",
    icon: CheckCircle,
  },
  featured: {
    label: "Featured",
    bgColor: "rgba(247,201,72,0.12)",
    borderColor: "rgba(247,201,72,0.70)",
    textColor: "#FFFFFF",
    icon: Star,
  },
  pro: {
    label: "Pro",
    bgColor: "rgba(169,124,255,0.10)",
    borderColor: "rgba(169,124,255,0.65)",
    textColor: "#FFFFFF",
  },
};

export function StatusBadge({
  type,
  showIcon = false,
  className,
}: StatusBadgeProps) {
  const config = BADGE_CONFIG[type];
  const Icon = config.icon;

  return (
    <Badge
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-medium border",
        className,
      )}
      style={{
        backgroundColor: config.bgColor,
        borderColor: config.borderColor,
        color: config.textColor,
      }}
    >
      {showIcon && Icon && (
        <Icon className="w-3 h-3 mr-1" style={{ color: config.textColor }} />
      )}
      {config.label}
    </Badge>
  );
}

/**
 * Badge stack with priority: Verified → Featured → Pro
 * If all 3 exist, show Verified + Pro only (Featured rotates, not stacked)
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
    <div className="flex flex-wrap gap-1.5">
      {displayBadges.map((type) => (
        <StatusBadge key={type} type={type} showIcon={type === "verified"} />
      ))}
    </div>
  );
}
