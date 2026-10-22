import assert from "node:assert/strict";
import {
  buildCategoryMatcher,
  listingHasPhoto,
  listingMatchesCategory,
  listingMatchesLocation,
  resolveLocationFilter,
} from "@/lib/directory-search";

const HEADSHOT_ID = "e00fab44-e4ab-4834-966c-5058ac1af655";
const categories = [
  { id: HEADSHOT_ID, category_name: "Headshot Photographers" },
  {
    id: "11111111-1111-1111-1111-111111111111",
    category_name: "Talent Managers",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    category_name: "Acting Classes & Coaches",
  },
];

type L = {
  name: string;
  city: string | null;
  state: string | null;
  categories: string[];
  secondary_locations?: { city: string; state: string }[];
};
// The cards the live site wrongly returned, plus the real matches
const listings: L[] = [
  {
    name: "2mm Headshots",
    city: "Dallas",
    state: "TX",
    categories: ["Headshot Photographers"],
  },
  {
    name: "Austin Kids Photo",
    city: "Round Rock",
    state: "tx",
    categories: [HEADSHOT_ID],
  },
  {
    name: "Lone Star Portraits",
    city: "Houston",
    state: "Texas",
    categories: ["Headshot Photograper", "Headshot Photographer"],
  },
  {
    name: "Marliese Marie Photography",
    city: "Mount Dora",
    state: "FL",
    categories: ["Headshot Photographers"],
  },
  {
    name: "Bohemia Group",
    city: "Los Angeles",
    state: "CA",
    categories: ["Talent Managers"],
  },
  {
    name: "Gloria Garayua Coaching",
    city: "Burbank",
    state: "CA",
    categories: ["Acting Classes & Coaches"],
  },
  {
    name: "22Talent",
    city: "Orlando",
    state: "FL",
    categories: ["Talent Managers"],
  },
  {
    name: "LA Shooter",
    city: "Studio City",
    state: "CA",
    categories: ["Headshot Photographers"],
  },
  {
    name: "Traveling Shooter",
    city: "Los Angeles",
    state: "CA",
    categories: ["Headshot Photographers"],
    secondary_locations: [{ city: "Dallas", state: "TX" }],
  },
];

const run = (opts: {
  category?: string;
  state?: string;
  city?: string;
  q?: string;
}) => {
  const { location, textQuery } = resolveLocationFilter(opts);
  const matcher = opts.category
    ? buildCategoryMatcher(opts.category, categories)
    : null;
  return {
    textQuery,
    names: listings
      .filter((l) => !matcher || listingMatchesCategory(l, matcher))
      .filter((l) => !location || listingMatchesLocation(l, location))
      .map((l) => l.name),
  };
};

let passed = 0;
function test(name: string, fn: () => void) {
  fn();
  passed++;
  console.log(`ok - ${name}`);
}

test("category UUID + state=TX returns ONLY Texas headshot photographers", () => {
  const { names } = run({ category: HEADSHOT_ID, state: "TX" });
  assert.deepEqual(
    names.sort(),
    [
      "2mm Headshots",
      "Austin Kids Photo",
      "Lone Star Portraits",
      "Traveling Shooter",
    ].sort(),
  );
});

test("category name, slug and UUID resolve to the same set", () => {
  const a = run({ category: HEADSHOT_ID }).names;
  assert.deepEqual(run({ category: "Headshot Photographers" }).names, a);
  assert.deepEqual(run({ category: "headshot-photographers" }).names, a);
  assert.ok(!a.includes("Bohemia Group"));
});

test("state is case-insensitive and accepts the full name", () => {
  const tx = run({ category: HEADSHOT_ID, state: "TX" }).names.sort();
  assert.deepEqual(
    run({ category: HEADSHOT_ID, state: "tx" }).names.sort(),
    tx,
  );
  assert.deepEqual(
    run({ category: HEADSHOT_ID, state: "Texas" }).names.sort(),
    tx,
  );
});

test("unknown state matches nothing instead of everything", () => {
  assert.deepEqual(run({ category: HEADSHOT_ID, state: "Narnia" }).names, []);
});

test("city is case-insensitive; secondary locations count", () => {
  assert.deepEqual(
    run({ category: HEADSHOT_ID, city: "dallas" }).names.sort(),
    ["2mm Headshots", "Traveling Shooter"],
  );
});

test("metro aliases: Dallas / Austin / LA", () => {
  assert.deepEqual(run({ category: HEADSHOT_ID, city: "DFW" }).names.sort(), [
    "2mm Headshots",
    "Traveling Shooter",
  ]);
  assert.deepEqual(run({ category: HEADSHOT_ID, city: "Austin" }).names, [
    "Austin Kids Photo",
  ]);
  assert.deepEqual(run({ category: HEADSHOT_ID, city: "LA" }).names.sort(), [
    "LA Shooter",
    "Traveling Shooter",
  ]);
});

test("a q that is only a place becomes a location filter", () => {
  assert.equal(run({ q: "TX" }).textQuery, undefined);
  assert.deepEqual(run({ category: HEADSHOT_ID, q: "TX" }).names.sort(), [
    "2mm Headshots",
    "Austin Kids Photo",
    "Lone Star Portraits",
    "Traveling Shooter",
  ]);
  assert.deepEqual(run({ category: HEADSHOT_ID, q: "Dallas" }).names.sort(), [
    "2mm Headshots",
    "Traveling Shooter",
  ]);
  assert.deepEqual(run({ category: HEADSHOT_ID, q: "LA" }).names.sort(), [
    "LA Shooter",
    "Traveling Shooter",
  ]);
  assert.deepEqual(run({ category: HEADSHOT_ID, q: "texas" }).names.length, 4);
  assert.equal(run({ q: "headshots" }).textQuery, "headshots");
});

test("state AND city must both hold (no Dallas, FL)", () => {
  assert.deepEqual(
    run({ category: HEADSHOT_ID, state: "FL", city: "Dallas" }).names,
    [],
  );
});

test("photo detection", () => {
  assert.equal(listingHasPhoto({ profile_image: "a.jpg" }), true);
  assert.equal(listingHasPhoto({ profile_image: "  ", logo_url: null }), false);
});

console.log(`\n${passed} tests passed`);
