import assert from "node:assert/strict";
import {
  computeCommission,
  computeRefundAdjustment,
  resolveAttribution,
} from "@/lib/commission";

let passed = 0;
function test(name: string, fn: () => void) {
  fn();
  passed++;
  console.log(`ok - ${name}`);
}

// computeCommission
test("computeCommission: pro plan at $399/year yields $99.75 (9975 cents)", () => {
  const result = computeCommission("pro", 39900);
  assert.equal(result?.amountCents, 9975);
  assert.equal(result?.tierRate, 0.25);
  assert.equal(result?.priceDrift, false);
});

test("computeCommission: unknown plan returns null (never throws)", () => {
  assert.equal(computeCommission("free", 0), null);
  assert.equal(computeCommission("standard", 25000), null);
  assert.equal(computeCommission("founding", 10100), null);
});

test("computeCommission: flags price drift when sale amount disagrees", () => {
  const result = computeCommission("pro", 50000);
  assert.equal(result?.priceDrift, true);
  assert.equal(result?.amountCents, 12500);
});

// computeRefundAdjustment
test("computeRefundAdjustment: full refund claws back the entire commission", () => {
  assert.equal(computeRefundAdjustment(9975, 39900, 39900), -9975);
});

test("computeRefundAdjustment: partial refund rounds toward the house (floor)", () => {
  // 1/3 refund of a 9975-cent commission -> 3325.0 exactly
  assert.equal(computeRefundAdjustment(9975, 39900, 13300), -3325);
  // a fraction that does NOT divide evenly must floor, not round
  assert.equal(computeRefundAdjustment(9975, 39900, 10000), -2500);
});

// resolveAttribution
test("resolveAttribution: excludes free plan before any attribution lookup", () => {
  const result = resolveAttribution({
    plan: "free",
    comped: false,
    isAdminInitiated: false,
    activeAssignment: null,
    attributionWindowDays: 90,
    now: new Date("2026-07-07"),
  });
  assert.deepEqual(result, { attributed: false, reason: "excluded_free" });
});

test("resolveAttribution: excludes comped listings even with an active assignment", () => {
  const result = resolveAttribution({
    plan: "pro",
    comped: true,
    isAdminInitiated: false,
    activeAssignment: { repId: "rep-1", assignedAt: new Date("2026-06-01") },
    attributionWindowDays: 90,
    now: new Date("2026-07-07"),
  });
  assert.deepEqual(result, { attributed: false, reason: "excluded_comped" });
});

test("resolveAttribution: excludes admin-initiated upgrades", () => {
  const result = resolveAttribution({
    plan: "pro",
    comped: false,
    isAdminInitiated: true,
    activeAssignment: { repId: "rep-1", assignedAt: new Date("2026-06-01") },
    attributionWindowDays: 90,
    now: new Date("2026-07-07"),
  });
  assert.deepEqual(result, { attributed: false, reason: "excluded_admin" });
});

test("resolveAttribution: assignment within window wins over a conflicting link code", () => {
  const result = resolveAttribution({
    plan: "pro",
    comped: false,
    isAdminInitiated: false,
    activeAssignment: { repId: "rep-A", assignedAt: new Date("2026-06-01") },
    attributionWindowDays: 90,
    now: new Date("2026-07-07"),
    repCode: "rep-b-code",
    repCodeLookup: { repId: "rep-B", active: true },
  });
  assert.equal(result.attributed, true);
  if (result.attributed) {
    assert.equal(result.repId, "rep-A");
    assert.equal(result.source, "assignment");
    assert.match(result.note ?? "", /conflicting rep_code/);
  }
});

test("resolveAttribution: assignment older than the window falls through to link", () => {
  const result = resolveAttribution({
    plan: "pro",
    comped: false,
    isAdminInitiated: false,
    activeAssignment: { repId: "rep-A", assignedAt: new Date("2026-01-01") },
    attributionWindowDays: 90,
    now: new Date("2026-07-07"),
    repCode: "rep-b-code",
    repCodeLookup: { repId: "rep-B", active: true },
  });
  assert.deepEqual(result, {
    attributed: true,
    repId: "rep-B",
    source: "link",
  });
});

test("resolveAttribution: no assignment, valid link code -> link attribution", () => {
  const result = resolveAttribution({
    plan: "pro",
    comped: false,
    isAdminInitiated: false,
    activeAssignment: null,
    attributionWindowDays: 90,
    now: new Date("2026-07-07"),
    repCode: "rep-b-code",
    repCodeLookup: { repId: "rep-B", active: true },
  });
  assert.deepEqual(result, {
    attributed: true,
    repId: "rep-B",
    source: "link",
  });
});

test("resolveAttribution: inactive link code falls through to house sale", () => {
  const result = resolveAttribution({
    plan: "pro",
    comped: false,
    isAdminInitiated: false,
    activeAssignment: null,
    attributionWindowDays: 90,
    now: new Date("2026-07-07"),
    repCode: "rep-b-code",
    repCodeLookup: { repId: "rep-B", active: false },
  });
  assert.deepEqual(result, { attributed: false, reason: "house_sale" });
});

test("resolveAttribution: no assignment, no code -> house sale", () => {
  const result = resolveAttribution({
    plan: "pro",
    comped: false,
    isAdminInitiated: false,
    activeAssignment: null,
    attributionWindowDays: 90,
    now: new Date("2026-07-07"),
  });
  assert.deepEqual(result, { attributed: false, reason: "house_sale" });
});

console.log(`\n${passed} passed`);
