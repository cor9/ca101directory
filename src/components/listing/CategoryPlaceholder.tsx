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
  "Acting Training": "Training",
  "Career Coaching & Consulting": "Consulting",
  "Demo Reels & Editing": "Reels",
  "Actor Marketing Services": "Marketing",
  "Self-Tape Services": "Self Tape",
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

// One warm, neutral tint for every category (no rainbow of pastels)
const PLACEHOLDER_GRADIENT = "from-canvas-2 to-canvas-3";

function getShortLabel(category: string): string {
  return shortLabels[category] || category;
}

function getCategoryGradient(_category: string | null | undefined): string {
  return PLACEHOLDER_GRADIENT;
}

export function CategoryPlaceholder({
  category,
  size = "md",
  showLabel = true,
  className,
}: CategoryPlaceholderProps) {
  const Icon = getCategoryIcon(category);
  const shortLabel = category ? getShortLabel(category) : "Professional";
  const gradient = getCategoryGradient(category);

  // For sm size: centered icon in tinted container
  if (size === "sm") {
    return (
      <div
        className={cn(
          "relative w-16 h-16 rounded-lg bg-gradient-to-br flex items-center justify-center",
          gradient,
          className,
        )}
      >
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/80 shadow-sm">
          <Icon className="w-4 h-4 text-slate-600" />
        </div>
      </div>
    );
  }

  // For md/lg: centered icon with category label - looks intentional, not abandoned
  return (
    <div
      className={cn(
        "relative rounded-lg bg-gradient-to-br flex flex-col items-center justify-center",
        gradient,
        className,
      )}
    >
      {/* Large centered icon */}
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-white/70 shadow-md mb-3">
        <Icon className="w-8 h-8 text-slate-600" />
      </div>

      {/* Category label below icon */}
      {showLabel && shortLabel && (
        <span className="text-sm font-medium text-slate-600 px-3 py-1 bg-white/60 rounded-full">
          {shortLabel}
        </span>
      )}
    </div>
  );
}
