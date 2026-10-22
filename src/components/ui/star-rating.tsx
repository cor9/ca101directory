"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
  className?: string;
  /** "light" for white surfaces: visible empty stars + focus ring */
  tone?: "dark" | "light";
}

export function StarRating({ 
  value, 
  onChange, 
  size = "md", 
  readonly = false,
  className,
  tone = "dark",
}: StarRatingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          disabled={readonly}
          aria-label={`${star} star${star === 1 ? "" : "s"}`}
          className={cn(
            "rounded transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2",
            !readonly && "hover:scale-110",
            readonly ? "cursor-default" : "cursor-pointer"
          )}
        >
          <Star
            className={cn(
              sizeClasses[size],
              star <= value
                ? "fill-amber-400 text-amber-500"
                : tone === "light"
                  ? "fill-zinc-100 text-zinc-400"
                  : "fill-gray-200 text-paper"
            )}
          />
        </button>
      ))}
    </div>
  );
}
