"use client";

import { cn } from "@/lib/utils";
import { CheckCircle, Star } from "lucide-react";

interface StatusPillsProps {
  verified?: boolean;
  featured?: boolean;
  pro?: boolean;
  onlineOnly?: boolean;
  className?: string;
}

// Accent color mappings (using Tailwind CSS variables)
const ACCENT_COLORS: Record<string, string> = {
  verified: "#00E5FF", // accent-aqua
  featured: "#FFD700", // accent-gold
  pro: "#B24BF3", // accent-purple
  onlineOnly: "#6666FF", // accent-blue
};

export function StatusPills({
  verified = false,
  featured = false,
  pro = false,
  onlineOnly = false,
  className,
}: StatusPillsProps) {
  const pills: Array<{
    label: string;
    accentColor: string;
    icon?: typeof CheckCircle;
  }> = [];

  if (verified) {
    pills.push({
      label: "Verified",
      accentColor: ACCENT_COLORS.verified,
      icon: CheckCircle,
    });
  }
  if (featured) {
    pills.push({
      label: "Featured",
      accentColor: ACCENT_COLORS.featured,
      icon: Star,
    });
  }
  if (pro) {
    pills.push({
      label: "Pro",
      accentColor: ACCENT_COLORS.pro,
    });
  }
  if (onlineOnly) {
    pills.push({
      label: "Online Only",
      accentColor: ACCENT_COLORS.onlineOnly,
    });
  }

  if (pills.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {pills.map((pill) => {
        const Icon = pill.icon;
        // Convert hex to rgba for opacity
        const hexToRgba = (hex: string, opacity: number) => {
          const r = Number.parseInt(hex.slice(1, 3), 16);
          const g = Number.parseInt(hex.slice(3, 5), 16);
          const b = Number.parseInt(hex.slice(5, 7), 16);
          return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        };

        return (
          <div
            key={pill.label}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium",
              "border transition-colors tracking-wide text-white",
            )}
            style={{
              backgroundColor: hexToRgba(pill.accentColor, 0.12),
              borderColor: hexToRgba(pill.accentColor, 0.8),
              color: "#FFFFFF",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = hexToRgba(
                pill.accentColor,
                0.14,
              );
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = hexToRgba(
                pill.accentColor,
                0.12,
              );
            }}
          >
            {Icon && <Icon className="h-3 w-3" style={{ color: "#FFFFFF" }} />}
            <span>{pill.label}</span>
          </div>
        );
      })}
    </div>
  );
}
