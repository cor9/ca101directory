import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  legacyRedirectTable,
  PRIMARY_CATEGORIES,
  RETIRED_CATEGORIES,
  SECTIONS,
  UNMAPPED_LEGACY_NAMES,
  countByPrimary,
  derivedSpecialties,
  editableSpecialties,
  resolveSpecialty,
  listingInPrimary,
  matchSetsFor,
  primariesForListing,
  primaryCategoryOf,
  primaryForValue,
  removeStoredValue,
  resolveCategoryRef,
  sectionPrimaries,
  selectedPrimarySlugs,
  specialtiesForListing,
  specialtyCounts,
  specialtyOptionsFor,
  togglePrimaryInNames,
  unmappedValues,
  getPrimaryBySlug,
} from "@/lib/category-taxonomy";

let passed = 0;
function test(name: string, fn: () => void) {
  fn();
  passed++;
  console.log(`ok - ${name}`);
}
const L = (categories: string[] | null, specialties: string[] | null = null) => ({ categories, specialties });

// Real listings from the live data (names as stored)
const corey = L(["Acting Classes & Coaches", "Audition Prep", "Acting Schools", "Acting Classes & Coaches", "Acting Schools", "Audition Prep"]);
const wholehearted = L(["Acting Classes & Coaches", "Business of Acting", "Self-Tape Support", "Acting Schools", "Audition Prep", "Branding Coaches", "Career Consulting", "Child Advocacy", "Mental Health for Performers", "Stylists", "Theatre Training", "Actor Websites", "Voiceover Support"]);
const reader101 = L(["Audition Prep", "Self Tape Support"]);
const stone = L(["Casting Workshops"]);
const mh = L(["Mental Health for Performers"]);
const aircheck = L(["Aircheck"]);

test("13 primary categories in 3 sections: 7 services, 3 representation, 3 resources", () => {
  assert.equal(PRIMARY_CATEGORIES.length, 13);
  assert.equal(SECTIONS.length, 3);
  assert.deepEqual(
    SECTIONS.map((s) => sectionPrimaries(s.id).length),
    [7, 3, 3],
  );
  assert.deepEqual(
    sectionPrimaries("representation").map((c) => c.slug),
    ["talent-agents", "talent-managers", "influencer-agents"],
  );
  assert.deepEqual(
    sectionPrimaries("resources").map((c) => c.slug).sort(),
    ["background-casting", "child-advocacy", "set-teachers"],
  );
});

test("every slug and name is unique; slugs match the required public URLs", () => {
  const slugs = PRIMARY_CATEGORIES.map((c) => c.slug);
  assert.equal(new Set(slugs).size, 13);
  for (const s of ["acting-training", "demo-reels-editing", "actor-marketing-services", "self-tape-services", "headshot-photographers", "talent-agents", "talent-managers", "influencer-agents", "set-sitters", "set-teachers", "background-casting", "child-advocacy", "career-coaching-consulting"]) {
    assert.ok(slugs.includes(s), s);
  }
});

test("no legacy name or UUID is claimed by two primaries; none is also retired", () => {
  const seenName = new Map<string, string>();
  const seenId = new Map<string, string>();
  for (const c of PRIMARY_CATEGORIES) {
    for (const n of c.legacyNames) { const k = n.toLowerCase().replace(/[^a-z0-9]/g, ""); const prev = seenName.get(k); assert.ok(prev === undefined || prev === c.slug, `${n} claimed by ${prev} and ${c.slug}`); seenName.set(k, c.slug); }
    for (const id of c.legacyIds) { assert.ok(!seenId.has(id), `${id} dup`); seenId.set(id, c.slug); }
  }
  for (const r of RETIRED_CATEGORIES) {
    for (const n of r.legacyNames) assert.equal(primaryForValue(n), null, `${n} must not map to a primary`);
    for (const id of r.legacyIds) assert.equal(primaryForValue(id), null);
  }
  assert.equal(RETIRED_CATEGORIES.length, 3);
});

test("Acting Training rolls up all 8 requested legacy categories (names AND UUIDs) plus stored variants", () => {
  const at = getPrimaryBySlug("acting-training")!;
  for (const n of ["Acting Classes & Coaches", "Acting Schools", "Audition Prep", "Improv Classes", "Theatre Training", "Voiceover Support", "Vocal Coaches", "Dialect Coach", "Acting Coach", "Acting School/Coach", "Acting School"]) {
    assert.equal(primaryForValue(n), at, n);
  }
  assert.equal(at.legacyIds.length, 8);
  for (const id of at.legacyIds) assert.equal(primaryForValue(id.toUpperCase()), at);
});

test("each consolidated category maps its legacy names", () => {
  const m = (n: string) => primaryForValue(n)?.slug;
  assert.equal(m("Career Consulting"), "career-coaching-consulting");
  assert.equal(m("Branding Coaches"), "career-coaching-consulting");
  assert.equal(m("Business of Acting"), "career-coaching-consulting");
  assert.equal(m("Demo Reel Creators"), "demo-reels-editing");
  assert.equal(m("Reel Editors"), "demo-reels-editing");
  assert.equal(m("Publicists"), "actor-marketing-services");
  assert.equal(m("Actor Websites"), "actor-marketing-services");
  assert.equal(m("Stylists"), "actor-marketing-services");
  assert.equal(m("Self-Tape Support"), "self-tape-services");
  assert.equal(m("Self Tape Support"), "self-tape-services");
  assert.equal(m("Self-Tape Services"), "self-tape-services");
  assert.equal(m("Headshot Photographer"), "headshot-photographers");
  assert.equal(m("headshot photographers"), "headshot-photographers");
});

test("retired categories map to NO primary and are recognised as retired", () => {
  for (const n of ["Talent Showcases", "Mental Health for Performers", "Casting Workshops"]) {
    assert.equal(resolveCategoryRef(n).kind, "retired", n);
  }
  assert.equal(resolveCategoryRef("mental-health-for-performers").kind, "retired");
  assert.equal(resolveCategoryRef("a1f986a0-67ae-4d64-a725-2a936e928b5f").kind, "retired");
});

test("unmapped legacy values (Aircheck, Comedy Coaches) are not silently re-homed", () => {
  for (const n of UNMAPPED_LEGACY_NAMES) assert.equal(primaryForValue(n), null);
  assert.deepEqual(unmappedValues(aircheck), ["Aircheck"]);
  assert.equal(primaryCategoryOf(aircheck), null);
});

test("legacy URL slugs resolve to their new parent, preserving the specialty", () => {
  const r = (s: string) => resolveCategoryRef(s);
  const a = r("acting-schools"); assert.ok(a.kind === "legacy" && a.primary.slug === "acting-training" && a.specialty === null);
  const b = r("audition-prep"); assert.ok(b.kind === "legacy" && b.primary.slug === "acting-training" && b.specialty === "Audition Coaching");
  const c = r("improv-classes"); assert.ok(c.kind === "legacy" && c.specialty === "Improv");
  const d = r("demo-reel-creators"); assert.ok(d.kind === "legacy" && d.primary.slug === "demo-reels-editing" && d.specialty === "Demo Reel Production");
  const e = r("reel-editors"); assert.ok(e.kind === "legacy" && e.specialty === "Reel Editing");
  const f = r("publicists"); assert.ok(f.kind === "legacy" && f.primary.slug === "actor-marketing-services" && f.specialty === "Public Relations");
  const g = r("stylists"); assert.ok(g.kind === "legacy" && g.primary.slug === "actor-marketing-services");
  const h = r("self-tape-support"); assert.ok(h.kind === "legacy" && h.primary.slug === "self-tape-services");
  const i = r("acting-classes-coaches"); assert.ok(i.kind === "legacy" && i.primary.slug === "acting-training");
  // standalone categories keep their URLs
  for (const s of ["headshot-photographers", "talent-agents", "talent-managers", "influencer-agents", "set-sitters", "set-teachers", "background-casting", "child-advocacy"]) {
    assert.equal(r(s).kind, "primary", s);
  }
  assert.equal(r("not-a-category").kind, "unknown");
});

test("Coaching with Corey: one primary, duplicates collapse, specialties derived once", () => {
  assert.deepEqual(primariesForListing(corey).map((p) => p.slug), ["acting-training"]);
  assert.deepEqual(specialtiesForListing(corey), ["Audition Coaching"]);
});

test("multi-service professional stays discoverable under EVERY relevant primary", () => {
  const slugs = primariesForListing(wholehearted).map((p) => p.slug);
  assert.deepEqual(slugs, ["acting-training", "career-coaching-consulting", "self-tape-services", "child-advocacy", "actor-marketing-services"]);
  assert.equal(primaryCategoryOf(wholehearted)!.slug, "acting-training"); // deterministic: first stored
  for (const slug of slugs) assert.ok(listingInPrimary(wholehearted, getPrimaryBySlug(slug)!));
  assert.deepEqual(unmappedValues(wholehearted), ["Mental Health for Performers"]); // kept, not dropped
});

test("derived specialties come only from directly-supported legacy names", () => {
  assert.deepEqual(derivedSpecialties(L(["Improv Classes"])), ["Improv"]);
  assert.deepEqual(derivedSpecialties(L(["Dialect Coach"])), ["Dialect Coaching"]);
  assert.deepEqual(derivedSpecialties(L(["Vocal Coaches"])), ["Vocal Training"]);
  assert.deepEqual(derivedSpecialties(L(["Reel Editors"])), ["Reel Editing"]);
  assert.deepEqual(derivedSpecialties(L(["Publicists"])), ["Public Relations"]);
  // Not assumed: a plain acting coach does not get Improv / Voiceover / Private / Online
  assert.deepEqual(derivedSpecialties(L(["Acting Classes & Coaches"])), []);
  assert.deepEqual(derivedSpecialties(L(["Acting Schools"])), []);
  assert.deepEqual(derivedSpecialties(L(["Self-Tape Support"])), []);
});

test("stored specialties are preserved, canonicalised and de-duplicated with derived ones", () => {
  const l = L(["Improv Classes", "Audition Prep"], ["improv", "Private Coaching", "audition coaching", "Pre-Readers", "Totally Custom Tag"]);
  assert.deepEqual(editableSpecialties(l), ["Improv", "Private Coaching", "Audition Coaching", "Pre-Readers", "Totally Custom Tag"]);
  assert.equal(new Set(editableSpecialties(l).map((s) => s.toLowerCase())).size, editableSpecialties(l).length);
  // ...but the PUBLIC view only exposes the approved vocabulary of the category
  assert.deepEqual(specialtiesForListing(l, "acting-training"), ["Audition Coaching", "Improv"]);
});

test("specialty options depend on the selected category", () => {
  assert.ok(specialtyOptionsFor(["acting-training"]).includes("Audition Coaching"));
  assert.ok(!specialtyOptionsFor(["acting-training"]).includes("Self-Tape Studio"));
  assert.deepEqual(specialtyOptionsFor(["self-tape-services"]), ["Self-Tape Studio", "Professional Reader", "Self-Tape Feedback", "Audition Recording"]);
  assert.deepEqual(specialtyOptionsFor(["talent-agents"]), []);
  assert.ok(specialtyOptionsFor(["acting-training", "self-tape-services"]).length > specialtyOptionsFor(["acting-training"]).length);
});

test("filter match sets include every legacy name and UUID for a consolidated category", () => {
  const ref = resolveCategoryRef("acting-training");
  const m = matchSetsFor(ref)!;
  for (const n of ["actingclassescoaches", "actingschools", "auditionprep", "improvclasses", "theatretraining", "voiceoversupport", "vocalcoaches", "dialectcoach", "actingtraining"]) assert.ok(m.names.has(n), n);
  assert.equal(m.ids.size, 8);
  assert.equal(matchSetsFor({ kind: "unknown" }), null);
});

test("counts: distinct listings per primary; multi-category listings count in each", () => {
  const c = countByPrimary([corey, wholehearted, reader101, stone, mh, aircheck, L(["Talent Agents"]), L(null), L([])]);
  assert.equal(c["acting-training"], 3); // corey, wholehearted, reader101
  assert.equal(c["self-tape-services"], 2); // wholehearted, reader101
  assert.equal(c["career-coaching-consulting"], 1);
  assert.equal(c["talent-agents"], 1);
  // listings only in retired / unmapped / empty categories add to no primary count
  // (they still exist and remain findable through general search)
  const total = Object.values(c).reduce((x, y) => x + y, 0);
  // corey 1 + wholehearted 5 (spans five primaries) + reader101 2 + one agent 1
  assert.equal(total, 1 + 5 + 2 + 1);
});

test("specialty counts for facets: approved labels only, counted in the category's own context", () => {
  const sc = specialtyCounts([L(["Improv Classes"]), L(["Improv Classes", "Audition Prep"]), L(["Acting Schools"], ["Private Coaching"])], "acting-training");
  assert.deepEqual(sc, [{ name: "Improv", count: 2 }, { name: "Audition Coaching", count: 1 }]); // Private Coaching is not approved
  // a lone label is not a useful filter
  assert.deepEqual(specialtyCounts([L(["Improv Classes"]), L(["Acting Schools"])], "acting-training"), []);
});

test("synonyms fold into ONE filter (Audition Prep + Audition Coaching)", () => {
  const a = L(["Audition Prep"]);
  const b = L(["Acting Classes & Coaches"], ["Audition Coaching"]);
  const c = L(["Acting Classes & Coaches"], ["audition preparation", "Audition Prep"]);
  for (const l of [a, b, c]) assert.deepEqual(specialtiesForListing(l, "acting-training"), ["Audition Coaching"]);
  assert.deepEqual(specialtyCounts([a, b, c, L(["Improv Classes"]), L(["Improv Classes"])], "acting-training"), [{ name: "Audition Coaching", count: 3 }, { name: "Improv", count: 2 }]);
  assert.equal(resolveSpecialty("acting-training", "Audition Prep"), "Audition Coaching");
  assert.equal(resolveSpecialty("acting-training", "Career Strategy"), null);
});

test("NO LEAKAGE: another category's tags never appear as filters of this one", () => {
  const actorsite = L(["Acting Classes & Coaches", "Audition Prep", "Career Consulting", "Business of Acting", "Actor Websites", "Stylists", "Improv Classes", "Comedy Coaches", "Self-Tape Support"], ["5-8", "Los Angeles", "Online", "Self-Tapes"]);
  assert.deepEqual(specialtiesForListing(actorsite, "acting-training"), ["Audition Coaching", "Improv"]);
  assert.deepEqual(specialtiesForListing(actorsite, "career-coaching-consulting"), ["Career Strategy", "Business of Acting"]);
  assert.deepEqual(specialtiesForListing(actorsite, "actor-marketing-services"), ["Actor Websites", "Styling"]);
  const facets = specialtyCounts([actorsite, L(["Improv Classes"]), L(["Audition Prep"])], "acting-training").map((f) => f.name);
  for (const bad of ["Career Strategy", "Business of Acting", "Actor Websites", "Personal Branding", "Personal Styling", "5-8", "Online", "Los Angeles", "Self-Tapes"]) {
    assert.ok(!facets.includes(bad), bad);
  }
  // not a member of the primary -> nothing
  assert.deepEqual(specialtiesForListing(L(["Headshot Photographers"], ["Improv"]), "acting-training"), []);
});

test("attributes are not specialties: ages, places, formats are never in any vocabulary", () => {
  const attr = /^(ages?\b|\d|online|in-person|in person|virtual|hybrid|remote|los angeles|new york|pre-readers|private coaching|group classes)/i;
  for (const p of PRIMARY_CATEGORIES) {
    for (const label of p.specialties) assert.ok(!attr.test(label), `${p.slug}: ${label}`);
    for (const alts of Object.values(p.aliases ?? {})) for (const a of alts) assert.ok(!attr.test(a), `${p.slug}: ${a}`);
    // every alias target and derive target is an approved label
    for (const label of Object.keys(p.aliases ?? {})) assert.ok(p.specialties.includes(label), `${p.slug} alias ${label}`);
    for (const label of Object.values(p.derive)) assert.ok(p.specialties.includes(label), `${p.slug} derive ${label}`);
  }
});

test("categories without meaningful specialty data show no filters", () => {
  for (const slug of ["talent-agents", "talent-managers", "influencer-agents", "background-casting", "child-advocacy", "set-teachers", "set-sitters"]) {
    const p = getPrimaryBySlug(slug)!;
    assert.deepEqual(p.specialties, [], slug);
    assert.deepEqual(specialtyCounts([L([p.legacyNames[0]], ["Improv", "Audition Coaching"]), L([p.legacyNames[0]])], slug), [], slug);
  }
  // vocab exists but nothing stored -> no chips (headshots, self-tape)
  assert.deepEqual(specialtyCounts([L(["Headshot Photographers"]), L(["Headshot Photographers"])], "headshot-photographers"), []);
  assert.deepEqual(specialtyCounts([L(["Self-Tape Support"], ["Self-Tapes"]), L(["Self-Tape Support"])], "self-tape-services"), []);
});

test("chip count == filtered result count (same lookup powers both)", () => {
  const pool = [
    L(["Audition Prep"]), L(["Acting Classes & Coaches"], ["Audition Coaching"]), L(["Improv Classes", "Audition Prep"]),
    L(["Dialect Coach"]), L(["Dialect Coach", "Career Consulting"]), L(["Theatre Training"]), L(["Acting Schools"]),
  ];
  const facets = specialtyCounts(pool, "acting-training");
  assert.ok(facets.length >= 2);
  for (const f of facets) {
    const results = pool.filter((l) => specialtiesForListing(l, "acting-training").includes(f.name));
    assert.equal(results.length, f.count, f.name);
  }
});

test("picker: toggling never touches retired/unmapped values; off removes only that primary's values", () => {
  const names = ["Acting Classes & Coaches", "Audition Prep", "Mental Health for Performers", "Aircheck"];
  assert.deepEqual(selectedPrimarySlugs(names), ["acting-training"]);
  const off = togglePrimaryInNames(names, "acting-training", false);
  assert.deepEqual(off, ["Mental Health for Performers", "Aircheck"]);
  const onAgain = togglePrimaryInNames(off, "acting-training", true);
  assert.deepEqual(onAgain, ["Mental Health for Performers", "Aircheck", "Acting Training"]);
  assert.deepEqual(selectedPrimarySlugs(onAgain), ["acting-training"]);
  // already covered by a legacy name -> not duplicated
  assert.deepEqual(togglePrimaryInNames(names, "acting-training", true), names);
  // explicit owner removal of a retired value
  assert.deepEqual(removeStoredValue(names, "Mental Health for Performers"), ["Acting Classes & Coaches", "Audition Prep", "Aircheck"]);
});

test("new primary NAMES saved by the picker are read back as that primary", () => {
  for (const c of PRIMARY_CATEGORIES) {
    assert.equal(primaryForValue(c.name), c);
    assert.deepEqual(primariesForListing({ categories: [c.name] }), [c]);
  }
});

test("primary_category_id (when valid) takes the first slot", () => {
  const l = { categories: ["Headshot Photographers", "Stylists"], primary_category_id: "7a6327b8-3de1-4c68-93ad-8927477cb9b3" };
  assert.deepEqual(primariesForListing(l).map((p) => p.slug), ["actor-marketing-services", "headshot-photographers"]);
});

test("legacy redirect table: generated JSON is in sync; consolidated slugs hit primaries; retired/primary slugs never redirect", () => {
  const table = legacyRedirectTable();
  const generated = JSON.parse(
    readFileSync(join(__dirname, "../src/lib/category-redirects.generated.json"), "utf8"),
  );
  assert.deepEqual(generated, table, "run `npm run gen:category-redirects`");
  const to = (from: string) => table.find((r) => r.from === from)?.to;
  assert.equal(to("/category/acting-classes-coaches"), "/category/acting-training");
  assert.equal(to("/category/audition-prep"), "/category/acting-training?specialty=Audition%20Coaching");
  assert.equal(to("/category/self-tape-support"), "/category/self-tape-services");
  assert.equal(to("/category/reel-editors"), "/category/demo-reels-editing?specialty=Reel%20Editing");
  for (const r of ["talent-showcases", "mental-health-for-performers", "casting-workshops"]) {
    assert.equal(to(`/category/${r}`), undefined, `${r} must not redirect`);
  }
  for (const c of PRIMARY_CATEGORIES) assert.equal(to(`/category/${c.slug}`), undefined);
  assert.equal(new Set(table.map((r) => r.from)).size, table.length);
});

console.log(`\n${passed} tests passed`);
