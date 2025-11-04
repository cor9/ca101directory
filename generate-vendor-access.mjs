import crypto from 'crypto';
import 'dotenv/config';

// Generate a 30-day vendor access token for Jenn Boyce
const email = 'jenn@thehollywoodprep.com';
const userId = 'f3c4b670-c366-41c5-b93b-11ce211d834c';
const ttlSeconds = 60 * 60 * 24 * 30; // 30 days

const secret = process.env.NEXTAUTH_SECRET;
if (!secret) {
  console.error('ERROR: NEXTAUTH_SECRET is not set');
  process.exit(1);
}

const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
const payload = JSON.stringify({ 
  email, 
  uid: userId,
  role: 'vendor',
  exp,
  type: 'vendor_access'
});

const payloadB64 = Buffer.from(payload).toString('base64url');
const sig = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');
const token = `${payloadB64}.${sig}`;

const accessUrl = `https://directory.childactor101.com/auth/vendor-access/${token}`;

console.log('\n✅ 30-Day Vendor Access Link Generated\n');
console.log('👤 Vendor:', 'Jenn Boyce');
console.log('📧 Email:', email);
console.log('⏰ Expires:', new Date(exp * 1000).toLocaleString());
console.log('\n🔗 ONE-CLICK ACCESS LINK:');
console.log(accessUrl);
console.log('\n');

