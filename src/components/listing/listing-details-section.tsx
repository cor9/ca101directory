import { RichTextDisplay } from "@/components/ui/rich-text-display";
import SocialMediaIcons from "@/components/ui/social-media-icons";
import type { Listing } from "@/data/listings";

interface ListingDetailsSectionProps {
  listing: Listing;
  hasPremiumAccess: boolean;
}

export function ListingDetailsSection({
  listing,
  hasPremiumAccess,
}: ListingDetailsSectionProps) {
  const primaryHeadingClass =
    "bauhaus-heading text-2xl font-semibold text-[var(--charcoal)]";
  const secondaryHeadingClass =
    "bauhaus-heading text-xl font-semibold text-[var(--charcoal)]";
  const subHeadingClass =
    "bauhaus-heading text-lg font-semibold text-[var(--charcoal)] normal-case";
  const ageRanges = (listing.age_range || [])
    .map((age) => (age || "").trim())
    .filter((age) => {
      if (!age) return false;
      if (age.includes("Age Range")) return false;
      if (age.includes("los-angeles")) return false;
      if (age.includes("hybrid")) return false;
      const uuidLike =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      return !uuidLike.test(age);
    });

  const hasCertifications =
    listing.ca_permit_required === true || listing.is_bonded === true;

  return (
    <section className="flex flex-col gap-6">
      <div className="listing-card">
        <h2 className={primaryHeadingClass}>About This Professional</h2>
        <div className="mt-4 space-y-6">
          <RichTextDisplay
            content={listing.what_you_offer || ""}
            className="text-base leading-relaxed"
          />

          {hasPremiumAccess && listing.why_is_it_unique && (
            <div>
              <h3 className={subHeadingClass}>What Makes This Unique</h3>
              <RichTextDisplay
                content={listing.why_is_it_unique}
                className="text-base leading-relaxed"
              />
            </div>
          )}

          {hasPremiumAccess && listing.format && (
            <div>
              <h3 className={subHeadingClass}>Service Format</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {(() => {
                  // Parse format from string to array
                  const formatStr = listing.format || "";
                  const formatArray = formatStr.includes(",")
                    ? formatStr
                        .split(",")
                        .map((f) => f.trim())
                        .filter(Boolean)
                    : [formatStr].filter(Boolean);

                  return formatArray.length > 0 ? (
                    formatArray.map((format) => (
                      <span key={format} className="badge blue capitalize">
                        {format.toLowerCase().replace("-", " ")}
                      </span>
                    ))
                  ) : (
                    <span className="text-[var(--ink)] opacity-80">
                      No service format specified
                    </span>
                  );
                })()}
              </div>
            </div>
          )}

          {hasPremiumAccess && listing.extras_notes && (
            <div>
              <h3 className={subHeadingClass}>Additional Notes</h3>
              <RichTextDisplay
                content={listing.extras_notes}
                className="text-base leading-relaxed"
              />
            </div>
          )}
        </div>
      </div>

      <div className="listing-card-red">
        <h2 className="bauhaus-heading text-xl font-semibold text-[var(--ink)]">
          Age Range
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {ageRanges.length > 0 ? (
            ageRanges.map((age) => (
              <span key={age} className="badge blue">
                {age}
              </span>
            ))
          ) : (
            <span className="text-[var(--ink)] opacity-80">
              No age range specified
            </span>
          )}
        </div>
      </div>

      {hasCertifications && (
        <div className="listing-card">
          <h2 className={secondaryHeadingClass}>
            Certifications &amp; Compliance
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-[var(--navy)]">
            {listing.ca_permit_required === true && (
              <li className="flex items-center gap-2">
                <span aria-hidden className="text-[var(--success)]">
                  ✓
                </span>
                <span>California Child Performer Services Permit</span>
              </li>
            )}
            {listing.is_bonded === true && (
              <li className="flex items-center gap-2">
                <span aria-hidden className="text-[var(--success)]">
                  ✓
                </span>
                <span>
                  Bonded for Advanced Fees
                  {listing.bond_number ? ` (Bond #${listing.bond_number})` : ""}
                </span>
              </li>
            )}
          </ul>
        </div>
      )}

      <SocialMediaIcons listing={listing} className="listing-card-blue" />
    </section>
  );
}
