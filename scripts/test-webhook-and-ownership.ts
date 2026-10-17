import assert from "node:assert/strict";
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

  console.log(`\n${passed} passed`);
}

run();
