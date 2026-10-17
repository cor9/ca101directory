import assert from "node:assert/strict";
import { pickUserUpdatableFields } from "@/lib/auth/user-updatable-fields";
import { shouldPromoteToVendor } from "@/lib/auth/vendor-promotion";
import {
  canPurchaseProForListing,
  canSubmitEditToListing,
  canUpdateListing,
} from "@/lib/listings/listing-ownership";
import {
  VENDOR_EDITABLE_LISTING_FIELDS,
  pickVendorEditableFields,
} from "@/lib/listings/vendor-editable-fields";
import {
  MAX_UPLOAD_BYTES,
  validateImageUpload,
} from "@/lib/uploads/image-validation";

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

// canUpdateListing — the ownership gate in updateListing() that stops a
// vendor from editing someone else's listing (required test-matrix row:
// "Vendor edits another listing -> Rejected").
test("canUpdateListing: owner may edit their own listing", () => {
  assert.equal(
    canUpdateListing({
      isAdmin: false,
      listingOwnerId: "user-1",
      currentUserId: "user-1",
    }),
    true,
  );
});

test("canUpdateListing: a vendor editing another vendor's listing is rejected", () => {
  assert.equal(
    canUpdateListing({
      isAdmin: false,
      listingOwnerId: "user-1",
      currentUserId: "user-2",
    }),
    false,
  );
});

test("canUpdateListing: an unclaimed listing (owner_id null) may not be edited by a non-owner", () => {
  assert.equal(
    canUpdateListing({
      isAdmin: false,
      listingOwnerId: null,
      currentUserId: "user-2",
    }),
    false,
  );
});

test("canUpdateListing: admins may edit any listing regardless of owner", () => {
  assert.equal(
    canUpdateListing({
      isAdmin: true,
      listingOwnerId: "someone-else",
      currentUserId: "admin-1",
    }),
    true,
  );
});

// canSubmitEditToListing — submitToSupabase's ownership gate, the one
// found to have NO authentication requirement at all for its "editing an
// unclaimed listing" allowance (independent follow-up audit, Task 1: an
// anonymous visitor who knew an unclaimed listing's id could edit its
// content with zero login).
test("canSubmitEditToListing: a signed-out visitor is rejected even for an unclaimed listing", () => {
  assert.equal(
    canSubmitEditToListing({
      listingOwnerId: null,
      listingIsClaimed: false,
      currentUserId: null,
    }),
    false,
  );
  assert.equal(
    canSubmitEditToListing({
      listingOwnerId: null,
      listingIsClaimed: false,
      currentUserId: undefined,
    }),
    false,
  );
});

test("canSubmitEditToListing: a logged-in user may edit an unclaimed listing", () => {
  assert.equal(
    canSubmitEditToListing({
      listingOwnerId: null,
      listingIsClaimed: false,
      currentUserId: "user-1",
    }),
    true,
  );
});

test("canSubmitEditToListing: a logged-in user may edit their own listing", () => {
  assert.equal(
    canSubmitEditToListing({
      listingOwnerId: "user-1",
      listingIsClaimed: true,
      currentUserId: "user-1",
    }),
    true,
  );
});

test("canSubmitEditToListing: Vendor A may not edit Vendor B's already-claimed listing", () => {
  assert.equal(
    canSubmitEditToListing({
      listingOwnerId: "vendor-B",
      listingIsClaimed: true,
      currentUserId: "vendor-A",
    }),
    false,
  );
});

// pickUserUpdatableFields — defense in depth so updateUser() (settings /
// display name) can never be used to change `role` or any other field
// beyond full_name, regardless of what a caller passes (independent
// follow-up audit, Task 1).
test("pickUserUpdatableFields: strips role from the update payload", () => {
  const out = pickUserUpdatableFields({
    full_name: "New Name",
    role: "admin",
  });
  assert.equal(out.full_name, "New Name");
  assert.ok(!("role" in out), "role must not survive the allowlist");
});

test("pickUserUpdatableFields: fields absent from the payload stay absent", () => {
  const out = pickUserUpdatableFields({});
  assert.ok(!("full_name" in out));
});

// canPurchaseProForListing — the /api/create-checkout-session gate
// closing the IDOR found during Task 2's audit: paying for Pro on an
// arbitrary listing with no ownership or claim-token check.
test("canPurchaseProForListing: a vendor may purchase Pro for their own listing with no token", () => {
  assert.equal(
    canPurchaseProForListing({
      listingOwnerId: "vendor-A",
      currentUserId: "vendor-A",
      hasValidClaimToken: false,
    }),
    true,
  );
});

test("canPurchaseProForListing: Vendor A cannot purchase Pro for Vendor B's already-claimed listing, even with a token", () => {
  assert.equal(
    canPurchaseProForListing({
      listingOwnerId: "vendor-B",
      currentUserId: "vendor-A",
      hasValidClaimToken: true,
    }),
    false,
  );
});

test("canPurchaseProForListing: an unclaimed listing requires a valid claim token", () => {
  assert.equal(
    canPurchaseProForListing({
      listingOwnerId: null,
      currentUserId: "vendor-A",
      hasValidClaimToken: false,
    }),
    false,
    "no token, no ownership -> rejected",
  );
  assert.equal(
    canPurchaseProForListing({
      listingOwnerId: null,
      currentUserId: "vendor-A",
      hasValidClaimToken: true,
    }),
    true,
    "a valid matching token unlocks an unclaimed listing",
  );
});

// validateImageUpload — the one pure, independently-verifiable piece of
// /api/upload (Task 3's "Profile Edit & Image Upload" step; the actual
// Supabase Storage call isn't exercised in this environment — see the
// e2e harness's doc comment for why).
test("validateImageUpload: accepts a normal JPEG under the size limit", () => {
  const result = validateImageUpload({
    size: 2 * 1024 * 1024,
    type: "image/jpeg",
    name: "headshot.jpg",
  });
  assert.equal(result.valid, true);
});

test("validateImageUpload: rejects a file over the 10MB limit", () => {
  const result = validateImageUpload({
    size: MAX_UPLOAD_BYTES + 1,
    type: "image/jpeg",
    name: "huge.jpg",
  });
  assert.equal(result.valid, false);
  if (!result.valid) assert.equal(result.reason, "too_large");
});

test("validateImageUpload: rejects an unsupported type", () => {
  const result = validateImageUpload({
    size: 1000,
    type: "application/pdf",
    name: "resume.pdf",
  });
  assert.equal(result.valid, false);
  if (!result.valid) assert.equal(result.reason, "unsupported_type");
});

test("validateImageUpload: accepts HEIC by extension even with a generic MIME type", () => {
  const result = validateImageUpload({
    size: 1000,
    type: "application/octet-stream",
    name: "IMG_1234.HEIC",
  });
  assert.equal(result.valid, true);
});

console.log(`\n${passed} passed`);
