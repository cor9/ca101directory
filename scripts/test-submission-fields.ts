import assert from "node:assert/strict";
import {
  categoryRequirementErrors,
  cleanServiceAreas,
  isCaliforniaState,
  showLicensing,
  submissionProfile,
} from "../src/lib/submission-fields";
import { SubmitSchema } from "../src/lib/schemas";
import { listingMatchesLocation, resolveLocationFilter } from "../src/lib/directory-search";

let passed = 0;
const test = (name: string, fn: () => void) => {
  fn();
  passed++;
  console.log(`ok - ${name}`);
};

test("mode and labels follow the selected category", () => {
  const p = (c: string) => submissionProfile([c]);
  assert.equal(p("Acting Training").mode, "service");
  assert.equal(p("Headshot Photographers").descriptionLabel, "What You Offer");
  assert.equal(p("Talent Agents").descriptionLabel, "About Your Agency");
  assert.equal(p("Talent Managers").descriptionLabel, "About Your Management Company");
  assert.equal(p("Background Casting").descriptionLabel, "Company Information");
  assert.equal(p("Set Teachers").descriptionLabel, "Professional Information");
  assert.equal(p("Child Advocacy").descriptionLabel, "Professional Information");
  assert.equal(p("Talent Agents").specialtyLabel, "Representation type");
  assert.equal(p("Audition Prep").mode, "service"); // legacy name resolves
  assert.equal(submissionProfile([]).mode, "none");
  // multi-category: services questions win if any selected category is a service
  assert.equal(submissionProfile(["Talent Agents", "Acting Training"]).requireFormat, true);
});

test("service format / region are required ONLY for services", () => {
  for (const c of ["Talent Agents", "Talent Managers", "Influencer Agents", "Background Casting", "Child Advocacy", "Set Teachers"]) {
    const prof = submissionProfile([c]);
    assert.equal(prof.requireFormat, false, c);
    assert.deepEqual(categoryRequirementErrors(prof, { format: [], region: [] }), {}, c);
  }
  for (const c of ["Acting Training", "Headshot Photographers", "Self-Tape Services"]) {
    const errs = categoryRequirementErrors(submissionProfile([c]), { format: [], region: [] });
    assert.ok(errs.format && errs.region, c);
    assert.deepEqual(categoryRequirementErrors(submissionProfile([c]), { format: ["online"], region: ["West Coast"] }), {});
  }
});

test("schema accepts an agency without format / region and keeps specialties + extra cities", () => {
  const base = { name: "X", link: "", email: "a@b.co", city: "LA", state: "CA", plan: "Free" as const, categories: ["Talent Agents"] };
  const r = SubmitSchema.parse({ ...base, format: [], region: [], specialties: ["Commercial"], serviceAreas: [{ city: "Decatur", state: "GA" }] });
  assert.deepEqual(r.region, []);
  assert.deepEqual(r.specialties, ["Commercial"]);
  assert.equal(r.serviceAreas?.length, 1);
  assert.doesNotThrow(() => SubmitSchema.parse({ ...base })); // both omitted
});

test("California licensing: only where it can apply, never hiding existing answers", () => {
  const svc = submissionProfile(["Acting Training"]);
  assert.equal(showLicensing({ profile: svc, state: "CA" }), true);
  assert.equal(showLicensing({ profile: svc, state: "California" }), true);
  assert.equal(showLicensing({ profile: svc, state: "NY" }), false);
  for (const c of ["Talent Agents", "Talent Managers", "Set Teachers", "Background Casting", "Child Advocacy"]) {
    assert.equal(showLicensing({ profile: submissionProfile([c]), state: "CA" }), false, c);
  }
  assert.equal(showLicensing({ profile: submissionProfile(["Set Teachers"]), state: "TX", hasExistingAnswer: true }), true);
  assert.equal(isCaliforniaState(" ca. "), true);
});

test("service areas are cleaned, de-duplicated and capped", () => {
  const rows = [{ city: " Decatur ", state: "GA" }, { city: "decatur", state: "ga" }, { city: "", state: "GA" }, { city: "Marietta", state: "GA", zip: "30060" }];
  assert.deepEqual(cleanServiceAreas(rows), [{ city: "Decatur", state: "GA", zip: "" }, { city: "Marietta", state: "GA", zip: "30060" }]);
  assert.equal(cleanServiceAreas(Array.from({ length: 40 }, (_, i) => ({ city: `C${i}`, state: "GA" })), 15).length, 15);
  assert.equal(cleanServiceAreas(Array.from({ length: 5 }, (_, i) => ({ city: `C${i}`, state: "GA" })), 2).length, 2);
  assert.deepEqual(cleanServiceAreas(null), []);
});

test("a set teacher is found in every city they list, not only the home city", () => {
  const teacher = { city: "Atlanta", state: "GA", secondary_locations: cleanServiceAreas([{ city: "Decatur", state: "GA" }, { city: "Marietta", state: "GA" }]) };
  const at = (city: string, state: string) => listingMatchesLocation(teacher, resolveLocationFilter({ city, state }).location!);
  assert.ok(at("Atlanta", "GA") && at("Decatur", "GA") && at("Marietta", "Georgia"));
  assert.ok(!at("Savannah", "GA"));
});

console.log(`\n${passed} tests passed`);
