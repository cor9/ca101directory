import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

interface SuggestVendorCTAProps {
  className?: string;
  variant?: "default" | "compact";
}

export function SuggestVendorCTA({
  className,
  variant = "default",
}: SuggestVendorCTAProps) {
  return (
    <Link
      href="/suggest-vendor"
      className={cn(
        "block p-4 rounded-xl border border-border-subtle bg-card-surface hover:bg-bg-3 transition-all hover:border-accent-teal group",
        variant === "compact" && "p-3",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="font-semibold text-base text-text-primary block">
            Know someone great?
          </span>
          <p className="text-sm text-text-secondary mt-1 group-hover:text-text-primary">
            Suggest a vendor →
          </p>
        </div>
        <ArrowRightIcon className="w-5 h-5 text-text-muted group-hover:text-accent-teal group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
      </div>
    </Link>
  );
}
