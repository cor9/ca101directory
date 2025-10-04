import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BauhausCardProps {
  children: ReactNode;
  className?: string;
  withHollywoodAccent?: boolean;
  variant?: "default" | "mustard" | "blue";
}

/**
 * Bauhaus Mid-Century Modern Hollywood Card Component
 * 
 * Implements the design principles from guardrails:
 * - Strong grid alignment
 * - Cream cards on navy backdrop
 * - Geometric shadows
 * - Optional Hollywood clapperboard accent
 * - Bauhaus color variants
 */
export function BauhausCard({ 
  children, 
  className, 
  withHollywoodAccent = false,
  variant = "default"
}: BauhausCardProps) {
  return (
    <div
      className={cn(
        "bauhaus-card",
        "relative p-6",
        withHollywoodAccent && "hollywood-accent",
        variant === "mustard" && "border-bauhaus-mustard",
        variant === "blue" && "border-bauhaus-blue",
        className
      )}
    >
      {children}
    </div>
  );
}

interface BauhausButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
  disabled?: boolean;
}

/**
 * Bauhaus Button Component
 * 
 * Features:
 * - Bold contrast colors
 * - Uppercase text with letter spacing
 * - Geometric shadows
 * - Hover animations
 */
export function BauhausButton({
  children,
  onClick,
  variant = "primary",
  className,
  disabled = false
}: BauhausButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        variant === "primary" ? "bauhaus-btn-primary" : "bauhaus-btn-secondary",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
}

interface BauhausChipProps {
  children: ReactNode;
  variant?: "default" | "mustard" | "orange";
  className?: string;
}

/**
 * Bauhaus Chip Component
 * 
 * Features:
 * - Clean geometric design
 * - Uppercase text with letter spacing
 * - Bauhaus color variants
 */
export function BauhausChip({
  children,
  variant = "default",
  className
}: BauhausChipProps) {
  return (
    <span
      className={cn(
        "bauhaus-chip",
        variant === "mustard" && "bauhaus-chip-mustard",
        variant === "orange" && "bauhaus-chip-orange",
        className
      )}
    >
      {children}
    </span>
  );
}

interface BauhausGridProps {
  children: ReactNode;
  columns?: 2 | 3;
  className?: string;
}

/**
 * Bauhaus Grid Component
 * 
 * Implements strong grid alignment principle
 * - Responsive design
 * - Consistent spacing
 * - Mobile-first approach
 */
export function BauhausGrid({
  children,
  columns = 3,
  className
}: BauhausGridProps) {
  return (
    <div
      className={cn(
        "bauhaus-grid",
        columns === 2 ? "bauhaus-grid-2" : "bauhaus-grid-3",
        className
      )}
    >
      {children}
    </div>
  );
}
