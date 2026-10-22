/**
 * Audit of specialty filters against a snapshot of REAL production data
 * (read-only SELECT of listings grouped by distinct categories/specialties,
 * 1,042 listings, taken from Supabase). For every one of the 13 categories:
 *  - the filter chips are only approved labels,
 *  - each chip's count equals the number of listings its filter returns,
 *  - nothing from another category leaks in.
 * Prints the final chip list per category.
 */
import assert from "node:assert/strict";
import {
  PRIMARY_CATEGORIES,
  listingInPrimary,
  specialtiesForListing,
  specialtyCounts,
} from "../src/lib/category-taxonomy";

// [count, categories (| separated), specialties (| separated)]
const SNAPSHOT: Array<[number, string | null, string | null]> = [
  [285, "Talent Agents", ""], [246, "Headshot Photographers", null], [111, "Set Teachers", null],
  [57, "Talent Managers", null], [47, "Stylists", null], [26, "Talent Managers", ""],
  [25, "Acting Classes & Coaches", null], [23, "Self-Tape Support", null], [22, "Mental Health for Performers", null],
  [22, "Demo Reel Creators", null], [21, "Background Casting", null], [19, "Reel Editors", null],
  [16, "Publicists", null], [15, "Acting Coach", null], [13, "Dialect Coach", null], [11, "Talent Agents", null],
  [9, "Branding Coaches", null], [9, "Career Consulting", null], [8, "Voiceover Support", null],
  [6, "Headshot Photographer", null], [6, "Self Tape Support", null], [5, "Aircheck", null],
  [4, "Actor Websites", null], [3, "Acting School/Coach", null], [3, "Headshot Photographers", ""],
  [2, "Business of Acting", ""], [2, "Casting Workshops", null], [2, "Acting Schools", null],
  [2, "Demo Reel Creators|Reel Editors", null], [2, null, null],
  [1, "Acting Classes & Coaches|Acting Schools|Audition Prep", null], [1, "Acting School", null],
  [1, "e00fab44-e4ab-4834-966c-5058ac1af655", null], [1, "Audition Prep|Self Tape Support", null],
  [1, "Acting Classes & Coaches|Audition Prep|Acting Schools|Career Consulting|Self-Tape Support|Theatre Training", "Self-Tapes|Audition Prep|Memorization"],
  [1, "Acting Classes & Coaches|Business of Acting|Comedy Coaches|Mental Health for Performers|Theatre Training|Self-Tape Support|Career Consulting|Audition Prep", null],
  [1, "Self-Tape Support|Acting Classes & Coaches", ""], [1, "Child Advocacy", null],
  [1, "Business of Acting|Career Consulting", null], [1, "Child Advocacy|Business of Acting|Career Consulting", null],
  [1, "Mental Health for Performers|Child Advocacy", null],
  [1, "Acting Classes & Coaches|Audition Prep|Acting Schools|Acting Classes & Coaches|Acting Schools|Audition Prep", ""],
  [1, "Business of Acting", null], [1, "", ""], [1, "Audition Prep", ""], [1, "Influencer Agents", null],
  [1, "Vocal Coaches", null], [1, "", null],
  [1, "Acting Classes & Coaches|Business of Acting|Self-Tape Support|Acting Schools|Audition Prep|Branding Coaches|Career Consulting|Child Advocacy|Mental Health for Performers|Stylists|Theatre Training|Actor Websites|Voiceover Support", "Memorization|Audition Prep|Self-Tapes"],
  [1, "Acting Classes & Coaches|Acting Schools|Audition Prep|Career Consulting|Business of Acting|Improv Classes|Theatre Training|Comedy Coaches|Self-Tape Support|Talent Showcases", null],
];

const listings = SNAPSHOT.flatMap(([n, c, s]) =>
  Array.from({ length: n }, () => ({
    categories: c ? c.split("|") : [],
    specialties: s ? s.split("|") : [],
  })),
);
assert.equal(listings.length, 1042);

let failures = 0;
console.log(`Specialty filter audit on ${listings.length} real listings\n`);
for (const p of PRIMARY_CATEGORIES) {
  const inCat = listings.filter((l) => listingInPrimary(l, p));
  const chips = specialtyCounts(inCat, p.slug);
  const approved = new Set(p.specialties);
  try {
    for (const chip of chips) {
      assert.ok(approved.has(chip.name), `${p.slug}: "${chip.name}" is not an approved label`);
      const results = inCat.filter((l) => specialtiesForListing(l, p.slug).includes(chip.name));
      assert.equal(results.length, chip.count, `${p.slug}/${chip.name}: chip ${chip.count} != results ${results.length}`);
      assert.ok(chip.count <= inCat.length);
    }
    if (p.specialties.length === 0) assert.equal(chips.length, 0, `${p.slug} must show no chips`);
    console.log(`${p.name.padEnd(30)} ${String(inCat.length).padStart(4)} listings | ${chips.length ? chips.map((c) => `${c.name} (${c.count})`).join(", ") : "no specialty filters"}`);
  } catch (e) {
    failures++;
    console.log(`FAIL ${(e as Error).message}`);
  }
}

// Exact expectations for the real data
const chipsOf = (slug: string) =>
  specialtyCounts(listings.filter((l) => listingInPrimary(l, PRIMARY_CATEGORIES.find((p) => p.slug === slug)!)), slug).map((c) => `${c.name}:${c.count}`);
const expect = (slug: string, want: string[]) => {
  try {
    assert.deepEqual(chipsOf(slug).sort(), want.sort(), slug);
  } catch (e) {
    failures++;
    console.log(`FAIL ${(e as Error).message}`);
  }
};
// Acting Training must never show career / marketing / age / format chips
const acting = chipsOf("acting-training").map((c) => c.split(":")[0]);
for (const bad of ["Career Strategy", "Business of Acting", "Actor Websites", "Personal Branding", "Styling", "Personal Styling", "5-8", "Self-Tapes"]) {
  if (acting.includes(bad)) {
    failures++;
    console.log(`FAIL acting-training leaks "${bad}"`);
  }
}
expect("career-coaching-consulting", ["Career Strategy:15", "Personal Branding:10", "Business of Acting:8"]);
expect("actor-marketing-services", ["Styling:48", "Public Relations:16", "Actor Websites:5"]);
expect("acting-training", ["Dialect Coaching:13", "Voiceover Training:9", "Audition Coaching:8", "Theatre Training:4", "Memorization:2", "Improv:1", "Vocal Training:1"]);
expect("demo-reels-editing", ["Demo Reel Production:24", "Reel Editing:21"]);

if (failures) {
  console.log(`\n${failures} failure(s)`);
  process.exit(1);
}
console.log("\nspecialty audit passed");
