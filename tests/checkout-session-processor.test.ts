import { describe, expect, it, vi } from "vitest";
import type Stripe from "stripe";
import { processCheckoutSessionCompleted } from "@/lib/stripe/checkout-session-processor";

type ListingRecord = {
  id: string;
  owner_id?: string | null;
  plan?: string | null;
  listing_name?: string | null;
  pending_claim_email?: string | null;
};

type ProfileRecord = {
  id: string;
  email: string;
};

type SupabaseOperations = {
  listingUpdates: Array<{ id: string; payload: Record<string, unknown> }>;
  profileUpdates: Array<{ id: string; payload: Record<string, unknown> }>;
  claims: Array<Record<string, unknown>>;
  pendingUpdates: Array<{ id: string; payload: Record<string, unknown> }>;
};

type SupabaseStubConfig = {
  listing: ListingRecord;
  profile: ProfileRecord;
  pendingListingMatch?: ListingRecord | null;
};

function createSupabaseStub(config: SupabaseStubConfig) {
  const operations: SupabaseOperations = {
    listingUpdates: [],
    profileUpdates: [],
    claims: [],
    pendingUpdates: [],
  };

  const supabase = {
    from(table: string) {
      if (table === "listings") {
        return {
          select(columns: string) {
            if (columns.includes("owner_id") && !columns.includes("pending_claim_email")) {
              return {
                eq: (_col: string, value: string) => ({
                  async single() {
                    if (value === config.listing.id && config.listing.owner_id) {
                      return { data: { owner_id: config.listing.owner_id }, error: null };
                    }
                    return { data: null, error: new Error("not found") };
                  },
                }),
              };
            }

            if (columns.includes("listing_name")) {
              return {
                eq: (_col: string, value: string) => ({
                  async single() {
                    if (value === config.listing.id) {
                      return {
                        data: { listing_name: config.listing.listing_name ?? "Test Listing" },
                        error: null,
                      };
                    }
                    return { data: null, error: new Error("not found") };
                  },
                }),
              };
            }

            if (columns.includes("pending_claim_email")) {
              return {
                ilike: (_col: string, value: string) => ({
                  limit: (_count: number) => ({
                    async then(resolve: any) {
                      const match =
                        config.pendingListingMatch &&
                        config.pendingListingMatch.pending_claim_email?.toLowerCase() === value.toLowerCase()
                          ? [config.pendingListingMatch]
                          : [];
                      resolve({ data: match, error: null });
                    },
                  }),
                }),
              };
            }

            throw new Error(`Unhandled select columns for listings: ${columns}`);
          },
          update(payload: Record<string, unknown>) {
            return {
              eq: (_col: string, id: string) => ({
                async select() {
                  if (payload.pending_claim_email) {
                    operations.pendingUpdates.push({ id, payload });
                  } else {
                    operations.listingUpdates.push({ id, payload });
                  }
                  return { data: [payload], error: null };
                },
              }),
            };
          },
        };
      }

      if (table === "profiles") {
        return {
          select(_columns: string) {
            return {
              eq: (_col: string, idOrEmail: string) => ({
                async single() {
                  if (
                    idOrEmail === config.profile.id ||
                    idOrEmail.toLowerCase() === config.profile.email.toLowerCase()
                  ) {
                    return { data: { id: config.profile.id }, error: null };
                  }
                  return { data: null, error: new Error("not found") };
                },
              }),
            };
          },
          update(payload: Record<string, unknown>) {
            return {
              eq: (_col: string, id: string) => ({
                async select() {
                  operations.profileUpdates.push({ id, payload });
                  return { data: [payload], error: null };
                },
              }),
            };
          },
        };
      }

      if (table === "claims") {
        return {
          async insert(payload: Record<string, unknown>) {
            operations.claims.push(payload);
            return { error: null };
          },
        };
      }

      if (table === "auth.users") {
        return {
          select(_columns: string) {
            return {
              eq: (_col: string, id: string) => ({
                async single() {
                  if (id === config.profile.id) {
                    return { data: { id, email: config.profile.email }, error: null };
                  }
                  return { data: null, error: new Error("not found") };
                },
              }),
            };
          },
        };
      }

      throw new Error(`Unhandled table: ${table}`);
    },
  };

  return { supabase: supabase as any, operations };
}

function createStripeStub(): Stripe {
  return {
    checkout: {
      sessions: {
        async listLineItems() {
          return { data: [] };
        },
      },
    },
  } as unknown as Stripe;
}

describe("processCheckoutSessionCompleted", () => {
  it("updates listing and profile when metadata is present", async () => {
    const config: SupabaseStubConfig = {
      listing: { id: "listing_1", owner_id: "vendor_1", plan: null },
      profile: { id: "vendor_1", email: "vendor@example.com" },
    };
    const { supabase, operations } = createSupabaseStub(config);
    const stripe = createStripeStub();
    const notifyAdmin = vi.fn(async () => {});
    const notifyDiscord = vi.fn(async () => {});

    const session = {
      id: "cs_test_123",
      metadata: {
        vendor_id: "vendor_1",
        listing_id: "listing_1",
        plan: "Pro",
        billing_cycle: "monthly",
      },
      customer: "cus_123",
      amount_total: 5000,
      customer_details: {
        email: "vendor@example.com",
        name: "Vendor Test",
      },
      mode: "subscription",
    } as unknown as Stripe.Checkout.Session;

    const outcome = await processCheckoutSessionCompleted(session, {
      supabase,
      stripe,
      notifyAdmin,
      notifyDiscord,
    });

    expect(outcome.type).toBe("processed");
    expect(operations.listingUpdates).toHaveLength(1);
    expect(operations.profileUpdates).toHaveLength(1);
    expect(operations.claims).toHaveLength(1);
    expect(notifyAdmin).toHaveBeenCalledTimes(1);
    expect(notifyDiscord).toHaveBeenCalledTimes(1);
  });

  it("matches pending_claim_email when metadata is missing", async () => {
    const pendingListing: ListingRecord = {
      id: "listing_legacy",
      owner_id: "vendor_legacy",
      plan: "Standard",
      pending_claim_email: "legacy@example.com",
    };

    const config: SupabaseStubConfig = {
      listing: pendingListing,
      profile: { id: "vendor_legacy", email: "legacy@example.com" },
      pendingListingMatch: pendingListing,
    };
    const { supabase, operations } = createSupabaseStub(config);
    const stripe = {
      checkout: {
        sessions: {
          async listLineItems() {
            return {
              data: [
                {
                  price: {
                    unit_amount: 2500,
                    recurring: { interval: "month" },
                  },
                },
              ],
            };
          },
        },
      },
    } as unknown as Stripe;
    const notifyAdmin = vi.fn(async () => {});
    const notifyDiscord = vi.fn(async () => {});

    const session = {
      id: "cs_test_legacy",
      metadata: {},
      customer: "cus_legacy",
      amount_total: 2500,
      customer_details: {
        email: "legacy@example.com",
        name: "Legacy Vendor",
      },
      mode: "subscription",
    } as unknown as Stripe.Checkout.Session;

    const outcome = await processCheckoutSessionCompleted(session, {
      supabase,
      stripe,
      notifyAdmin,
      notifyDiscord,
    });

    expect(outcome.type).toBe("processed");
    expect(operations.listingUpdates).toHaveLength(1);
    expect(operations.profileUpdates).toHaveLength(1);
    expect(operations.claims).toHaveLength(1);
  });
});
