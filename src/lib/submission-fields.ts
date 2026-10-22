import { primariesForListing } from "@/lib/category-taxonomy";

/**
 * Which questions a listing form should ask depends on WHAT is being listed.
 * A talent agency or a set teacher is not a bookable service, so it is never
 * asked for a "service format". Shared by the client form (what to show) and
 * the server action (what to require) so they cannot drift apart.
 */
export type SubmissionMode = "none" | "service" | "representation" | "resource";

export interface SubmissionProfile {
  mode: SubmissionMode;
  /** Ask for (and require) a service format */
  requireFormat: boolean;
  /** Require at least one broad region */
  requireRegion: boolean;
  /** Offer the age-range checkboxes */
  showAges: boolean;
  nameLabel: string;
  namePlaceholder: string;
  descriptionLabel: string;
  descriptionHelp: string;
  descriptionPlaceholder: string;
  /** Heading above the picker's specialty list */
  specialtyLabel: string;
  /** Set teachers / sitters: coverage by city matters most */
  emphasizeCoverage: boolean;
  /** California licensing questions can apply (still optional) */
  licensingMayApply: boolean;
}

const SLUG_COPY: Record<string, Partial<SubmissionProfile>> = {
  "talent-agents": {
    descriptionLabel: "About Your Agency",
    descriptionHelp:
      "Describe your agency: the types of talent you represent and the markets you work in.",
    descriptionPlaceholder:
      "Example: 'Boutique youth agency representing children and teens for commercial and theatrical work.'",
  },
  "influencer-agents": {
    descriptionLabel: "About Your Agency",
    descriptionHelp: "Describe your agency and the creators you represent.",
    descriptionPlaceholder:
      "Example: 'Agency representing young creators for brand partnerships.'",
  },
  "talent-managers": {
    descriptionLabel: "About Your Management Company",
    descriptionHelp:
      "Describe your management company and how you work with young talent and their families.",
    descriptionPlaceholder:
      "Example: 'Management company guiding young actors’ careers in film and television.'",
  },
  "background-casting": {
    descriptionLabel: "Company Information",
    descriptionHelp:
      "Describe the company and how performers can register with it, if you take registrations.",
    descriptionPlaceholder:
      "Example: 'Background casting company for film and TV productions in Georgia.'",
  },
  "child-advocacy": {
    descriptionLabel: "Professional Information",
    descriptionHelp:
      "Describe your role and how you support young performers and their families.",
    descriptionPlaceholder:
      "Example: 'Advocate supporting child performers’ wellbeing and rights on set.'",
  },
  "set-teachers": {
    descriptionLabel: "Professional Information",
    descriptionHelp:
      "Describe your credentials and experience teaching on set. Set teachers are hired or assigned by productions.",
    descriptionPlaceholder:
      "Example: 'Credentialed studio teacher with ten years’ experience on film and TV sets.'",
  },
};

const BASE: SubmissionProfile = {
  mode: "none",
  requireFormat: false,
  requireRegion: false,
  showAges: false,
  nameLabel: "Name",
  namePlaceholder: "Name of your business or professional listing",
  descriptionLabel: "Description",
  descriptionHelp: "Choose a category first so we can ask the right questions.",
  descriptionPlaceholder: "Describe your listing",
  specialtyLabel: "Specialties",
  emphasizeCoverage: false,
  licensingMayApply: false,
};

/** Accepts stored values (names, spelling variants or legacy UUIDs). */
export function submissionProfile(
  categories: ReadonlyArray<string>,
): SubmissionProfile {
  const primaries = primariesForListing({ categories });
  if (primaries.length === 0) return BASE;

  const has = (section: string) => primaries.some((p) => p.section === section);
  const mode: SubmissionMode = has("services")
    ? "service"
    : has("representation")
      ? "representation"
      : "resource";

  if (mode === "service") {
    return {
      ...BASE,
      mode,
      requireFormat: true,
      requireRegion: true,
      showAges: true,
      nameLabel: "Business or Professional Name",
      namePlaceholder: "e.g., Bright Lights Talent Coaching",
      descriptionLabel: "What You Offer",
      descriptionHelp:
        "List your signature services and what makes them valuable. Aim for one clear sentence with an outcome.",
      descriptionPlaceholder:
        "Example: 'Audition coaching and on-camera classes for young performers in LA.'",
      emphasizeCoverage: primaries.some((p) => p.slug === "set-sitters"),
      licensingMayApply: true,
    };
  }

  // Non-service listings: labels come from the first selected primary
  const first = primaries.find((p) => p.section === (mode as string)) ?? primaries[0];
  const copy = SLUG_COPY[first.slug] ?? {};
  const mixedReps = primaries.filter((p) => p.section === "representation");
  const repLabel =
    mixedReps.length > 1 &&
    mixedReps.some((p) => p.slug === "talent-managers") &&
    mixedReps.some((p) => p.slug !== "talent-managers")
      ? "About Your Agency / Management Company"
      : undefined;

  return {
    ...BASE,
    mode,
    showAges: mode === "representation",
    nameLabel:
      mode === "representation" ? "Agency or Company Name" : "Name",
    namePlaceholder:
      mode === "representation"
        ? "e.g., Bright Lights Talent"
        : "Name of your company or professional listing",
    specialtyLabel: mode === "representation" ? "Representation type" : "Specialties",
    emphasizeCoverage: primaries.some((p) => p.slug === "set-teachers"),
    ...copy,
    ...(repLabel ? { descriptionLabel: repLabel } : {}),
  };
}

/** The listing's state is California (abbreviation or name). */
export const isCaliforniaState = (state?: string | null): boolean => {
  const s = (state || "").trim().toLowerCase().replace(/\./g, "");
  return s === "ca" || s === "california";
};

/**
 * Show the optional California licensing questions only when they can apply:
 * a service provider based in California, or a listing that already stored
 * an answer (never hide data an owner entered earlier).
 */
export function showLicensing(opts: {
  profile: SubmissionProfile;
  state?: string | null;
  hasExistingAnswer?: boolean;
}): boolean {
  if (opts.hasExistingAnswer) return true;
  return opts.profile.licensingMayApply && isCaliforniaState(opts.state);
}

/** Cleaned extra service areas (city/state pairs) for `secondary_locations`. */
export function cleanServiceAreas(
  rows: ReadonlyArray<{ city?: string; state?: string; zip?: string }> | null | undefined,
  max = 15,
): Array<{ city: string; state: string; zip: string }> {
  const seen = new Set<string>();
  const out: Array<{ city: string; state: string; zip: string }> = [];
  for (const r of rows || []) {
    const city = (r?.city || "").trim().slice(0, 80);
    const state = (r?.state || "").trim().slice(0, 40);
    if (!city || !state) continue;
    const key = `${city.toLowerCase()}|${state.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ city, state, zip: (r?.zip || "").trim().slice(0, 10) });
    if (out.length >= max) break;
  }
  return out;
}

/**
 * Category-aware required fields. Only service categories must give a service
 * format and a broad region; everything else is optional for them.
 */
export function categoryRequirementErrors(
  profile: SubmissionProfile,
  values: { format?: string | ReadonlyArray<string> | null; region?: ReadonlyArray<string> | null },
): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  const hasFormat = Array.isArray(values.format)
    ? values.format.length > 0
    : Boolean(values.format);
  if (profile.requireFormat && !hasFormat) {
    errors.format = ["Please select at least one service format"];
  }
  if (profile.requireRegion && (values.region || []).length === 0) {
    errors.region = ["Please select at least one region"];
  }
  return errors;
}
