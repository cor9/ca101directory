import assert from "node:assert/strict";
import { getAuthSecret, isAuthConfigured, magicLinkSiteUrl } from "../src/lib/auth-config";

let passed = 0;
const test = (name: string, fn: () => void) => {
  fn();
  passed++;
  console.log(`ok - ${name}`);
};

test("auth is configured by AUTH_SECRET or NEXTAUTH_SECRET (same as Auth.js)", () => {
  assert.equal(isAuthConfigured({ AUTH_SECRET: "x" }), true);
  assert.equal(isAuthConfigured({ NEXTAUTH_SECRET: "x" }), true);
  assert.equal(getAuthSecret({ AUTH_SECRET: "a", NEXTAUTH_SECRET: "b" }), "a");
});

test("no secret means NOT configured (security check preserved)", () => {
  assert.equal(isAuthConfigured({}), false);
  assert.equal(isAuthConfigured({ AUTH_SECRET: "", NEXTAUTH_SECRET: "" }), false);
  assert.equal(isAuthConfigured({ AUTH_URL: "https://x" }), false);
});

test("magic link origin: production unchanged", () => {
  assert.equal(magicLinkSiteUrl({}), "https://directory.childactor101.com");
  assert.equal(magicLinkSiteUrl({ NEXT_PUBLIC_APP_URL: "https://app.example" }), "https://app.example");
  assert.equal(magicLinkSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://site.example", NEXT_PUBLIC_APP_URL: "https://app.example" }), "https://site.example");
  assert.equal(
    magicLinkSiteUrl({ VERCEL_ENV: "production", VERCEL_URL: "x-abc.vercel.app", NEXT_PUBLIC_SITE_URL: "https://directory.childactor101.com" }),
    "https://directory.childactor101.com",
  );
});

test("magic link origin: preview returns to the preview, only for *.vercel.app", () => {
  assert.equal(
    magicLinkSiteUrl({ VERCEL_ENV: "preview", VERCEL_BRANCH_URL: "ca101directory-git-b-cor9s-projects.vercel.app", VERCEL_URL: "ca101directory-abc.vercel.app", NEXT_PUBLIC_SITE_URL: "https://directory.childactor101.com" }),
    "https://ca101directory-git-b-cor9s-projects.vercel.app",
  );
  assert.equal(magicLinkSiteUrl({ VERCEL_ENV: "preview", VERCEL_URL: "ca101directory-abc.vercel.app" }), "https://ca101directory-abc.vercel.app");
  // anything that is not a vercel.app host falls back to the configured site
  assert.equal(magicLinkSiteUrl({ VERCEL_ENV: "preview", VERCEL_URL: "evil.example.com", NEXT_PUBLIC_SITE_URL: "https://directory.childactor101.com" }), "https://directory.childactor101.com");
});

console.log(`\n${passed} tests passed`);
