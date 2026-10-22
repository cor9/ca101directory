import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

/**
 * Progress through adding a listing. A Free listing never involves payment, so
 * it reads Details → Review → Publish; "Payment" appears only when the chosen
 * plan actually requires one. Presentation only: the workflow is unchanged.
 */
export function ListingProgress({
  step = 1,
  requiresPayment = false,
}: {
  step?: 1 | 2 | 3;
  requiresPayment?: boolean;
}) {
  const steps = ["Details", requiresPayment ? "Payment" : "Review", "Publish"];
  return (
    <nav aria-label="Progress" className="!border-0 !bg-transparent !p-0 !shadow-none">
      <ol className="flex items-center">
        {steps.map((label, i) => {
          const n = i + 1;
          const done = n < step;
          const active = n === step;
          return (
            <li
              key={label}
              aria-current={active ? "step" : undefined}
              className={cn("flex items-center", i < steps.length - 1 && "flex-1")}
            >
              <span className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                    active
                      ? "bg-ink text-white"
                      : done
                        ? "bg-brass text-ink"
                        : "border border-zinc-400 bg-white text-ink-soft",
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : n}
                </span>
                <span
                  className={cn(
                    "text-sm font-semibold",
                    active ? "text-ink" : "text-ink-soft",
                  )}
                >
                  {label}
                  {active && <span className="sr-only"> (current step)</span>}
                </span>
              </span>
              {i < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="mx-4 h-px flex-1 bg-zinc-300"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
