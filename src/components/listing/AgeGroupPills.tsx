import { cn } from "@/lib/utils";

type AgeGroup = "tots" | "tweens" | "teens" | "young_adults";

const ageGroupLabels: Record<AgeGroup, string> = {
  tots: "Tots",
  tweens: "Tweens",
  teens: "Teens",
  young_adults: "18+",
};

const ageGroupColors: Record<AgeGroup, string> = {
  tots: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  tweens: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  teens: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  young_adults: "bg-purple-500/20 text-purple-300 border-purple-500/30",
};

interface AgeGroupPillsProps {
  ageGroups: string[] | null | undefined;
  maxPills?: number;
  className?: string;
}

export function AgeGroupPills({
  ageGroups,
  maxPills = 3,
  className,
}: AgeGroupPillsProps) {
  if (!ageGroups || ageGroups.length === 0) return null;

  const validGroups = ageGroups.filter(
    (g): g is AgeGroup => g in ageGroupLabels
  );

  if (validGroups.length === 0) return null;

  const displayGroups = validGroups.slice(0, maxPills);
  const remaining = validGroups.length - maxPills;

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {displayGroups.map((group) => (
        <span
          key={group}
          className={cn(
            "px-2 py-0.5 text-[10px] font-medium rounded-full border",
            ageGroupColors[group]
          )}
        >
          {ageGroupLabels[group]}
        </span>
      ))}
      {remaining > 0 && (
        <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-white/5 text-text-muted border border-white/10">
          +{remaining}
        </span>
      )}
    </div>
  );
}

