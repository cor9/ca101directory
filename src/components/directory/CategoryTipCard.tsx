"use client";

import { getCategoryTip, type CategoryTip } from "@/lib/categoryTips";
import { X, Shield, BookOpen, Info } from "lucide-react";
import { useState, useEffect } from "react";

interface CategoryTipCardProps {
  category: string | null | undefined;
}

const typeConfig: Record<CategoryTip["type"], { icon: typeof Shield; color: string; label: string; iconColor: string; bgIcon: string }> = {
  safety: {
    icon: Shield,
    color: "border-rose-200/60 bg-rose-50/70",
    iconColor: "text-rose-600",
    bgIcon: "bg-rose-100",
    label: "Safety Tip",
  },
  guide: {
    icon: BookOpen,
    color: "border-sky-200/60 bg-sky-50/70",
    iconColor: "text-sky-600",
    bgIcon: "bg-sky-100",
    label: "Quick Guide",
  },
  info: {
    icon: Info,
    color: "border-amber-200/60 bg-amber-50/70",
    iconColor: "text-amber-600",
    bgIcon: "bg-amber-100",
    label: "Good to Know",
  },
};

function getStorageKey(category: string): string {
  return `tip-dismissed-${category.toLowerCase().replace(/\s+/g, "-")}`;
}

export function CategoryTipCard({ category }: CategoryTipCardProps) {
  const [dismissed, setDismissed] = useState(true); // Start hidden to avoid flash
  const tip = getCategoryTip(category);

  useEffect(() => {
    if (!category || !tip) return;
    const key = getStorageKey(category);
    const isDismissed = localStorage.getItem(key) === "true";
    setDismissed(isDismissed);
  }, [category, tip]);

  if (!tip || dismissed) return null;

  const config = typeConfig[tip.type];
  const Icon = config.icon;

  const handleDismiss = () => {
    if (!category) return;
    const key = getStorageKey(category);
    localStorage.setItem(key, "true");
    setDismissed(true);
  };

  return (
    <div
      className={`relative rounded-2xl border px-6 py-5 mb-6 shadow-sm ${config.color}`}
    >
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/5 transition-colors text-slate-400 hover:text-slate-600"
        aria-label="Dismiss tip"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Header */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className={`p-2 rounded-lg ${config.bgIcon} ${config.iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {config.label}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-slate-900 font-semibold text-base md:text-lg mb-2">
        {tip.title}
      </h3>

      {/* Content */}
      <p className="text-slate-700 text-sm md:text-base leading-relaxed">
        {tip.content}
      </p>
    </div>
  );
}

