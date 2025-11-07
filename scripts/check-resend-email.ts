/**
 * Check Resend email status by ID
 * Usage: tsx scripts/check-resend-email.ts <email_id>
 */

import { Resend } from 'resend';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const resendApiKey = process.env.RESEND_API_KEY!;

if (!resendApiKey) {
  console.error('RESEND_API_KEY is required');
  process.exit(1);
}

const resend = new Resend(resendApiKey);
const emailId = process.argv[2];

if (!emailId) {
  console.error('Usage: tsx scripts/check-resend-email.ts <email_id>');
  console.error('Example: tsx scripts/check-resend-email.ts re_TRHhpeoo_gWKKfKNAVdoQitBpoXRBi1ic');
  process.exit(1);
}

async function checkEmailStatus() {
  try {
    console.log(`Checking status for email: ${emailId}\n`);

    const { data, error } = await resend.emails.get(emailId);

    if (error) {
      console.error('Error:', error);
      return;
    }

    if (data) {
      console.log('Email Details:');
      console.log('==============');
      console.log(`ID: ${data.id}`);
      console.log(`From: ${data.from}`);
      console.log(`To: ${Array.isArray(data.to) ? data.to.join(', ') : data.to}`);
      console.log(`Subject: ${data.subject}`);
      console.log(`Created At: ${data.created_at}`);
      console.log(`Status: ${data.last_event || 'unknown'}`);

      if (data.events && data.events.length > 0) {
        console.log('\nEvents:');
        data.events.forEach((event: any, index: number) => {
          console.log(`  ${index + 1}. ${event.type} - ${event.created_at}`);
        });
      }
    }
  } catch (error: any) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
}

checkEmailStatus();

