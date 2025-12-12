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
        "block p-4 rounded-xl border border-accent-teal/40 bg-accent-teal/10 hover:bg-accent-teal/20 transition-all hover:border-accent-teal/60 hover:shadow-lg hover:shadow-accent-teal/20 group",
        variant === "compact" && "p-3",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="font-semibold text-base text-text-primary group-hover:text-accent-teal transition-colors block">
            Know someone great?
          </span>
          <p className="text-sm text-text-secondary mt-1 group-hover:text-text-primary">
            Suggest a vendor →
          </p>
        </div>
        <ArrowRightIcon className="w-5 h-5 text-accent-teal group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
      </div>
    </Link>
  );
}
