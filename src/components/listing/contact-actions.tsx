"use client";

import clsx from "clsx";
import { Globe, Mail } from "lucide-react";
import { useCallback } from "react";
import {
  getListingCapabilities,
  normalizeListingTier,
  obfuscateEmail,
  type ListingTier,
} from "@/lib/listingCapabilities";

type ContactActionsProps = {
  listingId: string;
  website?: string | null;
  email?: string | null;
  listingType?: string | null;
  /** Listing plan tier (e.g., "free", "standard", "pro") */
  plan?: string | null;
  /** Whether the listing is comped (treated as Pro) */
  comped?: boolean | null;
  variant?: "hero" | "mobile";
  className?: string;
};

// Get the primary CTA label based on tier and available contact methods
function getPrimaryCTALabel(tier: ListingTier, hasWebsite: boolean, hasEmail: boolean): string {
  if (tier === "pro" || tier === "premium") {
    return hasEmail ? "Contact" : hasWebsite ? "Visit Website" : "View Details";
  }
  if (tier === "standard") {
    return hasWebsite ? "Visit Website" : "View Details";
  }
  // Free tier
  return "View Details";
}

export function ContactActions({
  listingId,
  website,
  email,
  listingType,
  plan,
  comped,
  variant = "hero",
  className,
}: ContactActionsProps) {
  // Get tier-based capabilities for contact display
  // Gating is based on LISTING tier (what vendor pays), not viewer
  const listingTier = normalizeListingTier(plan, comped);
  const capabilities = getListingCapabilities(listingTier, {}, listingType);

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

  // Primary CTA (orange button) - tier determines what this does
  const primaryClass = clsx(
    "inline-flex items-center gap-2",
    isHero
      ? "rounded-full bg-[#FF6B35] px-6 py-2 text-sm font-semibold text-white shadow hover:bg-[#E55F2F] transition-colors"
      : "rounded-full bg-[#FF6B35] px-4 py-1.5 text-xs font-semibold text-white",
  );

  // Secondary CTA (outlined button)
  const secondaryClass = clsx(
    "inline-flex items-center gap-2",
    isHero
      ? "rounded-full border border-white/30 px-6 py-2 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
      : "rounded-full border border-white/30 px-4 py-1.5 text-xs font-semibold text-white",
  );

  // Muted text for non-clickable contact info
  const mutedClass = clsx(
    isHero
      ? "text-sm text-slate-400"
      : "text-xs text-slate-400",
  );

  // Determine what to show based on tier
  const isIndustryPro = listingType === "INDUSTRY_PRO";
  const isPro = listingTier === "pro" || listingTier === "premium";
  const isStandard = listingTier === "standard" || isPro;

  return (
    <div className={clsx("flex flex-wrap items-center gap-3", className)}>
      {/* PRIMARY CTA */}
      {isIndustryPro && website ? (
        // INDUSTRY_PRO: Primary is Visit Website
        <a
          href={website}
          target="_blank"
          rel="noreferrer"
          className={primaryClass}
          onClick={trackContact}
        >
          <Globe className="w-4 h-4" />
          Visit Website
        </a>
      ) : isIndustryPro && email ? (
        // INDUSTRY_PRO fallback: Email
        <a
          href={`mailto:${email}`}
          className={primaryClass}
          onClick={trackContact}
        >
          <Mail className="w-4 h-4" />
          Email
        </a>
      ) : isPro && email ? (
        // Pro: Primary is Contact (mailto)
        <a
          href={`mailto:${email}`}
          className={primaryClass}
          onClick={trackContact}
        >
          <Mail className="w-4 h-4" />
          Contact
        </a>
      ) : isStandard && website ? (
        // Standard: Primary is Visit Website
        <a
          href={website}
          target="_blank"
          rel="noreferrer"
          className={primaryClass}
          onClick={trackContact}
        >
          <Globe className="w-4 h-4" />
          Visit Website
        </a>
      ) : null}

      {/* SECONDARY CTA - only show if primary exists and this is different */}
      {isIndustryPro && email && website && (
        // INDUSTRY_PRO: Secondary is Email
        <a
          href={`mailto:${email}`}
          className={secondaryClass}
          onClick={trackContact}
        >
          <Mail className="w-4 h-4" />
          Email
        </a>
      )}

      {isPro && email && website && (
        <a
          href={website}
          target="_blank"
          rel="noreferrer"
          className={secondaryClass}
          onClick={trackContact}
        >
          <Globe className="w-4 h-4" />
          Website
        </a>
      )}

      {/* Non-clickable email for non-Pro tiers */}
      {email && !capabilities.canClickEmail && (
        <span className={mutedClass} title="Contact info visible to all">
          {capabilities.obfuscateEmail ? obfuscateEmail(email) : email}
        </span>
      )}
    </div>
  );
}
