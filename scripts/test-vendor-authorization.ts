import assert from "node:assert/strict";
import { shouldPromoteToVendor } from "@/lib/auth/vendor-promotion";
import {
  VENDOR_EDITABLE_LISTING_FIELDS,
  pickVendorEditableFields,
} from "@/lib/listings/vendor-editable-fields";

let passed = 0;
function test(name: string, fn: () => void) {
  fn();
  passed++;
  console.log(`ok - ${name}`);
}

// pickVendorEditableFields — the fix for the updateListing privilege
// escalation (recovery audit, Phase 1A Task 2).
test("pickVendorEditableFields: strips plan from a vendor's payload", () => {
  const out = pickVendorEditableFields({
    listing_name: "Acme Coaching",
    plan: "Pro",
  });
  assert.equal(out.listing_name, "Acme Coaching");
  assert.ok(!("plan" in out), "plan must not survive the allowlist");
});

test("pickVendorEditableFields: strips featured from a vendor's payload", () => {
  const out = pickVendorEditableFields({ listing_name: "X", featured: true });
  assert.ok(!("featured" in out), "featured must not survive the allowlist");
});

test("pickVendorEditableFields: strips is_approved_101 from a vendor's payload", () => {
  const out = pickVendorEditableFields({
    listing_name: "X",
    is_approved_101: true,
  });
  assert.ok(
    !("is_approved_101" in out),
    "is_approved_101 must not survive the allowlist",
  );
});

test("pickVendorEditableFields: strips status and is_active (dedicated publish/unpublish actions own these)", () => {
  const out = pickVendorEditableFields({
    listing_name: "X",
    status: "Live",
    is_active: true,
  });
  assert.ok(!("status" in out));
  assert.ok(!("is_active" in out));
});

test("pickVendorEditableFields: strips is_claimed and owner_id-shaped keys", () => {
  const out = pickVendorEditableFields({
    listing_name: "X",
    is_claimed: true,
    owner_id: "some-other-user-id",
  });
  assert.ok(!("is_claimed" in out));
  assert.ok(!("owner_id" in out));
});

test("pickVendorEditableFields: passes through every declared vendor-editable field unchanged", () => {
  const input: Record<string, unknown> = {};
  for (const field of VENDOR_EDITABLE_LISTING_FIELDS) {
    input[field] = `value-for-${field}`;
  }
  const out = pickVendorEditableFields(input);
  for (const field of VENDOR_EDITABLE_LISTING_FIELDS) {
    assert.equal(out[field], `value-for-${field}`);
  }
  assert.equal(
    Object.keys(out).length,
    VENDOR_EDITABLE_LISTING_FIELDS.length,
    "no extra fields should appear",
  );
});

test("pickVendorEditableFields: fields absent from the payload stay absent (no null-filling)", () => {
  const out = pickVendorEditableFields({ listing_name: "X" });
  assert.ok(!("website" in out));
  assert.ok(!("gallery" in out));
});

// shouldPromoteToVendor — the fix for parent/guest accounts claiming a
// listing and then being unable to edit it (recovery audit, Phase 1B
// Task 4).
test("shouldPromoteToVendor: parent accounts are promoted", () => {
  assert.equal(shouldPromoteToVendor("parent"), true);
});

test("shouldPromoteToVendor: guest / missing role accounts are promoted", () => {
  assert.equal(shouldPromoteToVendor("guest"), true);
  assert.equal(shouldPromoteToVendor(null), true);
  assert.equal(shouldPromoteToVendor(undefined), true);
  assert.equal(shouldPromoteToVendor(""), true);
});

test("shouldPromoteToVendor: vendor accounts are left alone (not re-promoted)", () => {
  assert.equal(shouldPromoteToVendor("vendor"), false);
});

test("shouldPromoteToVendor: admin and rep accounts are never demoted to vendor", () => {
  assert.equal(shouldPromoteToVendor("admin"), false);
  assert.equal(shouldPromoteToVendor("rep"), false);
});

console.log(`\n${passed} passed`);
