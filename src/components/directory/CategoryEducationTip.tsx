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
      className={`relative mb-6 rounded-xl border p-4 shadow-sm ${
        isSafetyTip
          ? "border-amber-200 bg-amber-50"
          : "border-blue-200 bg-blue-50"
      }`}
    >
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-3 rounded-full p-1 text-slate-400 hover:bg-white hover:text-slate-600"
        aria-label="Dismiss tip"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex gap-3">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
            isSafetyTip ? "bg-amber-200 text-amber-700" : "bg-blue-200 text-blue-700"
          }`}
        >
          {isSafetyTip ? (
            <ShieldAlert className="h-4 w-4" />
          ) : (
            <Lightbulb className="h-4 w-4" />
          )}
        </div>

        <div className="flex-1 pr-6">
          <h3
            className={`text-sm font-semibold ${
              isSafetyTip ? "text-amber-800" : "text-blue-800"
            }`}
          >
            {tip.title}
          </h3>
          <p className="mt-1 text-sm text-slate-700">{tip.body}</p>

          <ul className="mt-3 space-y-1.5">
            {tip.bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                <span
                  className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${
                    isSafetyTip ? "bg-amber-400" : "bg-blue-400"
                  }`}
                />
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

