"use client";

import { getCategoryTip } from "@/lib/categoryEducationTips";
import { Lightbulb, ShieldAlert, X } from "lucide-react";
import { useEffect, useState } from "react";

interface CategoryEducationTipProps {
  categorySlug?: string;
}

export function CategoryEducationTip({
  categorySlug,
}: CategoryEducationTipProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const tip = getCategoryTip(categorySlug);
  const storageKey = `tip-dismissed-${categorySlug}`;

  useEffect(() => {
    setIsHydrated(true);
    if (typeof window !== "undefined") {
      const dismissed = localStorage.getItem(storageKey);
      if (dismissed === "true") {
        setIsDismissed(true);
      }
    }
  }, [storageKey]);

  if (!tip || isDismissed || !isHydrated) return null;

  const isSafetyTip = tip.title.toLowerCase().includes("safety");

  const handleDismiss = () => {
    setIsDismissed(true);
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, "true");
    }
  };

  return (
    <div
      className={`relative mb-8 rounded-2xl border border-zinc-200 bg-white px-6 py-6 shadow-sm ${
        isSafetyTip ? "border-l-4 border-l-amber-500" : ""
      }`}
    >
      <button
        onClick={handleDismiss}
        className="absolute right-4 top-4 rounded-full p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] transition-colors"
        aria-label="Dismiss tip"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700"
        >
          {isSafetyTip ? (
            <ShieldAlert className="h-5 w-5" />
          ) : (
            <Lightbulb className="h-5 w-5" />
          )}
        </div>

        <div className="flex-1 pr-6">
          <h3 className="text-slate-900 font-bold text-lg md:text-xl">
            {tip.title}
          </h3>
          <p className="mt-2 text-slate-800 text-base leading-relaxed">
            {tip.body}
          </p>

          <ul className="mt-4 text-slate-800 text-sm md:text-base space-y-2">
            {tip.bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-2">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-500"
                />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
