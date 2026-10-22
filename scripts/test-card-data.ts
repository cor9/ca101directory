import assert from "node:assert/strict";
import { classifyImage, isPhotoCategory, pickCardImage } from "@/lib/card-data";

let passed = 0;
function test(name: string, fn: () => void) {
  fn();
  passed++;
  console.log(`ok - ${name}`);
}

test("primary image wins over gallery and logo", () => {
  const r = pickCardImage({
    profileImageUrl: "https://x/p.jpg",
    galleryUrls: ["https://x/g1.jpg"],
    logoUrl: "https://x/l.png",
    isPro: true,
  });
  assert.deepEqual(r, { url: "https://x/p.jpg", isLogo: false });
});
test("no primary: first gallery image for Pro (never combined)", () => {
  const r = pickCardImage({
    galleryUrls: ["https://x/g1.jpg", "https://x/g2.jpg"],
    logoUrl: "https://x/l.png",
    isPro: true,
  });
  assert.deepEqual(r, { url: "https://x/g1.jpg", isLogo: false });
});
test("gallery is a Pro entitlement: Free falls through to logo", () => {
  const r = pickCardImage({
    galleryUrls: ["https://x/g1.jpg"],
    logoUrl: "https://x/l.png",
    isPro: false,
  });
  assert.deepEqual(r, { url: "https://x/l.png", isLogo: true });
});
test("nothing available -> placeholder (null)", () => {
  assert.deepEqual(
    pickCardImage({ isPro: true, galleryUrls: [], profileImageUrl: " " }),
    { url: null, isLogo: false },
  );
});
test("logo-looking primary image is flagged as a graphic", () => {
  assert.equal(
    pickCardImage({ profileImageUrl: "https://x/acme-logo.png", isPro: false })
      .isLogo,
    true,
  );
  assert.equal(
    pickCardImage({ profileImageUrl: "https://x/mark.svg", isPro: false })
      .isLogo,
    true,
  );
});
test("photographer category: portrait and landscape photos are cropped (cover)", () => {
  const hint = { isLogo: false, photoLed: true };
  assert.deepEqual(classifyImage({ width: 800, height: 1200 }, hint), {
    kind: "photo",
    portrait: true,
  });
  assert.deepEqual(classifyImage({ width: 1600, height: 1000 }, hint), {
    kind: "photo",
    portrait: false,
  });
});
test("logos / extreme aspect ratios are always contained", () => {
  assert.equal(
    classifyImage(
      { width: 1600, height: 1000 },
      { isLogo: true, photoLed: true },
    ).kind,
    "graphic",
  );
  assert.equal(
    classifyImage(
      { width: 2400, height: 600 },
      { isLogo: false, photoLed: true },
    ).kind,
    "graphic",
  ); // banner
  assert.equal(
    classifyImage(
      { width: 400, height: 1400 },
      { isLogo: false, photoLed: false },
    ).kind,
    "graphic",
  ); // tall poster
});
test("other vendors: small/medium image is contained, large real photo is cropped", () => {
  const hint = { isLogo: false, photoLed: false };
  assert.equal(
    classifyImage({ width: 400, height: 400 }, hint).kind,
    "graphic",
  );
  assert.equal(
    classifyImage({ width: 1200, height: 1500 }, hint).kind,
    "photo",
  );
});
test("photo category detection", () => {
  assert.equal(isPhotoCategory("Headshot Photographers"), true);
  assert.equal(isPhotoCategory("Acting Classes & Coaches"), false);
});
console.log(`\n${passed} tests passed`);
