import type { PrimaryCategory, ProfileKind } from "@/lib/category-taxonomy";

/**
 * Wording and behaviour of a profile depends on what kind of professional it
 * is. A talent agency is not a bookable service, a set teacher is assigned by
 * the production, and so on. Everything here is presentation only.
 */
export interface ProfileCopy {
  kind: ProfileKind;
  /** Heading of the details card */
  detailsTitle: string;
  /** Label of the main contact button when the listing may be contacted */
  ctaLabel: string;
  /** Session booking links / "Book a Session" are only for bookable services */
  allowBooking: boolean;
  /** Pricing blocks only make sense for services */
  showPricing: boolean;
  /** Optional neutral note under the details; never a promise or guarantee */
  note: string | null;
}

export function profileCopyFor(primary: PrimaryCategory | null): ProfileCopy {
  const kind: ProfileKind = primary?.kind ?? "service";
  switch (kind) {
    case "representation": {
      const isManager = primary?.slug === "talent-managers";
      return {
        kind,
        detailsTitle: isManager
          ? "Management Company Information"
          : "Agency Information",
        ctaLabel: isManager ? "Contact Management" : "Contact Agency",
        allowBooking: false,
        showPricing: false,
        note: null,
      };
    }
    case "background_casting":
      return {
        kind,
        detailsTitle: "Company Information",
        ctaLabel: "Contact",
        allowBooking: false,
        showPricing: false,
        note: "Check the company’s own website for its registration process and current needs.",
      };
    case "child_advocacy":
      return {
        kind,
        detailsTitle: "Professional Information",
        ctaLabel: "Contact",
        allowBooking: false,
        showPricing: false,
        note: null,
      };
    case "set_teacher":
      return {
        kind,
        detailsTitle: "Professional Information",
        ctaLabel: "Contact",
        allowBooking: false,
        showPricing: false,
        note: "Set teachers are hired or assigned by the production. Families may request a preferred set teacher through the production.",
      };
    default:
      return {
        kind: "service",
        detailsTitle: "Service Details",
        ctaLabel: "Book / Contact",
        allowBooking: true,
        showPricing: true,
        note: null,
      };
  }
}
