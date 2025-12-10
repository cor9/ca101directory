"use client";

import clsx from "clsx";
import { useCallback } from "react";

type ContactActionsProps = {
  listingId: string;
  website?: string | null;
  email?: string | null;
  variant?: "hero" | "mobile";
  className?: string;
};

export function ContactActions({
  listingId,
  website,
  email,
  variant = "hero",
  className,
}: ContactActionsProps) {
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

  return (
    <div className={clsx("flex flex-wrap gap-3", className)}>
      {website && (
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

      {email && (
        <a
          href={`mailto:${email}`}
          className={emailClass}
          onClick={trackContact}
        >
          Email
        </a>
      )}
    </div>
  );
}
