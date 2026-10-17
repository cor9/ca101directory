import assert from "node:assert/strict";
import {
  isTerminalSubscriptionStatus,
  performProFulfillment,
  performSubscriptionDowngrade,
  recordCommissionAttribution,
} from "@/lib/billing/webhook-core";
import { performListingClaim } from "@/lib/listings/claim-listing-core";
import { performListingUpdate } from "@/lib/listings/update-listing-core";
import { createFakeSupabase } from "./test-helpers/fake-supabase";

let passed = 0;
function test(name: string, fn: () => void | Promise<void>) {
  const result = fn();
  if (result instanceof Promise) {
    return result.then(() => {
      passed++;
      console.log(`ok - ${name}`);
    });
  }
  passed++;
  console.log(`ok - ${name}`);
  return undefined;
}

async function run() {
  // =========================================================================
  // Task 1 (follow-up audit): performListingUpdate — the full
  // authorization + write path behind updateListing(), exercised end to
  // end against a fake-but-real Supabase query builder (not just the
  // extracted pure helpers). This is the test the task explicitly asked
  // for: proving Vendor A cannot modify Vendor B's listing or its
  // privileged fields, through the actual code path, not a mock of it.
  // =========================================================================

  await test("performListingUpdate: Vendor A cannot edit Vendor B's listing (rejected, no write attempted)", async () => {
    const db = createFakeSupabase();
    db.seed("listings", [
      { id: "listing-B", owner_id: "vendor-B", listing_name: "B's Shop" },
    ]);

    const result = await performListingUpdate(
      db,
      { id: "vendor-A", role: "vendor" },
      "listing-B",
      { listing_name: "Hijacked by A" },
    );

    assert.equal(result.status, "error");
    // The content must be provably untouched, not just "an error was
    // returned" — read the row back rather than trusting the response.
    assert.equal(db.rows("listings")[0].listing_name, "B's Shop");
    // No update call should have reached the database at all for a
    // request rejected at the ownership check.
    assert.equal(db.writesTo("listings").length, 0);
  });

  await test("performListingUpdate: Vendor A CAN edit their own listing's content fields", async () => {
    const db = createFakeSupabase();
    db.seed("listings", [
      { id: "listing-A", owner_id: "vendor-A", listing_name: "Old Name" },
    ]);

    const result = await performListingUpdate(
      db,
      { id: "vendor-A", role: "vendor" },
      "listing-A",
      { listing_name: "New Name" },
    );

    assert.equal(result.status, "success");
    assert.equal(db.rows("listings")[0].listing_name, "New Name");
  });

  await test("performListingUpdate: Vendor A cannot grant themselves Pro/Featured/101-Approved on their OWN listing", async () => {
    const db = createFakeSupabase();
    db.seed("listings", [
      {
        id: "listing-A",
        owner_id: "vendor-A",
        plan: "Free",
        featured: false,
        is_approved_101: false,
      },
    ]);

    const result = await performListingUpdate(
      db,
      { id: "vendor-A", role: "vendor" },
      "listing-A",
      {
        listing_name: "Legit edit",
        plan: "Pro",
        featured: true,
        is_approved_101: true,
        status: "Live",
        is_claimed: true,
      },
    );

    assert.equal(result.status, "success");
    const row = db.rows("listings")[0];
    assert.equal(row.plan, "Free", "plan must not change");
    assert.equal(row.featured, false, "featured must not change");
    assert.equal(row.is_approved_101, false, "is_approved_101 must not change");
    assert.equal(
      row.listing_name,
      "Legit edit",
      "the allowed field DID change",
    );
  });

  await test("performListingUpdate: TOCTOU close — ownership changing between the read and the write is not exploitable", async () => {
    // Simulates the exact race this fix closes: the ownership check
    // reads owner_id = vendor-A (true at read time), but by the time
    // the write executes the row has actually changed owner (e.g. a
    // concurrent claim transferred it). The real Supabase client would
    // reflect this as the UPDATE's .eq("owner_id", actorId) matching
    // zero rows; this fake models that by mutating the row directly
    // between the two phases performListingUpdate itself awaits.
    const db = createFakeSupabase();
    const rows = [
      { id: "listing-A", owner_id: "vendor-A", listing_name: "Original" },
    ];
    db.seed("listings", rows);

    const realFrom = db.from.bind(db);
    let readCount = 0;
    // biome-ignore lint/suspicious/noExplicitAny: test-only monkey-patch to inject a race between the read and the write below.
    (db as any).from = (table: string) => {
      const builder = realFrom(table);
      if (table === "listings") {
        const realSelect = builder.select.bind(builder);
        builder.select = (cols?: string) => {
          const b = realSelect(cols);
          const realSingle = b.single.bind(b);
          b.single = async () => {
            readCount++;
            if (readCount === 1) {
              // After the ownership read resolves (synchronously, before
              // the write fires), flip the row's owner — this is the race.
              rows[0].owner_id = "vendor-C";
            }
            return realSingle();
          };
          return b;
        };
      }
      return builder;
    };

    const result = await performListingUpdate(
      db,
      { id: "vendor-A", role: "vendor" },
      "listing-A",
      { listing_name: "Raced write" },
    );

    assert.equal(
      result.status,
      "error",
      "the write must fail, not silently succeed, once ownership no longer matches",
    );
    assert.equal(
      rows[0].listing_name,
      "Original",
      "content must be unchanged by the raced write",
    );
  });

  await test("performListingUpdate: admin may edit any listing's privileged fields", async () => {
    const db = createFakeSupabase();
    db.seed("listings", [
      { id: "listing-B", owner_id: "vendor-B", plan: "Free", featured: false },
    ]);

    const result = await performListingUpdate(
      db,
      { id: "admin-1", role: "admin" },
      "listing-B",
      { plan: "Pro", featured: true },
    );

    assert.equal(result.status, "success");
    const row = db.rows("listings")[0];
    assert.equal(row.plan, "Pro");
    assert.equal(row.featured, true);
  });

  // =========================================================================
  // performListingClaim — the same class of issue, for the claim flow:
  // Task 1's "Vendor A cannot modify Vendor B's records" extended to "two
  // vendors cannot both successfully claim the same listing."
  // =========================================================================

  function seedClaimDb() {
    const db = createFakeSupabase();
    db.seed("profiles", [
      { id: "vendor-A", role: "parent" },
      { id: "vendor-B", role: "vendor" },
    ]);
    db.seed("listings", [
      {
        id: "listing-1",
        owner_id: null,
        is_claimed: false,
        listing_name: "Unclaimed Shop",
      },
    ]);
    db.seed("claims", []);
    return db;
  }

  await test("performListingClaim: claiming an unclaimed listing succeeds and promotes a parent to vendor", async () => {
    const db = seedClaimDb();
    const result = await performListingClaim(
      db,
      { id: "vendor-A", email: "a@example.com" },
      "listing-1",
    );
    assert.equal(result.success, true);
    if (result.success) {
      assert.equal(result.promotedToVendor, true);
    }
    assert.equal(db.rows("listings")[0].owner_id, "vendor-A");
    assert.equal(db.rows("profiles")[0].role, "vendor");
  });

  await test("performListingClaim: vendor (not parent) claiming is NOT re-promoted", async () => {
    const db = seedClaimDb();
    const result = await performListingClaim(
      db,
      { id: "vendor-B", email: "b@example.com" },
      "listing-1",
    );
    assert.equal(result.success, true);
    if (result.success) {
      assert.equal(result.promotedToVendor, false);
    }
  });

  await test("performListingClaim: Vendor A cannot claim a listing already owned by Vendor B", async () => {
    const db = createFakeSupabase();
    db.seed("profiles", [{ id: "vendor-A", role: "vendor" }]);
    db.seed("listings", [
      { id: "listing-1", owner_id: "vendor-B", is_claimed: true },
    ]);
    db.seed("claims", []);

    const result = await performListingClaim(
      db,
      { id: "vendor-A", email: "a@example.com" },
      "listing-1",
    );

    assert.equal(result.success, false);
    if (!result.success) assert.equal(result.error, "ALREADY_CLAIMED");
    assert.equal(
      db.rows("listings")[0].owner_id,
      "vendor-B",
      "ownership must not change",
    );
  });

  await test("performListingClaim: double-claim race — the second concurrent claim loses, not both", async () => {
    // Simulates two requests that both read is_claimed=false before
    // either writes (the exact race the atomic .eq(\"is_claimed\", false)
    // fix closes): read, read, write, write — rather than the
    // sequential read/write/read/write the single-threaded helper
    // below runs by default.
    const db = seedClaimDb();

    const claimA = performListingClaim(
      db,
      { id: "vendor-A", email: "a@example.com" },
      "listing-1",
    );
    // Both claims read the pre-write state before either's write lands,
    // since performListingClaim's reads all happen before its one write
    // and this fake resolves synchronously within each await.
    const claimB = performListingClaim(
      db,
      { id: "vendor-B", email: "b@example.com" },
      "listing-1",
    );

    const [resultA, resultB] = await Promise.all([claimA, claimB]);
    const outcomes = [resultA.success, resultB.success];

    assert.deepEqual(
      outcomes.filter(Boolean).length,
      1,
      "exactly one of the two concurrent claims must succeed",
    );
    const winner = resultA.success ? "vendor-A" : "vendor-B";
    assert.equal(
      db.rows("listings")[0].owner_id,
      winner,
      "the row's owner must match whichever claim actually won",
    );
  });

  // =========================================================================
  // Task 2: webhook subscription-to-listing association, idempotency,
  // cancellation timing, and before/after migration behavior.
  // =========================================================================

  await test("performProFulfillment: a vendor upgrading one of their two listings only upgrades that one", async () => {
    const db = createFakeSupabase();
    db.seed("listings", [
      { id: "listing-1", owner_id: "vendor-A", plan: "Free" },
      { id: "listing-2", owner_id: "vendor-A", plan: "Free" },
    ]);
    db.seed("profiles", [{ id: "vendor-A", subscription_plan: "Free" }]);

    await performProFulfillment(db, {
      listingId: "listing-1",
      vendorId: "vendor-A",
      stripeSubscriptionId: "sub_111",
      stripeCustomerId: "cus_A",
    });

    const [l1, l2] = db.rows("listings");
    assert.equal(l1.plan, "Pro");
    assert.equal(l1.stripe_subscription_id, "sub_111");
    assert.equal(l2.plan, "Free", "the OTHER listing must be untouched");
    assert.equal(l2.stripe_subscription_id, undefined);
  });

  await test("performSubscriptionDowngrade: canceling one listing's subscription leaves the vendor's other Pro listing alone", async () => {
    const db = createFakeSupabase();
    db.seed("listings", [
      {
        id: "listing-1",
        owner_id: "vendor-A",
        plan: "Pro",
        stripe_subscription_id: "sub_111",
        comped: false,
      },
      {
        id: "listing-2",
        owner_id: "vendor-A",
        plan: "Pro",
        stripe_subscription_id: "sub_222",
        comped: false,
      },
    ]);
    db.seed("profiles", [{ id: "vendor-A", subscription_plan: "Pro" }]);

    const result = await performSubscriptionDowngrade(db, "sub_111");

    assert.deepEqual(result.listingsDowngraded, ["listing-1"]);
    const [l1, l2] = db.rows("listings");
    assert.equal(l1.plan, "Free");
    assert.equal(l1.stripe_subscription_id, null);
    assert.equal(
      l2.plan,
      "Pro",
      "listing-2's own subscription was never canceled",
    );
    assert.equal(l2.stripe_subscription_id, "sub_222");
  });

  await test("performProFulfillment: Vendor A paying for a listing Vendor B already owns is an ownership conflict, not a transfer", async () => {
    const db = createFakeSupabase();
    db.seed("listings", [
      { id: "listing-1", owner_id: "vendor-B", plan: "Free" },
    ]);

    const result = await performProFulfillment(db, {
      listingId: "listing-1",
      vendorId: "vendor-A",
      stripeSubscriptionId: "sub_999",
      stripeCustomerId: "cus_A",
    });

    assert.equal(result.outcome, "ownership_conflict");
    if (result.outcome === "ownership_conflict") {
      assert.equal(result.existingOwnerId, "vendor-B");
    }
    const row = db.rows("listings")[0];
    assert.equal(row.plan, "Free", "plan must not change on a conflict");
    assert.equal(row.owner_id, "vendor-B", "ownership must not transfer");
  });

  await test("performProFulfillment: idempotent — running the same fulfillment twice converges, doesn't compound", async () => {
    const db = createFakeSupabase();
    db.seed("listings", [
      { id: "listing-1", owner_id: "vendor-A", plan: "Free" },
    ]);
    db.seed("profiles", [{ id: "vendor-A", subscription_plan: "Free" }]);

    const params = {
      listingId: "listing-1",
      vendorId: "vendor-A",
      stripeSubscriptionId: "sub_111",
      stripeCustomerId: "cus_A",
    };
    await performProFulfillment(db, params);
    await performProFulfillment(db, params); // Stripe retry of the same event

    assert.equal(db.rows("listings").length, 1, "no duplicate row created");
    assert.equal(db.rows("listings")[0].plan, "Pro");
  });

  await test("recordCommissionAttribution: a retried Stripe event is reported as a duplicate, not inserted twice", async () => {
    const db = createFakeSupabase();
    db.seed("rep_commissions", [], { uniqueColumns: ["stripe_event_id"] });

    const attributionParams = {
      listingId: "listing-1",
      plan: "pro",
      comped: false,
      activeAssignment: {
        repId: "rep-1",
        assignedAt: new Date(Date.now() - 1000),
      },
      repCode: undefined,
      repCodeLookup: null,
      saleAmountCents: 39900,
      stripeEventId: "evt_abc123",
      stripeSessionId: "cs_1",
      stripeSubscriptionId: "sub_111",
      now: new Date(),
    };

    const first = await recordCommissionAttribution(db, attributionParams);
    const second = await recordCommissionAttribution(db, attributionParams);

    assert.equal(first.recorded, true);
    assert.equal(second.recorded, false);
    if (!second.recorded) {
      assert.equal("duplicate" in second, true);
    }
    assert.equal(
      db.rows("rep_commissions").length,
      1,
      "exactly one commission row, not two, for the retried event",
    );
  });

  await test("isTerminalSubscriptionStatus: cancellation timing matches Stripe's lifecycle", () => {
    // Pro access must survive: still-active states, including a
    // cancellation scheduled for period end (status stays \"active\"
    // with cancel_at_period_end: true — not modeled as its own status
    // here since Stripe doesn't expose it as one).
    assert.equal(isTerminalSubscriptionStatus("active"), false);
    assert.equal(isTerminalSubscriptionStatus("trialing"), false);
    assert.equal(
      isTerminalSubscriptionStatus("past_due"),
      false,
      "a payment retry in progress must not pull Pro access early",
    );
    // Pro access must end: genuinely terminal, non-paying states.
    assert.equal(isTerminalSubscriptionStatus("canceled"), true);
    assert.equal(isTerminalSubscriptionStatus("unpaid"), true);
    assert.equal(isTerminalSubscriptionStatus("incomplete_expired"), true);
  });

  await test("performProFulfillment: BEFORE the stripe_subscription_id migration, Pro is still granted (the tracking write no-ops)", async () => {
    const db = createFakeSupabase();
    db.seed(
      "listings",
      [{ id: "listing-1", owner_id: "vendor-A", plan: "Free" }],
      { missingColumns: ["stripe_subscription_id"] },
    );
    db.seed("profiles", [{ id: "vendor-A", subscription_plan: "Free" }]);

    const result = await performProFulfillment(db, {
      listingId: "listing-1",
      vendorId: "vendor-A",
      stripeSubscriptionId: "sub_111",
      stripeCustomerId: "cus_A",
    });

    assert.equal(
      result.outcome,
      "fulfilled",
      "a missing tracking column must never block granting Pro",
    );
    assert.equal(db.rows("listings")[0].plan, "Pro");
    assert.equal(
      db.rows("listings")[0].stripe_subscription_id,
      undefined,
      "the tracking write silently did not land, as expected pre-migration",
    );
  });

  await test("performSubscriptionDowngrade: BEFORE the migration, it no-ops instead of throwing", async () => {
    const db = createFakeSupabase();
    db.seed(
      "listings",
      [{ id: "listing-1", owner_id: "vendor-A", plan: "Pro" }],
      { missingColumns: ["stripe_subscription_id"] },
    );

    const result = await performSubscriptionDowngrade(db, "sub_111");

    assert.equal(result.migrationApplied, false);
    assert.deepEqual(result.listingsDowngraded, []);
    assert.equal(
      db.rows("listings")[0].plan,
      "Pro",
      "nothing was touched — there's no column to look up by yet",
    );
  });

  await test("performSubscriptionDowngrade: a comped listing is never touched by a subscription event", async () => {
    const db = createFakeSupabase();
    db.seed("listings", [
      {
        id: "listing-1",
        owner_id: "vendor-A",
        plan: "Pro",
        stripe_subscription_id: "sub_111",
        comped: true,
      },
    ]);

    const result = await performSubscriptionDowngrade(db, "sub_111");

    assert.deepEqual(result.listingsDowngraded, []);
    assert.deepEqual(result.listingsSkippedAsComped, ["listing-1"]);
    assert.equal(db.rows("listings")[0].plan, "Pro");
  });

  console.log(`\n${passed} passed`);
}

run();
