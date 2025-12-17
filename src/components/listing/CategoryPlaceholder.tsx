import { getCategoryIcon } from "@/lib/categoryIcons";
import { cn } from "@/lib/utils";

interface CategoryPlaceholderProps {
  category: string | null | undefined;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: {
    container: "w-16 h-16",
    iconWrapper: "h-6 w-6",
    icon: "w-3 h-3",
    text: "text-[10px]",
    badge: "px-2 py-1 gap-1.5",
  },
  md: {
    container: "w-full h-full min-h-[140px]",
    iconWrapper: "h-7 w-7",
    icon: "w-3.5 h-3.5",
    text: "text-xs",
    badge: "px-3 py-2 gap-2",
  },
  lg: {
    container: "w-full h-full min-h-[200px]",
    iconWrapper: "h-8 w-8",
    icon: "w-4 h-4",
    text: "text-sm",
    badge: "px-4 py-2.5 gap-2",
  },
};

export function CategoryPlaceholder({
  category,
  size = "md",
  showLabel = true,
  className,
}: CategoryPlaceholderProps) {
  const Icon = getCategoryIcon(category);
  const sizes = sizeClasses[size];

  return (
    <div
      className={cn(
        "flex items-center justify-center bg-slate-100 rounded-lg",
        sizes.container,
        className
      )}
    >
      <div
        className={cn(
          "flex items-center rounded-full bg-white border border-slate-200 shadow-sm",
          sizes.badge
        )}
      >
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full bg-slate-900 text-white",
            sizes.iconWrapper
          )}
        >
          <Icon className={sizes.icon} />
        </span>
        {showLabel && category && (
          <span className={cn("font-medium text-slate-800", sizes.text)}>
            {category}
          </span>
        )}
      </div>
    </div>
  );
}

