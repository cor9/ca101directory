Supabase Integration

Supabase powers all backend functionality for the Child Actor 101 Directory — including authentication, database storage, file uploads, and serverless API logic.
This replaces the legacy Sanity CMS from Mkdirs and unifies data, auth, and storage under a single open-source stack.

⸻

Configuration

Environment variables (in .env.local):

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_JWT_SECRET=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_SITE_URL=

The anon key is used on the client (read-only + authenticated user access).
The service role key is server-only and should never be exposed client-side.

⸻

Database Schema Overview

Table	Description	Relationship
users	Supabase Auth-managed users table	System-level (do not modify manually)
profiles	Extended profile data (vendor/parent info)	user_id → auth.users.id
listings	Core directory listings (vendors, coaches, services)	Linked to profiles and plans
plans	Subscription tiers: Free, Standard, Pro	plan_id → listings.plan_id
categories	Service categories (acting coach, headshots, etc.)	category_id → listings.category_id
category_icons	Icon or image mapping for categories	Joined to categories
reviews	Parent-submitted feedback for vendors	listing_id, user_id
vendor_ratings	Admin or algorithmic scoring table	listing_id
badge_applications	“101 Approved” verification submissions	vendor_id → profiles.user_id
vendor_suggestions	UGC suggestions for new vendors	Publicly writable (RLS controlled)
claims	Vendor claim requests for existing listings	user_id, listing_id
password_reset_tokens / verification_tokens	Managed automatically by Supabase Auth	System-only


⸻

Row Level Security (RLS)

Enable RLS

Every user-facing table must have Row Level Security turned on to prevent anonymous edits or data exposure.

Example Policies

Listings Table

Allow anyone to read listings:

create policy "Public read access" on listings
for select
to anon
using (true);

Allow vendors to update their own listing:

create policy "Vendors can update their listings"
on listings
for update
to authenticated
using (auth.uid() = vendor_id);

Reviews Table

Allow all users to read reviews:

create policy "Public read reviews" on reviews
for select
to anon
using (true);

Allow authenticated users to create new reviews:

create policy "Post review if logged in"
on reviews
for insert
to authenticated
with check (auth.uid() = user_id);

Badge Applications Table

Allow vendor to view and manage their own badge application:

create policy "Manage own badge application"
on badge_applications
for all
to authenticated
using (auth.uid() = vendor_id);

These policies protect all data while maintaining usability for authenticated users.

⸻

File Storage

Supabase Storage Buckets:

Bucket	Purpose
vendor_media	Logos, photos, and PDFs attached to listings
verification_docs	Uploaded verification or badge materials

Access is controlled via signed URLs and RLS.
Never store sensitive documents in public buckets.

⸻

Authentication

Supabase Auth handles all user sign-up and sign-in flows.
The profiles table extends user metadata and can include:
	•	Name
	•	Business name
	•	Contact info
	•	Profile photo
	•	Account type (vendor, parent, or admin)

Authentication middleware is enforced in Next.js API routes via:

import { createServerClient } from “@supabase/auth-helpers-nextjs”;

⸻

Payments & Plans Integration (Stripe)

Stripe manages subscriptions and payments tied to Supabase plans and listings.
	•	Each Stripe product maps to one plan in the plans table.
	•	Webhooks update Supabase when a subscription is created, renewed, or canceled.
	•	Stripe Customer IDs are stored in the profiles table for tracking.

Example webhook endpoint (Next.js route):

// /app/api/stripe/webhook/route.ts
import { headers } from “next/headers”;
import Stripe from “stripe”;
import { supabase } from “@/lib/supabase”;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: “2025-04-01” });

export async function POST(req: Request) {
const body = await req.text();
const signature = headers().get(“stripe-signature”)!;
const event = stripe.webhooks.constructEvent(
body,
signature,
process.env.STRIPE_WEBHOOK_SECRET!
);
// Handle event types…
}

⸻

Security & Deployment Notes
	•	Use the service role key only on the server.
	•	Verify Supabase RLS policies are active before going live.
	•	Store all API keys in Vercel environment variables.
	•	Run pnpm db:push after schema updates.
	•	Back up the database using Supabase’s scheduled backups.

⸻

Summary

Supabase acts as:
	•	The database layer (PostgreSQL)
	•	The auth provider
	•	The storage service
	•	The API foundation for your Next.js app

This integration replaces external CMS logic entirely, ensuring a secure, scalable backend with minimal dependencies.
