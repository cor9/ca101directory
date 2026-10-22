"use client";

import {
  type ListingTier,
  getListingCapabilities,
  normalizeListingTier,
  obfuscateEmail,
} from "@/lib/listingCapabilities";
import { safeExternalUrl } from "@/lib/url";
import clsx from "clsx";
import { Globe, Mail } from "lucide-react";
import { useCallback, useState } from "react";
import { ContactModal } from "./ContactModal";

type ContactActionsProps = {
  listingId: string;
  website?: string | null;
  email?: string | null;
  listingType?: string | null;
  /** Listing plan tier (e.g., "free", "standard", "pro") */
  plan?: string | null;
  /** Whether the listing is comped (treated as Pro) */
  comped?: boolean | null;
  variant?: "hero" | "mobile" | "profile";
  className?: string;
  /** Profile variant: data for the Book / Contact modal (real values only) */
  listingName?: string;
  imageUrl?: string;
  phone?: string | null;
  bookingUrl?: string | null;
  /** Label for the main contact button (profile variant); default "Book / Contact" */
  ctaLabel?: string;
  /** Suppress standalone website links (the modal still lists the website) */
  hideWebsiteLink?: boolean;
};

// Get the primary CTA label based on tier and available contact methods
function getPrimaryCTALabel(
  tier: ListingTier,
  hasWebsite: boolean,
  hasEmail: boolean,
): string {
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
  website: websiteRaw,
  email,
  listingType,
  plan,
  comped,
  variant = "hero",
  className,
  listingName,
  imageUrl,
  phone,
  bookingUrl,
  ctaLabel,
  hideWebsiteLink,
}: ContactActionsProps) {
  const website = safeExternalUrl(websiteRaw);
  const websiteLink = hideWebsiteLink ? null : website;
  const [modalOpen, setModalOpen] = useState(false);
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
  const isProfile = variant === "profile";

  // Primary CTA (orange button) - tier determines what this does
  const primaryClass = clsx(
    "inline-flex items-center gap-2",
    isProfile
      ? "rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#E4572E]"
      : isHero
        ? "rounded-full bg-[#FF6B35] px-6 py-2 text-sm font-semibold text-white shadow hover:bg-[#E55F2F] transition-colors"
        : "rounded-full bg-[#FF6B35] px-4 py-1.5 text-xs font-semibold text-white",
  );

  // Secondary CTA (outlined button)
  const secondaryClass = clsx(
    "inline-flex items-center gap-2",
    isProfile
      ? "rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-100"
      : isHero
        ? "rounded-full border border-white/30 px-6 py-2 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
        : "rounded-full border border-white/30 px-4 py-1.5 text-xs font-semibold text-white",
  );

  // Muted text for non-clickable contact info
  const mutedClass = clsx(
    isProfile
      ? "text-sm text-zinc-500"
      : isHero
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
      {isIndustryPro && websiteLink ? (
        // INDUSTRY_PRO: Primary is Visit Website
        <a
          href={websiteLink as string}
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
          {isProfile ? (ctaLabel ?? "Email") : "Email"}
        </a>
      ) : isPro && email && isProfile ? (
        // Pro profile: opens the contact modal (mailto alone did nothing
        // visible on machines without a mail client)
        <>
          <button
            type="button"
            className={primaryClass}
            aria-haspopup="dialog"
            aria-expanded={modalOpen}
            onClick={() => {
              trackContact();
              setModalOpen(true);
            }}
          >
            <Mail className="w-4 h-4" />
            {ctaLabel ?? "Book / Contact"}
          </button>
          <ContactModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            name={listingName || "this provider"}
            imageUrl={imageUrl}
            email={email}
            phone={phone}
            website={website}
            bookingUrl={bookingUrl}
            onAction={trackContact}
          />
        </>
      ) : isPro && email ? (
        // Pro: Primary is Contact (mailto)
        <a
          href={`mailto:${email}`}
          className={primaryClass}
          onClick={trackContact}
        >
          <Mail className="w-4 h-4" />
          {isProfile ? (ctaLabel ?? "Book / Contact") : "Contact"}
        </a>
      ) : isStandard && websiteLink ? (
        // Standard: Primary is Visit Website
        <a
          href={websiteLink as string}
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
      {isIndustryPro && email && websiteLink && (
        // INDUSTRY_PRO: Secondary is Email
        <a
          href={`mailto:${email}`}
          className={secondaryClass}
          onClick={trackContact}
        >
          <Mail className="w-4 h-4" />
          {isProfile ? (ctaLabel ?? "Email") : "Email"}
        </a>
      )}

      {isPro && email && websiteLink && (
        <a
          href={websiteLink as string}
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
      {email && !capabilities.canClickEmail && !isProfile && (
        <span className={mutedClass} title="Contact info visible to all">
          {capabilities.obfuscateEmail ? obfuscateEmail(email) : email}
        </span>
      )}
    </div>
  );
}
