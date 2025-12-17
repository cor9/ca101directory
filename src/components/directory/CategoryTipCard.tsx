"use client";

import { getCategoryTip, type CategoryTip } from "@/lib/categoryTips";
import { X, Shield, BookOpen, Info } from "lucide-react";
import { useState, useEffect } from "react";

interface CategoryTipCardProps {
  category: string | null | undefined;
}

const typeConfig: Record<CategoryTip["type"], { icon: typeof Shield; color: string; label: string }> = {
  safety: {
    icon: Shield,
    color: "border-red-500/30 bg-red-500/10",
    label: "Safety Tip",
  },
  guide: {
    icon: BookOpen,
    color: "border-blue-500/30 bg-blue-500/10",
    label: "Quick Guide",
  },
  info: {
    icon: Info,
    color: "border-amber-500/30 bg-amber-500/10",
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
      className={`relative rounded-xl border p-4 mb-6 ${config.color}`}
    >
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/10 transition-colors text-text-muted hover:text-text-primary"
        aria-label="Dismiss tip"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-text-secondary" />
        <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
          {config.label}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-text-primary mb-2">
        {tip.title}
      </h3>

      {/* Content */}
      <p className="text-sm text-text-secondary leading-relaxed">
        {tip.content}
      </p>
    </div>
  );
}

