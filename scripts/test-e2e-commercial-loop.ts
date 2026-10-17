/**
 * Task 3: an isolated, fixture-driven approximation of the full
 * commercial loop —
 *   1. Vendor registration
 *   2. Listing claim
 *   3. Profile edit & image upload
 *   4. Stripe (test-mode) checkout
 *   5. Webhook fulfillment & Pro activation
 * — chaining the SAME real business-logic functions this audit already
 * unit tests individually, against one shared fake Supabase store, so
 * the composition itself is verified (does step 2's output feed step 3
 * correctly? does step 3's listing still match in step 5?) and not just
 * each step in isolation.
 *
 * WHAT THIS IS NOT, and why — read before trusting this as "it works
 * end to end in production":
 *
 * - No real network. This sandboxed environment has no outbound path to
 *   the live Supabase project (confirmed in the prior recovery session:
 *   `npm run build` fails to prerender pages that fetch live data, with
 *   identical "fetch failed" errors on the untouched original HEAD) and
 *   no Stripe credentials are configured here at all (checked:
 *   STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET are both unset). Every
 *   "database" and "Stripe event" below is the in-memory fake in
 *   scripts/test-helpers/fake-supabase.ts and a plain object literal
 *   shaped like a Stripe event — neither is the real thing.
 * - Registration (step 1) is NOT exercised as code at all. register.ts
 *   calls supabase.auth.signInWithOtp() (a real magic-link email send)
 *   and getUserByEmail() against the real database — there's no
 *   injection seam into either, and adding one was out of scope for
 *   this pass. This script starts from registration's end state (a
 *   profiles row, role "parent", matching what register.ts actually
 *   produces) rather than calling register.ts itself.
 * - Image upload (part of step 3) is NOT exercised past its pure
 *   validation (lib/uploads/image-validation.ts, tested in
 *   scripts/test-webhook-and-ownership.ts). The actual
 *   supabase.storage.from(...).upload(...) call in
 *   app/api/upload/route.ts talks to Supabase Storage, a different API
 *   surface than the Postgres-shaped fake used everywhere else here;
 *   no fake exists for it, so that call is simulated by just assuming
 *   it succeeded and assigning a plausible URL.
 * - Stripe checkout (step 4) is NOT a real Stripe test-mode call. No
 *   Checkout Session is created, no card is entered, no Stripe test
 *   clock is advanced. This script constructs a plain object shaped
 *   like the fields handleCheckoutCompleted actually reads off a real
 *   Stripe.Checkout.Session (payment_status, metadata, subscription,
 *   customer) and feeds it straight to performProFulfillment — this is
 *   "if Stripe told us this checkout completed, does our fulfillment
 *   logic do the right thing", not "does a real checkout complete."
 *
 * What IS genuinely exercised end to end: claim -> edit -> fulfillment,
 * each a real exported function from lib/listings and lib/billing,
 * running against one continuous, mutated fake store — the same
 * functions actions/claim-listing.ts, actions/listings.ts, and
 * app/api/webhook/route.ts call in production, just with the real
 * Supabase client swapped for the fake.
 */
import assert from "node:assert/strict";
import { performProFulfillment } from "@/lib/billing/webhook-core";
import { performListingClaim } from "@/lib/listings/claim-listing-core";
import { performListingUpdate } from "@/lib/listings/update-listing-core";
import { validateImageUpload } from "@/lib/uploads/image-validation";
import { createFakeSupabase } from "./test-helpers/fake-supabase";

let passed = 0;
function step(name: string, assertion: () => void) {
  assertion();
  passed++;
  console.log(`ok - ${name}`);
}

async function run() {
  const db = createFakeSupabase();

  // --- Fixtures: the directory already lists this business, unclaimed
  // (this is how most listings in the live database actually look —
  // confirmed during the original recovery audit). A second, unrelated
  // listing exists too, to prove fulfillment later only touches the one
  // actually purchased.
  db.seed("listings", [
    {
      id: "listing-headshots-by-jordan",
      listing_name: "Headshots by Jordan",
      owner_id: null,
      is_claimed: false,
      plan: "Free",
      what_you_offer: "Basic headshot package.",
      video_url: null,
      profile_image: null,
    },
    {
      id: "listing-unrelated",
      listing_name: "Some Other Vendor",
      owner_id: "someone-else",
      is_claimed: true,
      plan: "Free",
    },
  ]);
  db.seed("claims", []);

  // =========================================================================
  // STEP 1: Vendor registration (fixture only — see module doc comment).
  // register.ts defaults a new account to role "parent" unless ?role=vendor
  // is on the registration link; this starts from that real default.
  // =========================================================================
  db.seed("profiles", [
    { id: "vendor-jordan", email: "jordan@example.com", role: "parent" },
  ]);

  step("fixture: a newly-registered account starts as role=parent", () => {
    assert.equal(db.rows("profiles")[0].role, "parent");
  });

  // =========================================================================
  // STEP 2: Listing claim — actions/claim-listing.ts's real
  // performListingClaim, run against the fake store.
  // =========================================================================
  const claimResult = await performListingClaim(
    db,
    { id: "vendor-jordan", email: "jordan@example.com" },
    "listing-headshots-by-jordan",
  );

  step("claim succeeds and the listing is now owned by the claimant", () => {
    assert.equal(claimResult.success, true);
    assert.equal(
      db.rows("listings")[0].owner_id,
      "vendor-jordan",
      "listing-headshots-by-jordan, not the unrelated listing",
    );
    assert.equal(db.rows("listings")[1].owner_id, "someone-else");
  });

  step(
    "the claim promotes the parent account to vendor (same mechanism as production)",
    () => {
      assert.equal(db.rows("profiles")[0].role, "vendor");
    },
  );

  // =========================================================================
  // STEP 3: Profile edit & image upload.
  // =========================================================================
  const headshotFile = {
    size: 2 * 1024 * 1024, // 2MB
    type: "image/jpeg",
    name: "jordan-headshot.jpg",
  };
  const uploadValidation = validateImageUpload(headshotFile);

  step("the headshot file passes upload validation", () => {
    assert.equal(uploadValidation.valid, true);
  });

  // The real app/api/upload/route.ts would now call Supabase Storage;
  // simulated here as succeeding with a plausible public URL (see
  // module doc comment — this is the one part of this step that is
  // NOT independently exercised in this environment).
  const uploadedImageUrl =
    "https://storage.example.supabase.co/listing-images/headshots-by-jordan-123.jpg";

  const editResult = await performListingUpdate(
    db,
    { id: "vendor-jordan", role: "vendor" },
    "listing-headshots-by-jordan",
    {
      listing_name: "Headshots by Jordan Chen",
      what_you_offer:
        "Professional headshots for child actors, SAG-AFTRA friendly.",
      video_url: "https://youtu.be/sample-reel",
      profile_image: uploadedImageUrl,
      // A real client payload could ALSO try to set these — proving the
      // allowlist from Task 1 holds even inside this full loop, not just
      // in its own isolated test.
      plan: "Pro",
      featured: true,
      is_approved_101: true,
    },
  );

  step("the edit succeeds and the vendor's real content changes land", () => {
    assert.equal(editResult.status, "success");
    const row = db.rows("listings")[0];
    assert.equal(row.listing_name, "Headshots by Jordan Chen");
    assert.equal(
      row.what_you_offer,
      "Professional headshots for child actors, SAG-AFTRA friendly.",
    );
    assert.equal(row.video_url, "https://youtu.be/sample-reel");
    assert.equal(row.profile_image, uploadedImageUrl);
  });

  step(
    "...but plan/featured/is_approved_101 in that same payload were stripped, not applied",
    () => {
      const row = db.rows("listings")[0];
      assert.equal(
        row.plan,
        "Free",
        "still Free -- no payment has happened yet",
      );
      assert.notEqual(row.featured, true);
      assert.notEqual(row.is_approved_101, true);
    },
  );

  // =========================================================================
  // STEP 4: Stripe (test-mode) checkout — simulated, see module doc
  // comment. This is the shape handleCheckoutCompleted actually reads
  // off a real Stripe.Checkout.Session.
  // =========================================================================
  const simulatedCompletedCheckoutSession = {
    id: "cs_test_fake_12345",
    payment_status: "paid" as const,
    metadata: {
      listing_id: "listing-headshots-by-jordan",
      vendor_id: "vendor-jordan",
      plan: "pro",
    },
    client_reference_id: "listing-headshots-by-jordan",
    subscription: "sub_test_fake_67890",
    customer: "cus_test_fake_11111",
    amount_total: 39900,
  };

  step(
    "the simulated checkout session is shaped the way the real webhook reads it",
    () => {
      assert.equal(simulatedCompletedCheckoutSession.payment_status, "paid");
      assert.equal(
        simulatedCompletedCheckoutSession.metadata.listing_id,
        "listing-headshots-by-jordan",
      );
    },
  );

  // =========================================================================
  // STEP 5: Webhook fulfillment & Pro activation — the real
  // performProFulfillment from lib/billing/webhook-core.ts (the same
  // function app/api/webhook/route.ts's handleCheckoutCompleted calls).
  // =========================================================================
  const fulfillmentResult = await performProFulfillment(db, {
    listingId: simulatedCompletedCheckoutSession.metadata.listing_id,
    vendorId: simulatedCompletedCheckoutSession.metadata.vendor_id,
    stripeSubscriptionId: simulatedCompletedCheckoutSession.subscription,
    stripeCustomerId: simulatedCompletedCheckoutSession.customer,
  });

  step(
    "fulfillment succeeds and grants Pro on exactly the claimed listing",
    () => {
      assert.equal(fulfillmentResult.outcome, "fulfilled");
      const [claimed, unrelated] = db.rows("listings");
      assert.equal(claimed.plan, "Pro");
      assert.equal(claimed.stripe_subscription_id, "sub_test_fake_67890");
      assert.equal(
        unrelated.plan,
        "Free",
        "the unrelated listing owned by someone else must never be touched",
      );
    },
  );

  step(
    "the vendor's own edited content from step 3 survived fulfillment",
    () => {
      const row = db.rows("listings")[0];
      assert.equal(row.listing_name, "Headshots by Jordan Chen");
      assert.equal(row.video_url, "https://youtu.be/sample-reel");
      assert.equal(row.profile_image, uploadedImageUrl);
    },
  );

  step(
    "the full loop, end to end: a brand-new parent account is now a Pro vendor who owns and edited one specific listing",
    () => {
      const row = db.rows("listings")[0];
      const profile = db.rows("profiles")[0];
      assert.equal(profile.role, "vendor");
      assert.equal(profile.subscription_plan, "Pro");
      assert.equal(row.owner_id, "vendor-jordan");
      assert.equal(row.plan, "Pro");
      assert.equal(row.is_claimed, true);
    },
  );

  console.log(`\n${passed} passed`);
}

run();
