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
    icon: "w-6 h-6",
    text: "text-xs",
  },
  md: {
    container: "w-full h-full min-h-[140px]",
    icon: "w-10 h-10",
    text: "text-sm",
  },
  lg: {
    container: "w-full h-full min-h-[200px]",
    icon: "w-14 h-14",
    text: "text-base",
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
        "flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 rounded-lg",
        sizes.container,
        className
      )}
    >
      <div className="p-3 rounded-full bg-white/5 border border-white/10">
        <Icon className={cn("text-text-muted", sizes.icon)} />
      </div>
      {showLabel && category && (
        <span className={cn("text-text-muted font-medium text-center px-2", sizes.text)}>
          {category}
        </span>
      )}
    </div>
  );
}

