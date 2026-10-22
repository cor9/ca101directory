import { stateNames } from "@/data/regions";

/**
 * Pure helpers for strict directory filtering (category AND location AND ...).
 * Kept free of I/O so they can be unit tested without Supabase.
 */

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isUuid = (v: unknown): v is string =>
  typeof v === "string" && UUID_RE.test(v.trim());

/** Lowercase and strip everything except letters/digits ("Self-Tape" -> "selftape"). */
export const normalizeToken = (v: unknown): string =>
  typeof v === "string" ? v.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() : "";

/* -------------------------------------------------------------------------- */
/* Categories                                                                  */
/* -------------------------------------------------------------------------- */

/** Groups of category names that refer to the same thing (normalized). */
const CATEGORY_SYNONYM_GROUPS: string[][] = [
  ["Headshot Photographers", "Headshot Photographer"],
  ["Self Tape Support", "Self-Tape Support"],
  ["Demo Reel Editors", "Reel Editors"],
];

export type CategoryMatcher = {
  /** normalized names (and slugs) that count as a match */
  names: Set<string>;
  /** lowercase category UUIDs that count as a match */
  ids: Set<string>;
};

/**
 * Build a matcher from a category UUID, name or slug. Listings store a mix of
 * category names and UUIDs in `categories[]`, so we match on both.
 */
export function buildCategoryMatcher(
  input: string,
  allCategories: Array<{ id: string; category_name: string }>,
): CategoryMatcher {
  const names = new Set<string>();
  const ids = new Set<string>();
  const raw = input.trim();

  const found = isUuid(raw)
    ? allCategories.find((c) => c.id.toLowerCase() === raw.toLowerCase())
    : allCategories.find(
        (c) => normalizeToken(c.category_name) === normalizeToken(raw),
      );

  if (isUuid(raw)) ids.add(raw.toLowerCase());
  if (found) {
    ids.add(found.id.toLowerCase());
    names.add(normalizeToken(found.category_name));
  } else if (!isUuid(raw)) {
    names.add(normalizeToken(raw));
  }

  for (const group of CATEGORY_SYNONYM_GROUPS) {
    const norm = group.map(normalizeToken);
    if (norm.some((n) => names.has(n))) {
      for (const n of norm) names.add(n);
      // pull in the UUIDs of every synonym category too
      for (const c of allCategories) {
        if (norm.includes(normalizeToken(c.category_name))) {
          ids.add(c.id.toLowerCase());
        }
      }
    }
  }
  return { names, ids };
}

export function listingMatchesCategory(
  listing: {
    categories?: string[] | null;
    primary_category_id?: string | null;
  },
  matcher: CategoryMatcher,
): boolean {
  if (
    listing.primary_category_id &&
    matcher.ids.has(listing.primary_category_id.toLowerCase())
  ) {
    return true;
  }
  return (listing.categories || []).some((c) => {
    if (typeof c !== "string") return false;
    return (
      matcher.ids.has(c.trim().toLowerCase()) ||
      matcher.names.has(normalizeToken(c))
    );
  });
}

/* -------------------------------------------------------------------------- */
/* Location                                                                    */
/* -------------------------------------------------------------------------- */

const NAME_TO_ABBR: Record<string, string> = Object.fromEntries(
  Object.entries(stateNames).map(([abbr, name]) => [
    normalizeToken(name),
    abbr,
  ]),
);

/** "tx" | "TX" | "Texas" | " texas " -> "TX"; unknown -> null */
export function toStateAbbr(input?: string | null): string | null {
  if (!input) return null;
  const t = input.trim();
  if (!t) return null;
  const upper = t.replace(/\./g, "").toUpperCase();
  if (upper.length === 2 && stateNames[upper]) return upper;
  return NAME_TO_ABBR[normalizeToken(t)] ?? null;
}

type Metro = { state: string; aliases: string[]; cities: string[] };

/** Metro areas: searching any alias matches every listed city in that metro. */
const METROS: Metro[] = [
  {
    state: "CA",
    aliases: ["la", "l.a.", "los angeles", "greater los angeles", "lax"],
    cities: [
      "los angeles",
      "hollywood",
      "west hollywood",
      "north hollywood",
      "burbank",
      "studio city",
      "sherman oaks",
      "encino",
      "van nuys",
      "woodland hills",
      "pasadena",
      "glendale",
      "santa monica",
      "beverly hills",
      "culver city",
      "long beach",
      "calabasas",
      "toluca lake",
      "universal city",
      "venice",
      "valley village",
      "tarzana",
      "canoga park",
      "northridge",
      "sun valley",
      "agoura hills",
      "santa clarita",
      "valencia",
      "torrance",
      "manhattan beach",
    ],
  },
  {
    state: "TX",
    aliases: [
      "dallas",
      "dfw",
      "dallas fort worth",
      "dallas-fort worth",
      "fort worth",
    ],
    cities: [
      "dallas",
      "fort worth",
      "plano",
      "frisco",
      "irving",
      "arlington",
      "richardson",
      "garland",
      "mckinney",
      "denton",
      "addison",
      "carrollton",
      "southlake",
      "grapevine",
      "lewisville",
      "allen",
      "flower mound",
      "mesquite",
    ],
  },
  {
    state: "TX",
    aliases: ["austin"],
    cities: [
      "austin",
      "round rock",
      "cedar park",
      "georgetown",
      "pflugerville",
      "lakeway",
      "leander",
      "san marcos",
      "kyle",
      "bee cave",
      "buda",
    ],
  },
  {
    state: "TX",
    aliases: ["houston"],
    cities: [
      "houston",
      "sugar land",
      "katy",
      "the woodlands",
      "pearland",
      "spring",
      "cypress",
      "humble",
      "league city",
    ],
  },
  {
    state: "NY",
    aliases: ["nyc", "new york city", "manhattan", "brooklyn"],
    cities: [
      "new york",
      "new york city",
      "manhattan",
      "brooklyn",
      "queens",
      "bronx",
      "staten island",
      "long island city",
      "astoria",
    ],
  },
  {
    state: "GA",
    aliases: ["atlanta", "atl"],
    cities: [
      "atlanta",
      "marietta",
      "decatur",
      "alpharetta",
      "roswell",
      "kennesaw",
      "smyrna",
      "sandy springs",
      "duluth",
      "lawrenceville",
    ],
  },
  {
    state: "FL",
    aliases: ["orlando"],
    cities: [
      "orlando",
      "winter park",
      "kissimmee",
      "mount dora",
      "lake mary",
      "sanford",
      "oviedo",
      "winter garden",
      "altamonte springs",
      "maitland",
    ],
  },
  {
    state: "IL",
    aliases: ["chicago"],
    cities: ["chicago", "evanston", "oak park", "naperville", "skokie"],
  },
];

const cityKey = (v?: string | null) =>
  (v || "")
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/\bsaint\b/g, "st")
    .replace(/\bmt\b/g, "mount")
    .replace(/\s+/g, " ")
    .trim();

function findMetro(input?: string | null): Metro | null {
  const k = (input || "").toLowerCase().replace(/\s+/g, " ").trim();
  if (!k) return null;
  const kk = cityKey(k);
  return (
    METROS.find((m) => m.aliases.some((a) => a === k || cityKey(a) === kk)) ??
    null
  );
}

export type LocationFilter = {
  state: string | null; // normalized abbreviation
  city: string | null; // normalized city text (non-metro)
  metro: Metro | null;
  /** user supplied a state value we could not understand -> match nothing */
  invalid: boolean;
};

/**
 * Resolve the raw `state`, `city` and `q` URL params into one location filter.
 * A `q` that is nothing but a location ("TX", "Texas", "Dallas", "LA") is
 * treated as a location, not as free text.
 */
export function resolveLocationFilter(params: {
  state?: string | null;
  city?: string | null;
  q?: string | null;
}): { location: LocationFilter | null; textQuery: string | undefined } {
  let state = toStateAbbr(params.state);
  const invalid = Boolean(params.state?.trim()) && !state;
  let cityInput = params.city?.trim() || "";
  let textQuery = params.q?.trim() || undefined;

  if (textQuery && !state && !cityInput) {
    const q = textQuery;
    const metro = findMetro(q);
    const isAbbr = /^[A-Z]{2}$/.test(q); // abbreviations must be typed uppercase
    const asState = isAbbr || q.length > 2 ? toStateAbbr(q) : null;
    if (metro && !(isAbbr && q !== "LA" && asState)) {
      cityInput = q;
      textQuery = undefined;
    } else if (asState) {
      state = asState;
      textQuery = undefined;
    }
  }

  if (!state && !cityInput && !invalid) return { location: null, textQuery };

  const metro = findMetro(cityInput);
  return {
    location: {
      state,
      city: metro || !cityInput ? null : cityKey(cityInput),
      metro,
      invalid,
    },
    textQuery,
  };
}

type Loc = { city?: string | null; state?: string | null };

export function listingLocations(listing: {
  city?: string | null;
  state?: string | null;
  secondary_locations?: Loc[] | null;
}): Loc[] {
  const locs: Loc[] = [{ city: listing.city, state: listing.state }];
  if (Array.isArray(listing.secondary_locations)) {
    locs.push(...listing.secondary_locations);
  }
  return locs;
}

export function listingMatchesLocation(
  listing: Parameters<typeof listingLocations>[0],
  f: LocationFilter,
): boolean {
  if (f.invalid) return false;
  return listingLocations(listing).some((loc) => {
    const locState = toStateAbbr(loc.state);
    const locCity = cityKey(loc.city);

    if (f.state && locState !== f.state) return false;
    if (f.metro) {
      // a metro implies its state, even if the state param was not supplied
      if (locState && locState !== f.metro.state) return false;
      if (!f.metro.cities.includes(locCity)) return false;
    }
    if (f.city) {
      if (!locCity) return false;
      if (
        locCity !== f.city &&
        !(f.city.length >= 4 && locCity.includes(f.city))
      ) {
        return false;
      }
    }
    return true;
  });
}

/* -------------------------------------------------------------------------- */
/* Ranking                                                                     */
/* -------------------------------------------------------------------------- */

/** True when the listing has a real profile/logo photo (not a placeholder card). */
export function listingHasPhoto(listing: {
  profile_image?: string | null;
  logo_url?: string | null;
}): boolean {
  return Boolean(listing.profile_image?.trim() || listing.logo_url?.trim());
}
