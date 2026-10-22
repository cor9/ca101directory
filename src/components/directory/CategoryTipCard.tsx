"use client";

import { type CategoryTip, getCategoryTip } from "@/lib/categoryTips";
import { BookOpen, Info, Shield, X } from "lucide-react";
import { useEffect, useState } from "react";

interface CategoryTipCardProps {
  category: string | null | undefined;
}

const typeConfig: Record<
  CategoryTip["type"],
  {
    icon: typeof Shield;
    color: string;
    label: string;
    iconColor: string;
    bgIcon: string;
  }
> = {
  safety: {
    icon: Shield,
    color: "border-zinc-200 bg-white shadow-sm",
    iconColor: "text-zinc-700",
    bgIcon: "bg-zinc-100",
    label: "Safety Tip",
  },
  guide: {
    icon: BookOpen,
    color: "border-zinc-200 bg-white shadow-sm",
    iconColor: "text-zinc-700",
    bgIcon: "bg-zinc-100",
    label: "Quick Guide",
  },
  info: {
    icon: Info,
    color: "border-zinc-200 bg-white shadow-sm",
    iconColor: "text-zinc-700",
    bgIcon: "bg-zinc-100",
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
        className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/5 transition-colors text-zinc-500 hover:text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
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
