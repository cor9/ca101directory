/**
 * Script to create listings from "more free listings.csv"
 * Run with: npx tsx scripts/create-more-free-listings.ts
 */

import * as fs from "fs";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase credentials");
  console.error(
    "Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// CSV data from "more free listings.csv"
const listings = [
  {
    name: "Lauren MIlberger Web Design",
    website: "https://www.laurenmilberger.com/web-design",
    email: "laurenmilberger@gmail.com",
    phone: "",
    city: "",
    state: "",
    format: "Online",
    region: ["Global (Online Only)"],
    categories: ["Actor Websites"],
    tags: [],
    description:
      "Custom designed or industry specific templates for Actor Web Pages",
  },
  {
    name: "ActorWebs",
    website: "https://actorwebs.com/",
    email: "info@actorwebs.com",
    phone: "",
    city: "",
    state: "",
    format: "Online",
    region: ["Global (Online Only)"],
    categories: ["Actor Websites"],
    tags: [],
    description:
      "I'll build a sleek, affordable actor website that gives industry professionals the chance to see and connect with the real you, so you have time to focus on all the other things that come with your busy actor life.",
  },
  {
    name: "Web For Actors",
    website: "https://www.webforactors.com/",
    email: "info@webforactors.com",
    phone: "",
    city: "",
    state: "",
    format: "Online",
    region: ["Global (Online Only)"],
    categories: ["Actor Websites"],
    tags: [],
    description:
      "Smart actor websites that update themselves. What you get is not your standard actor website. You receive an integrated, beautifully designed, SEO driven website that updates itself when you update your social media. This is a next-generation service.",
  },
  {
    name: "Sparkles Entertainment",
    website: "https://www.gosparkles.tv/services/p/actor-website",
    email: "info@gosparkles.tv",
    phone: "",
    city: "",
    state: "",
    format: "Online",
    region: ["Global (Online Only)"],
    categories: ["Actor Websites"],
    tags: [],
    description:
      "A personal website is essential for showcasing your acting portfolio and building a strong online presence. It also provides a platform for personal branding, bolstering your credibility and potential in the competitive film industry.",
  },
  {
    name: "Actor Square",
    website: "https://www.actorsquare.com/",
    email: "contact@actorsquare.com",
    phone: "",
    city: "Williamsburg",
    state: "VA",
    format: "Hybrid",
    region: ["Mid-Atlantic"],
    categories: ["Actor Websites"],
    tags: [],
    description:
      "Getting an actor website is an essential step in being a professional actor. It's a custom headquarters built to compliment your headshots, reels, resume, contact details, social media, casting profiles and more! This makes it easier for industry professionals to access your information.",
  },
  {
    name: "Tony Howell",
    website: "https://tonyhowell.co/",
    email: "hello@tonyhowell.co",
    phone: "",
    city: "",
    state: "",
    format: "Online",
    region: ["Global (Online Only)"],
    categories: ["Actor Websites"],
    tags: [],
    description:
      "Our expertise lies in crafting personalized websites for actors that not only showcase your work across genres, but help connect you with casting directors, agents, and fans around the globe.",
  },
  {
    name: "Central Casting",
    website: "https://www.centralcasting.com/",
    email: "helpme@centralcasting.com",
    phone: "",
    city: "Burbank",
    state: "CA",
    format: "Hybrid",
    region: ["West Coast"],
    categories: ["Background Casting"],
    tags: [],
    description:
      "Sign up to work as a paid background actor in film and television with the iconic institution of Hollywood that is Central Casting.",
  },
  {
    name: "Alessi Hartigan Casting",
    website: "https://alessihartigancasting.com/",
    email: "alessihartigancasting@gmail.com",
    phone: "",
    city: "",
    state: "",
    format: "Online",
    region: ["Global (Online Only)"],
    categories: ["Background Casting"],
    tags: [],
    description:
      "Alessi Hartigan Casting is a leading background and day-player casting company hiring real people for major film and television productions across the US and UK. Their team casts locally in multiple regions, specializing in authentic character looks, large crowds, and high-volume background casting for studios such as Universal, Netflix, Paramount, Apple TV, CBS, and more. Actors register through their talent portal to be considered for upcoming projects in their area.",
  },
  {
    name: "Talent House Academy",
    website: "https://www.talenthouseacademy.com/",
    email: "talenthouseacademyla@gmail.com",
    phone: "",
    city: "Burbank",
    state: "CA",
    format: "Hybrid",
    region: ["West Coast"],
    categories: ["Casting Workshops"],
    tags: [],
    description:
      "Talent House Academy is a Talent Training Service our classes, workshops, events, programs, camps, showcases etc. are not an audition for employment or for obtaining a talent agent or talent management.",
  },
  {
    name: "SAG-AFTRA",
    website: "https://www.sagaftra.org/membership-benefits/young-performers",
    email: "",
    phone: "",
    city: "Los Angeles",
    state: "CA",
    format: "Hybrid",
    region: ["West Coast"],
    categories: ["Child Advocacy"],
    tags: [],
    description: "Get resources and free handbook on their website.",
  },
];

async function createListings() {
  console.log("🚀 Starting bulk listing creation...");
  console.log(`📋 Total listings to create: ${listings.length}`);
  console.log("");

  const now = new Date().toISOString();
  const results = {
    created: [] as any[],
    skipped: [] as any[],
    errors: [] as any[],
  };

  for (let i = 0; i < listings.length; i++) {
    const listing = listings[i];
    const rowNum = i + 1;

    console.log(
      `\n📝 Processing ${rowNum}/${listings.length}: ${listing.name}`,
    );

    // Generate slug
    const slug = listing.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    // Check for duplicates by website
    let isDuplicate = false;
    if (listing.website) {
      const clean = listing.website.replace(/^https?:\/\//i, "");
      const { data: dupByWebsite } = await supabase
        .from("listings")
        .select("id, website, listing_name")
        .ilike("website", `%${clean}%`)
        .limit(1);

      if (dupByWebsite && dupByWebsite.length > 0) {
        console.log(
          `   ⚠️  Duplicate (website): ${dupByWebsite[0].listing_name}`,
        );
        results.skipped.push({
          row: rowNum,
          name: listing.name,
          reason: "duplicate_website",
          existing: dupByWebsite[0],
        });
        isDuplicate = true;
      }
    }

    // Check for duplicates by name
    if (!isDuplicate) {
      const { data: dupByName } = await supabase
        .from("listings")
        .select("id, listing_name")
        .ilike("listing_name", listing.name)
        .limit(1);

      if (dupByName && dupByName.length > 0) {
        console.log(`   ⚠️  Duplicate (name): ${dupByName[0].listing_name}`);
        results.skipped.push({
          row: rowNum,
          name: listing.name,
          reason: "duplicate_name",
          existing: dupByName[0],
        });
        isDuplicate = true;
      }
    }

    if (isDuplicate) {
      continue;
    }

    // Validate required fields
    if (!listing.name || listing.name.trim().length === 0) {
      console.log(`   ❌ Skipped: Empty name`);
      results.skipped.push({
        row: rowNum,
        name: listing.name,
        reason: "empty_name",
      });
      continue;
    }

    if (!listing.description || listing.description.trim().length === 0) {
      console.log(`   ❌ Skipped: Empty description`);
      results.skipped.push({
        row: rowNum,
        name: listing.name,
        reason: "empty_description",
      });
      continue;
    }

    // Create the listing
    const listingData = {
      listing_name: listing.name.trim(),
      slug,
      website: listing.website || null,
      what_you_offer: listing.description.trim(),
      who_is_it_for: null,
      why_is_it_unique: null,
      format: listing.format || null,
      extras_notes: null,
      profile_image: null,
      tags: listing.tags,
      categories: listing.categories,
      plan: "Free",
      status: "Live", // Set as Live since these are pre-approved
      ca_permit_required: false,
      is_bonded: false,
      email: listing.email || null,
      phone: listing.phone || null,
      city: listing.city || null,
      state: listing.state || null,
      zip: null,
      region: listing.region || null,
      bond_number: null,
      is_active: true,
      comped: true, // Mark as comped since these are free listings added by admin
      featured: false,
      is_approved_101: false,
      is_claimed: false,
      verification_status: "unverified",
      gallery: null,
      has_gallery: false,
      facebook_url: null,
      instagram_url: null,
      tiktok_url: null,
      youtube_url: null,
      linkedin_url: null,
      blog_url: null,
      custom_link_url: null,
      custom_link_name: null,
      owner_id: null, // No owner since unclaimed
      created_at: now,
      updated_at: now,
    };

    try {
      const { data, error } = await supabase
        .from("listings")
        .insert([listingData])
        .select()
        .single();

      if (error) {
        console.log(`   ❌ Error: ${error.message}`);
        results.errors.push({
          row: rowNum,
          name: listing.name,
          error: error.message,
        });
        continue;
      }

      console.log(`   ✅ Created: ${data.id}`);
      results.created.push({
        row: rowNum,
        name: listing.name,
        id: data.id,
        slug: data.slug,
      });
    } catch (error) {
      console.log(`   ❌ Exception: ${error}`);
      results.errors.push({
        row: rowNum,
        name: listing.name,
        error: String(error),
      });
    }
  }

  // Print summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 BULK CREATE SUMMARY");
  console.log("=".repeat(60));
  console.log(`✅ Created: ${results.created.length}`);
  console.log(`⚠️  Skipped: ${results.skipped.length}`);
  console.log(`❌ Errors: ${results.errors.length}`);
  console.log("");

  if (results.created.length > 0) {
    console.log("✅ Successfully Created:");
    results.created.forEach((r) => {
      console.log(`   ${r.row}. ${r.name} (${r.id})`);
    });
    console.log("");
  }

  if (results.skipped.length > 0) {
    console.log("⚠️  Skipped (Duplicates):");
    results.skipped.forEach((r) => {
      console.log(`   ${r.row}. ${r.name} - ${r.reason}`);
    });
    console.log("");
  }

  if (results.errors.length > 0) {
    console.log("❌ Errors:");
    results.errors.forEach((r) => {
      console.log(`   ${r.row}. ${r.name} - ${r.error}`);
    });
    console.log("");
  }

  console.log("=".repeat(60));
  console.log("✨ Done!");
  console.log("=".repeat(60));
}

// Run the script
createListings()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("💥 Fatal error:", error);
    process.exit(1);
  });
