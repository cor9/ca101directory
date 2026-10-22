"use client";

import { cn } from "@/lib/utils";
import { CheckCircle, Info } from "lucide-react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

interface ProfileVerifiedBadgeProps {
  profileVerifiedAt?: string | null;
  className?: string;
}

export const VERIFIED_BUSINESS_TOOLTIP =
  "Verified Business means the owner of this business has completed ownership verification with Child Actor 101. It confirms who manages this listing. It is not an endorsement and says nothing about the quality of their services.";

function formatVerifiedDate(dateString: string): string | null {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/**
 * Public "Verified Business" badge. Render it only when the business owner has
 * completed ownership verification (listing.profile_verified). Works with
 * hover, keyboard focus and tap; Escape or an outside tap closes the tooltip.
 */
export function ProfileVerifiedBadge({
  profileVerifiedAt,
  className,
}: ProfileVerifiedBadgeProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLSpanElement>(null);
  const tipId = useId();
  // Horizontal nudge so the tooltip never runs off a narrow screen
  const [shift, setShift] = useState(0);

  useLayoutEffect(() => {
    if (!open || !tipRef.current) return;
    const el = tipRef.current;
    el.style.transform = "translateX(0px)";
    const r = el.getBoundingClientRect();
    const margin = 12;
    let dx = 0;
    if (r.right > window.innerWidth - margin)
      dx = window.innerWidth - margin - r.right;
    if (r.left + dx < margin) dx = margin - r.left;
    setShift(dx);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const date = profileVerifiedAt ? formatVerifiedDate(profileVerifiedAt) : null;

  return (
    <span
      ref={wrapRef}
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-describedby={open ? tipId : undefined}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-emerald-700 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2",
          className,
        )}
      >
        <CheckCircle className="h-3.5 w-3.5" aria-hidden="true" />
        Verified Business
        <Info className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
      </button>

      {open && (
        <span
          id={tipId}
          ref={tipRef}
          role="tooltip"
          style={{ transform: `translateX(${shift}px)` }}
          className="absolute left-0 top-full z-50 mt-2 w-72 max-w-[calc(100vw-1.5rem)] rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-left text-xs font-normal leading-relaxed text-zinc-100 shadow-lg"
        >
          {VERIFIED_BUSINESS_TOOLTIP}
          {date && (
            <span className="mt-2 block border-t border-white/15 pt-2 font-semibold text-white">
              Verified: {date}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
