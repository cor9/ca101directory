"use client";

import clsx from "clsx";
import { useCallback } from "react";
import {
  getListingCapabilities,
  normalizeListingTier,
  obfuscateEmail,
} from "@/lib/listingCapabilities";

type ContactActionsProps = {
  listingId: string;
  website?: string | null;
  email?: string | null;
  /** Listing plan tier (e.g., "free", "standard", "pro") */
  plan?: string | null;
  /** Whether the listing is comped (treated as Pro) */
  comped?: boolean | null;
  variant?: "hero" | "mobile";
  className?: string;
};

export function ContactActions({
  listingId,
  website,
  email,
  plan,
  comped,
  variant = "hero",
  className,
}: ContactActionsProps) {
  // Get tier-based capabilities for contact display
  // Gating is based on LISTING tier (what vendor pays), not viewer
  const listingTier = normalizeListingTier(plan, comped);
  const capabilities = getListingCapabilities(listingTier);

  const trackContact = useCallback(() => {
    void fetch("/api/listing/track-contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId }),
    }).catch((error) => {
      console.error("[contact-actions] trackContact error", error);
    });
  }, [listingId]);

  const isHero = variant === "hero";

  const websiteClass = clsx(
    isHero
      ? "rounded-full bg-[#FF6B35] px-6 py-2 text-sm font-semibold text-white shadow hover:bg-[#E55F2F]"
      : "rounded-full bg-[#FF6B35] px-3 py-1 text-xs font-semibold text-white",
  );

  const emailClass = clsx(
    isHero
      ? "rounded-full border border-slate-300 px-6 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-800"
      : "rounded-full border border-slate-500 px-3 py-1 text-xs font-semibold text-white",
  );

  const disabledClass = clsx(
    isHero
      ? "rounded-full border border-slate-500 px-6 py-2 text-sm font-semibold text-slate-400 cursor-default"
      : "rounded-full border border-slate-600 px-3 py-1 text-xs font-semibold text-slate-400 cursor-default",
  );

  return (
    <div className={clsx("flex flex-wrap gap-3", className)}>
      {website && capabilities.canClickWebsite && (
        <a
          href={website}
          target="_blank"
          rel="noreferrer"
          className={websiteClass}
          onClick={trackContact}
        >
          Visit Website
        </a>
      )}

      {email && capabilities.canClickEmail && (
        <a
          href={`mailto:${email}`}
          className={emailClass}
          onClick={trackContact}
        >
          Email
        </a>
      )}

      {/* Show non-clickable email for non-Pro tiers */}
      {email && !capabilities.canClickEmail && (
        <span className={disabledClass} title="Upgrade to Pro to contact directly">
          {capabilities.obfuscateEmail ? obfuscateEmail(email) : email}
        </span>
      )}
    </div>
  );
}
