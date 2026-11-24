import assert from "node:assert/strict";
import { createProCheckoutSession } from "@/lib/billing/checkout-session";

function fakeStripe() {
  const calls: Record<string, unknown>[] = [];
  const stripe = {
    checkout: {
      sessions: {
        create: async (params: Record<string, unknown>) => {
          calls.push(params);
          return { url: "https://checkout.stripe.test/x" };
        },
      },
    },
  };
  // biome-ignore lint/suspicious/noExplicitAny: minimal fake
  return { stripe: stripe as any, calls };
}

const base = {
  priceId: "price_123",
  successUrl: "https://x.test/ok",
  cancelUrl: "https://x.test/no",
  listingId: "l1",
  vendorId: "v1",
};

let passed = 0;
async function test(name: string, fn: () => Promise<void>) {
  await fn();
  passed++;
  console.log(`ok - ${name}`);
}

async function run() {
  await test("existing customer: sends customer only, never customer_email", async () => {
    const { stripe, calls } = fakeStripe();
    await createProCheckoutSession(stripe, {
      ...base,
      customerId: "cus_1",
      email: "a@b.com",
    });
    assert.equal(calls[0].customer, "cus_1");
    assert.ok(!("customer_email" in calls[0]));
    assert.equal(calls[0].allow_promotion_codes, true);
  });

  await test("no customer: sends customer_email only", async () => {
    const { stripe, calls } = fakeStripe();
    await createProCheckoutSession(stripe, { ...base, email: "a@b.com" });
    assert.equal(calls[0].customer_email, "a@b.com");
    assert.ok(!("customer" in calls[0]));
    assert.equal(calls[0].allow_promotion_codes, true);
  });

  await test("neither: sends neither, still allows promo codes", async () => {
    const { stripe, calls } = fakeStripe();
    await createProCheckoutSession(stripe, base);
    assert.ok(!("customer" in calls[0]) && !("customer_email" in calls[0]));
    assert.equal(calls[0].allow_promotion_codes, true);
  });

  console.log(`\n${passed} passed`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
