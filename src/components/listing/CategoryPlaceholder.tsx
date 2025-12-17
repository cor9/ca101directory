import { getCategoryIcon } from "@/lib/categoryIcons";
import { cn } from "@/lib/utils";

interface CategoryPlaceholderProps {
  category: string | null | undefined;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

// Short labels for common categories (keeps badge compact)
const shortLabels: Record<string, string> = {
  "Headshot Photographers": "Headshots",
  "Talent Managers": "Managers",
  "Talent Agents": "Agents",
  "Acting Classes & Coaches": "Coaches",
  "Acting Coach": "Coaches",
  "Self Tape Support": "Self Tape",
  "Demo Reel Creators": "Reels",
  "Career Consultation": "Consulting",
  "Dialect Coach": "Dialect",
  "Vocal Coaches": "Vocal",
};

function getShortLabel(category: string): string {
  return shortLabels[category] || category;
}

export function CategoryPlaceholder({
  category,
  size = "md",
  showLabel = true,
  className,
}: CategoryPlaceholderProps) {
  const Icon = getCategoryIcon(category);
  const shortLabel = category ? getShortLabel(category) : "";

  // For sm size, just show icon in a small container
  if (size === "sm") {
    return (
      <div
        className={cn(
          "relative w-16 h-16 bg-slate-100 rounded-lg",
          className
        )}
      >
        <div className="absolute top-1.5 left-1.5">
          <div className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-slate-900 text-white">
            <Icon className="w-2.5 h-2.5" />
          </div>
        </div>
      </div>
    );
  }

  // For md/lg, position badge top-left (not centered)
  return (
    <div
      className={cn(
        "relative bg-slate-100 rounded-lg",
        className
      )}
    >
      <div className="absolute top-3 left-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 border border-slate-200 px-2 py-1 shadow-sm">
          <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-slate-900 text-white">
            <Icon className="w-2.5 h-2.5" />
          </span>
          {showLabel && shortLabel && (
            <span className="text-xs font-medium text-slate-700">
              {shortLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

