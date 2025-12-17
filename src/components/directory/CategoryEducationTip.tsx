"use client";

import { useState, useEffect } from "react";
import { X, Lightbulb, ShieldAlert } from "lucide-react";
import { getCategoryTip } from "@/lib/categoryEducationTips";

interface CategoryEducationTipProps {
  categorySlug?: string;
}

export function CategoryEducationTip({ categorySlug }: CategoryEducationTipProps) {
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
      className={`relative mb-8 rounded-2xl border-2 px-6 py-6 shadow-md ${
        isSafetyTip
          ? "border-amber-300 bg-amber-50"
          : "border-sky-300 bg-sky-50"
      }`}
    >
      <button
        onClick={handleDismiss}
        className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-black/5 hover:text-slate-600 transition-colors"
        aria-label="Dismiss tip"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
            isSafetyTip ? "bg-amber-100 text-amber-600" : "bg-sky-100 text-sky-600"
          }`}
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
          <p className="mt-2 text-slate-800 text-base leading-relaxed">{tip.body}</p>

          <ul className="mt-4 text-slate-800 text-sm md:text-base space-y-2">
            {tip.bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${isSafetyTip ? "bg-amber-500" : "bg-sky-500"}`} />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

