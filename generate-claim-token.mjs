import crypto from 'crypto';
import 'dotenv/config';

// Generate claim token for Jenn Boyce - The Hollywood Prep
const listingId = 'a8a6ff12-8a9c-4477-854a-73deec1a5c7e';
const ttlSeconds = 60 * 60 * 24 * 14; // 14 days

const secret = process.env.NEXTAUTH_SECRET;
if (!secret) {
  console.error('ERROR: NEXTAUTH_SECRET is not set in .env.local');
  process.exit(1);
}

const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
const payload = JSON.stringify({ lid: listingId, exp });
const payloadB64 = Buffer.from(payload).toString('base64url');
const sig = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');
const token = `${payloadB64}.${sig}`;

const claimUrl = `https://directory.childactor101.com/claim/${token}?lid=${listingId}`;

console.log('\n✅ New Claim Link Generated for Jenn Boyce (The Hollywood Prep)\n');
console.log('Listing ID:', listingId);
console.log('Email:', 'jenn@thehollywoodprep.com');
console.log('Expires:', new Date((exp) * 1000).toLocaleString());
console.log('\n📧 CLAIM LINK:');
console.log(claimUrl);
console.log('\n');

