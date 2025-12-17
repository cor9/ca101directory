"use client";

import { getCategoryTip, type CategoryTip } from "@/lib/categoryTips";
import { X, Shield, BookOpen, Info } from "lucide-react";
import { useState, useEffect } from "react";

interface CategoryTipCardProps {
  category: string | null | undefined;
}

const typeConfig: Record<CategoryTip["type"], { icon: typeof Shield; color: string; label: string; iconColor: string }> = {
  safety: {
    icon: Shield,
    color: "border-rose-200 bg-rose-50/80",
    iconColor: "text-rose-600",
    label: "Safety Tip",
  },
  guide: {
    icon: BookOpen,
    color: "border-sky-200 bg-sky-50/80",
    iconColor: "text-sky-600",
    label: "Quick Guide",
  },
  info: {
    icon: Info,
    color: "border-amber-200 bg-amber-50/80",
    iconColor: "text-amber-600",
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
      className={`relative rounded-xl border-2 p-5 mb-6 shadow-sm ${config.color}`}
    >
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-black/5 transition-colors text-slate-400 hover:text-slate-600"
        aria-label="Dismiss tip"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-1.5 rounded-lg bg-white/60 ${config.iconColor}`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {config.label}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        {tip.title}
      </h3>

      {/* Content */}
      <p className="text-base text-slate-700 leading-relaxed">
        {tip.content}
      </p>
    </div>
  );
}

