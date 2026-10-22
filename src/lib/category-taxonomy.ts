/**
 * Category taxonomy: the single source of truth for the Directory's 13 primary
 * categories and how they relate to the legacy category records.
 *
 * NON-DESTRUCTIVE COMPATIBILITY LAYER. No database record, association or
 * schema is changed. Listings keep whatever is stored today
 * (`listings.categories` is a text[] holding legacy category NAMES, plus the
 * occasional category UUID). This module maps those stored values to the new
 * primary categories at read time, and new selections are saved through the
 * same existing columns (`categories` = category names, `specialties` = tags).
 *
 * Verified against the live schema (see docs/category-consolidation-report.md):
 *  - categories.id (uuid), categories.category_name (text), categories.hidden
 *  - listings.categories text[]   (names; 1 of 1,042 live rows holds a UUID)
 *  - listings.specialties text[], listings.services_offered text[]
 *  - listings.primary_category_id uuid (set on 1 live listing)
 */

export type SectionId = "services" | "representation" | "resources";

/** How a profile should talk about the professional (see profile-kind helpers). */
export type ProfileKind =
  | "service" // bookable service (training, photography, reels, ...)
  | "representation" // agents / managers
  | "background_casting"
  | "child_advocacy"
  | "set_teacher";

export interface PrimaryCategory {
  slug: string;
  name: string;
  section: SectionId;
  kind: ProfileKind;
  /** One line for discovery cards (plain, no booking language for non-services) */
  blurb: string;
  /** Every stored spelling of the legacy categories that roll up here */
  legacyNames: string[];
  /** UUIDs of those legacy rows in the `categories` table */
  legacyIds: string[];
  /** Specialty tags a professional in this category may select */
  specialties: string[];
  /**
   * Legacy category name -> specialty it directly implies. Only categories whose
   * name unambiguously states the specialty appear here.
   */
  derive: Record<string, string>;
}

export interface Section {
  id: SectionId;
  title: string;
  /** Short explanation of how families use these listings */
  description: string;
}

export const SECTIONS: Section[] = [
  {
    id: "services",
    title: "Services & Training",
    description:
      "Businesses and professionals offering services families may purchase.",
  },
  {
    id: "representation",
    title: "Talent Representation",
    description:
      "Agencies and managers who represent young talent. Representation is not a service you purchase.",
  },
  {
    id: "resources",
    title: "Industry & On-Set Resources",
    description:
      "Research professionals and companies, find them by location, and read parent reviews.",
  },
];

export const PRIMARY_CATEGORIES: PrimaryCategory[] = [
  /* ------------------------------ Services ------------------------------ */
  {
    slug: "headshot-photographers",
    name: "Headshot Photographers",
    section: "services",
    kind: "service",
    blurb: "Portfolio-led photographers who specialize in kids and teens.",
    legacyNames: ["Headshot Photographers", "Headshot Photographer"],
    legacyIds: ["e00fab44-e4ab-4834-966c-5058ac1af655"],
    specialties: [
      "Studio Headshots",
      "Natural Light",
      "Outdoor Sessions",
      "Character Looks",
      "Hair & Makeup",
      "Youth Headshots",
    ],
    derive: {},
  },
  {
    slug: "acting-training",
    name: "Acting Training",
    section: "services",
    kind: "service",
    blurb: "Classes, private coaching and training for young actors.",
    legacyNames: [
      "Acting Classes & Coaches",
      "Acting Coach",
      "Acting School/Coach",
      "Acting School",
      "Acting Schools",
      "Audition Prep",
      "Improv Classes",
      "Theatre Training",
      "Voiceover Support",
      "Vocal Coaches",
      "Dialect Coach",
    ],
    legacyIds: [
      "c0b8d6a5-436a-4004-b6b6-8b58a9f5b3d2", // Acting Classes & Coaches
      "10159a59-61f7-4375-8770-141b6ddc878f", // Acting Schools
      "e4770486-0c03-4263-8d0b-99c11598ddbf", // Audition Prep
      "c5236852-82be-48df-8762-85c2b18f0d76", // Improv Classes
      "1f3ec0a8-f2b8-41c4-b5fd-c7b78c266629", // Theatre Training
      "d4135f3b-1f60-4486-a625-074e8b4253ce", // Voiceover Support
      "0a568d20-66cc-45a9-819d-3bb81853fc82", // Vocal Coaches
      "13a2c7ab-2036-4d0e-873c-4f8520e2aa29", // Dialect Coach
    ],
    specialties: [
      "Audition Coaching",
      "Improv",
      "Scene Study",
      "On-Camera Acting",
      "Voiceover Training",
      "Vocal Training",
      "Dialect Coaching",
      "Theatre Training",
      "Online Classes",
      "In-Person Classes",
      "Private Coaching",
      "Group Classes",
      // tags already offered by the previous edit form; kept so no one loses them
      "Pre-Readers",
      "Memorization",
    ],
    derive: {
      "Audition Prep": "Audition Coaching",
      "Improv Classes": "Improv",
      "Dialect Coach": "Dialect Coaching",
      "Vocal Coaches": "Vocal Training",
      "Voiceover Support": "Voiceover Training",
      "Theatre Training": "Theatre Training",
    },
  },
  {
    slug: "career-coaching-consulting",
    name: "Career Coaching & Consulting",
    section: "services",
    kind: "service",
    blurb: "Career strategy, branding and guidance for families.",
    legacyNames: ["Career Consulting", "Branding Coaches", "Business of Acting"],
    legacyIds: [
      "54d02e9e-e984-4de0-97df-28fde1d18344", // Career Consulting
      "c5ab8f4a-46a7-4228-96f7-3dc794144df0", // Branding Coaches
      "7992d99a-6491-406e-b845-cfdb0986331d", // Business of Acting
    ],
    specialties: [
      "Career Strategy",
      "Personal Branding",
      "Business of Acting",
      "Parent Consultations",
      "Industry Guidance",
    ],
    derive: {
      "Career Consulting": "Career Strategy",
      "Branding Coaches": "Personal Branding",
      "Business of Acting": "Business of Acting",
    },
  },
  {
    slug: "demo-reels-editing",
    name: "Demo Reels & Editing",
    section: "services",
    kind: "service",
    blurb: "Demo reel production, filming and editing.",
    legacyNames: ["Demo Reel Creators", "Reel Editors", "Demo Reel Editors"],
    legacyIds: [
      "fb081d92-f853-47b2-809c-8e99c380b31a", // Demo Reel Creators
      "3a04d4a2-736f-4f67-abb9-5f3cf917c536", // Reel Editors
    ],
    specialties: [
      "Demo Reel Production",
      "Scene Filming",
      "Reel Editing",
      "Reel Updates",
      "Video Production",
    ],
    derive: {
      "Demo Reel Creators": "Demo Reel Production",
      "Reel Editors": "Reel Editing",
      "Demo Reel Editors": "Reel Editing",
    },
  },
  {
    slug: "actor-marketing-services",
    name: "Actor Marketing Services",
    section: "services",
    kind: "service",
    blurb: "Publicity, actor websites, styling and marketing materials.",
    legacyNames: ["Publicists", "Actor Websites", "Stylists"],
    legacyIds: [
      "d0bf79f8-5c44-4a8e-9867-45f79fae887c", // Publicists
      "a84faa6e-3deb-44c6-b415-051f73268d10", // Actor Websites
      "7a6327b8-3de1-4c68-93ad-8927477cb9b3", // Stylists
    ],
    specialties: [
      "Public Relations",
      "Actor Websites",
      "Website Design",
      "Wardrobe Styling",
      "Personal Styling",
      "Marketing Materials",
    ],
    derive: {
      Publicists: "Public Relations",
      "Actor Websites": "Actor Websites",
      // "Stylists" is ambiguous between wardrobe and personal styling.
      // "Personal Styling" is used and flagged in the report for review.
      Stylists: "Personal Styling",
    },
  },
  {
    slug: "self-tape-services",
    name: "Self-Tape Services",
    section: "services",
    kind: "service",
    blurb: "Self-tape studios, readers, feedback and audition recording.",
    legacyNames: [
      "Self-Tape Support",
      "Self Tape Support",
      "Self-Tape Services",
      "Self Tape Services",
    ],
    legacyIds: ["dff32333-23be-4cbc-86e6-9bde617e2ddd"], // Self-Tape Support
    specialties: [
      "Self-Tape Studio",
      "Professional Reader",
      "Self-Tape Feedback",
      "Audition Recording",
    ],
    // The legacy category covers studios, readers and feedback without saying
    // which, so nothing is derived: owners select theirs explicitly.
    derive: {},
  },
  {
    slug: "set-sitters",
    name: "Set Sitters",
    section: "services",
    kind: "service",
    blurb: "Set sitters families can arrange for on-set care.",
    legacyNames: ["Set Sitters"],
    legacyIds: ["27c206de-8539-44d7-8e7c-ff14c99bec3e"],
    specialties: [],
    derive: {},
  },
  /* ------------------------- Talent representation ---------------------- */
  {
    slug: "talent-agents",
    name: "Talent Agents",
    section: "representation",
    kind: "representation",
    blurb: "Agencies that represent young talent.",
    legacyNames: ["Talent Agents"],
    legacyIds: ["78b32c61-a10e-478f-a464-a84ad9eaa075"],
    specialties: [],
    derive: {},
  },
  {
    slug: "talent-managers",
    name: "Talent Managers",
    section: "representation",
    kind: "representation",
    blurb: "Management companies that guide young talent.",
    legacyNames: ["Talent Managers"],
    legacyIds: ["472f7c28-e5cf-405e-82bd-f55b93407ae9"],
    specialties: [],
    derive: {},
  },
  {
    slug: "influencer-agents",
    name: "Influencer Agents",
    section: "representation",
    kind: "representation",
    blurb: "Agents who represent young creators and influencers.",
    legacyNames: ["Influencer Agents"],
    legacyIds: ["22ffa1e8-394c-41c9-8f68-7e82d8656229"],
    specialties: [],
    derive: {},
  },
  /* --------------------- Industry & on-set resources -------------------- */
  {
    slug: "background-casting",
    name: "Background Casting",
    section: "resources",
    kind: "background_casting",
    blurb: "Background casting companies to research and register with.",
    legacyNames: ["Background Casting"],
    legacyIds: ["7019a3fc-ad32-43ff-9dc8-66cba7e15bb6"],
    specialties: [],
    derive: {},
  },
  {
    slug: "child-advocacy",
    name: "Child Advocacy",
    section: "resources",
    kind: "child_advocacy",
    blurb: "Professionals and organizations that advocate for young performers.",
    legacyNames: ["Child Advocacy"],
    legacyIds: ["573b762c-7c7a-44ab-8a33-f2caddb5e018"],
    specialties: [],
    derive: {},
  },
  {
    slug: "set-teachers",
    name: "Set Teachers",
    section: "resources",
    kind: "set_teacher",
    blurb: "Find set teachers by location and read reviews from other families.",
    legacyNames: ["Set Teachers"],
    legacyIds: ["bb4d85d6-334e-4bbe-848c-4948b42b6511"],
    specialties: [],
    derive: {},
  },
];

/**
 * Categories retired from public navigation and from new-listing selection.
 * Their listings are NOT deleted, hidden or reassigned: the listing pages keep
 * working, general search still finds them, and the category URL still renders
 * (without being promoted or indexed).
 */
export interface RetiredCategory {
  slug: string;
  name: string;
  legacyNames: string[];
  legacyIds: string[];
}

export const RETIRED_CATEGORIES: RetiredCategory[] = [
  {
    slug: "talent-showcases",
    name: "Talent Showcases",
    legacyNames: ["Talent Showcases"],
    legacyIds: ["ca25586e-8cb2-40db-a06b-f6570a8952f9"],
  },
  {
    slug: "mental-health-for-performers",
    name: "Mental Health for Performers",
    legacyNames: ["Mental Health for Performers"],
    legacyIds: ["a1f986a0-67ae-4d64-a725-2a936e928b5f"],
  },
  {
    slug: "casting-workshops",
    name: "Casting Workshops",
    legacyNames: ["Casting Workshops"],
    legacyIds: ["3aa69f4d-a391-4e22-92a3-9f49663e49e6"],
  },
];

/**
 * Stored category values the brief does not map. They stay on their listings
 * untouched (and those listings stay in general search); see the report.
 */
export const UNMAPPED_LEGACY_NAMES = ["Aircheck", "Comedy Coaches"];

/* -------------------------------------------------------------------------- */
/* Normalization & lookup tables                                               */
/* -------------------------------------------------------------------------- */

/** "Self-Tape Support" / "Self Tape Support" / "self tape support" -> same key */
export const normKey = (v: unknown): string =>
  typeof v === "string" ? v.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() : "";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Same slug rule as the category pages always used. */
export function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const BY_SLUG = new Map(PRIMARY_CATEGORIES.map((c) => [c.slug, c]));
const BY_NAME_KEY = new Map<string, PrimaryCategory>();
const BY_LEGACY_KEY = new Map<string, PrimaryCategory>();
const BY_ID = new Map<string, PrimaryCategory>();
const LEGACY_SLUG = new Map<string, { primary: PrimaryCategory; legacy: string }>();
const SPECIALTY_CANON = new Map<string, string>();

for (const c of PRIMARY_CATEGORIES) {
  BY_NAME_KEY.set(normKey(c.name), c);
  for (const n of c.legacyNames) {
    BY_LEGACY_KEY.set(normKey(n), c);
    const s = nameToSlug(n);
    if (s !== c.slug && !LEGACY_SLUG.has(s)) {
      LEGACY_SLUG.set(s, { primary: c, legacy: n });
    }
  }
  for (const id of c.legacyIds) BY_ID.set(id.toLowerCase(), c);
  for (const sp of c.specialties) SPECIALTY_CANON.set(normKey(sp), sp);
}

const RETIRED_BY_KEY = new Map<string, RetiredCategory>();
const RETIRED_BY_ID = new Map<string, RetiredCategory>();
for (const r of RETIRED_CATEGORIES) {
  for (const n of r.legacyNames) RETIRED_BY_KEY.set(normKey(n), r);
  for (const id of r.legacyIds) RETIRED_BY_ID.set(id.toLowerCase(), r);
}

export const getPrimaryBySlug = (slug: string) => BY_SLUG.get(slug) ?? null;
export const sectionPrimaries = (section: SectionId) =>
  PRIMARY_CATEGORIES.filter((c) => c.section === section);

/** Primary a single stored category value (name, UUID or new name) belongs to. */
export function primaryForValue(value: unknown): PrimaryCategory | null {
  if (typeof value !== "string") return null;
  const v = value.trim();
  if (!v) return null;
  if (UUID_RE.test(v)) return BY_ID.get(v.toLowerCase()) ?? null;
  const k = normKey(v);
  return BY_NAME_KEY.get(k) ?? BY_LEGACY_KEY.get(k) ?? null;
}

export function retiredForValue(value: unknown): RetiredCategory | null {
  if (typeof value !== "string") return null;
  const v = value.trim();
  if (UUID_RE.test(v)) return RETIRED_BY_ID.get(v.toLowerCase()) ?? null;
  return RETIRED_BY_KEY.get(normKey(v)) ?? null;
}

/** The legacy NAME a stored value represents ("e4770486-..." -> "Audition Prep"). */
function legacyNameForValue(value: string): string | null {
  const v = value.trim();
  if (!primaryForValue(v)) return null;
  return UUID_RE.test(v) ? (LEGACY_NAME_BY_ID.get(v.toLowerCase()) ?? null) : v;
}

const LEGACY_NAME_BY_ID = new Map<string, string>([
  ["c0b8d6a5-436a-4004-b6b6-8b58a9f5b3d2", "Acting Classes & Coaches"],
  ["10159a59-61f7-4375-8770-141b6ddc878f", "Acting Schools"],
  ["e4770486-0c03-4263-8d0b-99c11598ddbf", "Audition Prep"],
  ["c5236852-82be-48df-8762-85c2b18f0d76", "Improv Classes"],
  ["1f3ec0a8-f2b8-41c4-b5fd-c7b78c266629", "Theatre Training"],
  ["d4135f3b-1f60-4486-a625-074e8b4253ce", "Voiceover Support"],
  ["0a568d20-66cc-45a9-819d-3bb81853fc82", "Vocal Coaches"],
  ["13a2c7ab-2036-4d0e-873c-4f8520e2aa29", "Dialect Coach"],
  ["54d02e9e-e984-4de0-97df-28fde1d18344", "Career Consulting"],
  ["c5ab8f4a-46a7-4228-96f7-3dc794144df0", "Branding Coaches"],
  ["7992d99a-6491-406e-b845-cfdb0986331d", "Business of Acting"],
  ["fb081d92-f853-47b2-809c-8e99c380b31a", "Demo Reel Creators"],
  ["3a04d4a2-736f-4f67-abb9-5f3cf917c536", "Reel Editors"],
  ["d0bf79f8-5c44-4a8e-9867-45f79fae887c", "Publicists"],
  ["a84faa6e-3deb-44c6-b415-051f73268d10", "Actor Websites"],
  ["7a6327b8-3de1-4c68-93ad-8927477cb9b3", "Stylists"],
  ["dff32333-23be-4cbc-86e6-9bde617e2ddd", "Self-Tape Support"],
  ["e00fab44-e4ab-4834-966c-5058ac1af655", "Headshot Photographers"],
  ["27c206de-8539-44d7-8e7c-ff14c99bec3e", "Set Sitters"],
  ["78b32c61-a10e-478f-a464-a84ad9eaa075", "Talent Agents"],
  ["472f7c28-e5cf-405e-82bd-f55b93407ae9", "Talent Managers"],
  ["22ffa1e8-394c-41c9-8f68-7e82d8656229", "Influencer Agents"],
  ["7019a3fc-ad32-43ff-9dc8-66cba7e15bb6", "Background Casting"],
  ["573b762c-7c7a-44ab-8a33-f2caddb5e018", "Child Advocacy"],
  ["bb4d85d6-334e-4bbe-848c-4948b42b6511", "Set Teachers"],
]);

export type ListingCategoryFields = {
  categories?: ReadonlyArray<unknown> | null;
  primary_category_id?: string | null;
  specialties?: ReadonlyArray<string | null | undefined> | null;
};

/**
 * Primary categories a listing belongs to, in the order the listing stores
 * them (deterministic). A valid `primary_category_id` wins the first slot.
 * A listing that genuinely spans several primaries is returned under each.
 */
export function primariesForListing(
  listing: ListingCategoryFields,
): PrimaryCategory[] {
  const out: PrimaryCategory[] = [];
  const add = (c: PrimaryCategory | null) => {
    if (c && !out.includes(c)) out.push(c);
  };
  if (listing.primary_category_id) {
    add(BY_ID.get(listing.primary_category_id.toLowerCase()) ?? null);
  }
  for (const v of listing.categories || []) add(primaryForValue(v));
  return out;
}

/** The one primary category shown as "the" category on cards and profiles. */
export const primaryCategoryOf = (listing: ListingCategoryFields) =>
  primariesForListing(listing)[0] ?? null;

export const listingInPrimary = (
  listing: ListingCategoryFields,
  primary: PrimaryCategory,
) => primariesForListing(listing).includes(primary);

/** Stored values that map to no primary (retired, unmapped or unknown). */
export function unmappedValues(listing: ListingCategoryFields): string[] {
  return (listing.categories || [])
    .filter((v): v is string => typeof v === "string" && v.trim() !== "")
    .filter((v) => !primaryForValue(v));
}

/* -------------------------------------------------------------------------- */
/* Specialties                                                                 */
/* -------------------------------------------------------------------------- */

/** Canonical casing for a known specialty; unknown labels are kept as typed. */
export function canonicalSpecialty(label: string): string {
  return SPECIALTY_CANON.get(normKey(label)) ?? label.trim();
}

function dedupe(labels: ReadonlyArray<string>): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of labels) {
    const label = canonicalSpecialty(raw);
    const k = normKey(label);
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(label);
  }
  return out;
}

/** Specialties directly implied by the listing's legacy category names. */
export function derivedSpecialties(listing: ListingCategoryFields): string[] {
  const out: string[] = [];
  for (const v of listing.categories || []) {
    if (typeof v !== "string") continue;
    const primary = primaryForValue(v);
    const legacy = legacyNameForValue(v);
    if (!primary || !legacy) continue;
    const hit = Object.entries(primary.derive).find(
      ([k]) => normKey(k) === normKey(legacy),
    );
    if (hit) out.push(hit[1]);
  }
  return out;
}

/**
 * All specialty tags to display / filter on: what the owner saved explicitly
 * (preserved as-is) plus what the legacy categories directly imply. Never
 * assumes a provider offers anything its data doesn't say.
 */
export function specialtiesForListing(listing: ListingCategoryFields): string[] {
  return dedupe([
    ...(listing.specialties || []).filter(
      (s): s is string => typeof s === "string",
    ),
    ...derivedSpecialties(listing),
  ]);
}

/** Specialty options offered for the given primary slugs (picker). */
export function specialtyOptionsFor(slugs: string[]): string[] {
  return dedupe(slugs.flatMap((s) => BY_SLUG.get(s)?.specialties ?? []));
}

/* -------------------------------------------------------------------------- */
/* Resolving a category reference (URL slug, name, UUID)                       */
/* -------------------------------------------------------------------------- */

export type CategoryRef =
  | { kind: "primary"; primary: PrimaryCategory }
  | {
      /** a legacy slug that now lives under a primary (redirect target) */
      kind: "legacy";
      primary: PrimaryCategory;
      legacyName: string;
      specialty: string | null;
    }
  | { kind: "retired"; retired: RetiredCategory }
  | { kind: "unknown" };

export function resolveCategoryRef(input: string): CategoryRef {
  const raw = (input || "").trim();
  if (!raw) return { kind: "unknown" };

  const bySlug = BY_SLUG.get(raw.toLowerCase());
  if (bySlug) return { kind: "primary", primary: bySlug };

  const slug = nameToSlug(raw);
  const primarySlug = BY_SLUG.get(slug);
  if (primarySlug) return { kind: "primary", primary: primarySlug };

  const legacy = LEGACY_SLUG.get(slug);
  if (legacy) {
    const spec = Object.entries(legacy.primary.derive).find(
      ([k]) => normKey(k) === normKey(legacy.legacy),
    );
    return {
      kind: "legacy",
      primary: legacy.primary,
      legacyName: legacy.legacy,
      specialty: spec ? spec[1] : null,
    };
  }

  const retired =
    RETIRED_BY_KEY.get(normKey(raw)) ??
    (UUID_RE.test(raw) ? RETIRED_BY_ID.get(raw.toLowerCase()) : undefined) ??
    RETIRED_BY_KEY.get(normKey(slug.replace(/-/g, " ")));
  if (retired) return { kind: "retired", retired };

  const p = primaryForValue(raw);
  if (p) return { kind: "primary", primary: p };
  return { kind: "unknown" };
}

/** Names and UUIDs a filter on this primary (or retired category) must match. */
export function matchSetsFor(ref: CategoryRef): {
  names: Set<string>;
  ids: Set<string>;
} | null {
  if (ref.kind === "primary" || ref.kind === "legacy") {
    const p = ref.primary;
    return {
      names: new Set([p.name, ...p.legacyNames].map(normKey)),
      ids: new Set(p.legacyIds.map((i) => i.toLowerCase())),
    };
  }
  if (ref.kind === "retired") {
    return {
      names: new Set(ref.retired.legacyNames.map(normKey)),
      ids: new Set(ref.retired.legacyIds.map((i) => i.toLowerCase())),
    };
  }
  return null;
}

/* -------------------------------------------------------------------------- */
/* Counts                                                                      */
/* -------------------------------------------------------------------------- */

/** Distinct listings per primary (a multi-category listing counts in each). */
export function countByPrimary(
  listings: ReadonlyArray<ListingCategoryFields>,
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const c of PRIMARY_CATEGORIES) counts[c.slug] = 0;
  for (const l of listings) {
    for (const p of primariesForListing(l)) counts[p.slug] += 1;
  }
  return counts;
}

/** Listings in a primary, with how many carry each specialty tag. */
export function specialtyCounts(
  listings: ReadonlyArray<ListingCategoryFields>,
): Array<{ name: string; count: number }> {
  const counts = new Map<string, number>();
  for (const l of listings) {
    for (const s of specialtiesForListing(l)) {
      counts.set(s, (counts.get(s) ?? 0) + 1);
    }
  }
  return Array.from(counts, ([name, count]) => ({ name, count })).sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name),
  );
}

/* -------------------------------------------------------------------------- */
/* Editing helpers (category picker)                                           */
/* -------------------------------------------------------------------------- */

/** Primaries currently selected by a listing's stored names. */
export const selectedPrimarySlugs = (names: ReadonlyArray<string>): string[] =>
  primariesForListing({ categories: names }).map((p) => p.slug);

/**
 * Apply a primary-category toggle to the stored names, WITHOUT touching any
 * value that maps to a different primary or to no primary (retired / unmapped
 * legacy categories are preserved until the owner removes them explicitly).
 *  - on:  adds the new primary's name (unless a legacy name already covers it)
 *  - off: removes every stored value that rolls up to that primary
 */
export function togglePrimaryInNames(
  names: ReadonlyArray<string>,
  slug: string,
  on: boolean,
): string[] {
  const primary = BY_SLUG.get(slug);
  if (!primary) return [...names];
  if (on) {
    return primariesForListing({ categories: names }).includes(primary)
      ? [...names]
      : [...names, primary.name];
  }
  return names.filter((v) => primaryForValue(v) !== primary);
}

/** Explicitly drop one retired / unmapped stored value (owner-initiated). */
export const removeStoredValue = (
  names: ReadonlyArray<string>,
  value: string,
): string[] => names.filter((v) => v !== value);
