import { getAllAirtableRecords } from "@/lib/direct-airtable";
import { createClient } from "@sanity/client";
import { slugify } from "@/lib/utils";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

// Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-08-01",
  useCdn: false,
  perspective: "published",
  token: process.env.SANITY_API_TOKEN,
});

/**
 * Airtable to Site Sync Script
 * 
 * This script syncs approved listings from Airtable to the Sanity CMS
 * for display on the website.
 * 
 * Process:
 * 1. Fetch all records from Airtable
 * 2. Filter for approved listings
 * 3. Transform data to Sanity format
 * 4. Create/update items in Sanity
 * 
 * Usage:
 * - pnpm run airtable:sync
 * - pnpm run airtable:remove
 * - pnpm run airtable:update
 */

export const syncAirtableToSite = async () => {
  try {
    console.log("🔄 Starting Airtable to Site sync...");
    
    // Get all Airtable records
    const airtableRecords = await getAllAirtableRecords();
    console.log(`📊 Found ${airtableRecords.length} total records in Airtable`);
    
    // Filter for approved listings only
    const approvedRecords = airtableRecords.filter(record => 
      record.fields.Status === "APPROVED" || record.fields.Status === "Approved"
    );
    console.log(`✅ Found ${approvedRecords.length} approved listings`);
    
    if (approvedRecords.length === 0) {
      console.log("⚠️ No approved listings found to sync");
      return;
    }
    
    // Get existing categories and tags from Sanity
    const categories = await client.fetch(`*[_type == "category"]`);
    const tags = await client.fetch(`*[_type == "tag"]`);
    
    console.log(`📂 Found ${categories.length} categories and ${tags.length} tags in Sanity`);
    
    let syncedCount = 0;
    let skippedCount = 0;
    
    for (const record of approvedRecords) {
      try {
        const fields = record.fields;
        
        // Check if item already exists
        const existingItem = await client.fetch(
          `*[_type == "item" && name == "${fields["Listing Name"]?.replace(/"/g, '\\"')}"]`
        );
        
        if (existingItem.length > 0) {
          console.log(`⏭️ Skipping existing item: ${fields["Listing Name"]}`);
          skippedCount++;
          continue;
        }
        
        // Transform Airtable data to Sanity format
        const itemData = {
          _type: "item",
          name: fields["Listing Name"] || "Untitled Listing",
          slug: {
            _type: "slug",
            current: slugify(fields["Listing Name"] || "untitled-listing"),
          },
          link: fields.Website || "",
          description: fields["What You Offer?"] || "",
          introduction: fields["Who Is It For?"] || "",
          unique: fields["Why Is It Unique?"] || "",
          notes: fields["Extras/Notes"] || "",
          format: fields["Format (In-person/Online/Hybrid)"] || "Hybrid",
          performerPermit: fields["California Child Performer Services Permit "] || false,
          bonded: fields["Bonded For Advanced Fees"] || false,
          bondNumber: fields["Bond#"] || "",
          email: fields.Email || "",
          phone: fields.Phone || "",
          city: fields.City || "",
          state: fields.State || "",
          zip: fields.Zip || "",
          plan: fields.Plan || "Free",
          publishDate: new Date(),
          pricePlan: fields.Plan === "Free" ? "free" : "pro",
          freePlanStatus: fields.Plan === "Free" ? "approved" : undefined,
          proPlanStatus: fields.Plan !== "Free" ? "approved" : undefined,
          
          // Map categories
          categories: mapCategories(fields.Categories || [], categories),
          
          // Map tags (age ranges)
          tags: mapTags(fields["Age Range"] || [], tags),
          
          // Handle profile image if available
          ...(fields["Profile Image"] && fields["Profile Image"].length > 0 ? {
            icon: {
              _type: "image",
              asset: {
                _type: "reference",
                _ref: await uploadImageFromUrl(fields["Profile Image"][0].url, `${slugify(fields["Listing Name"])}_logo`),
              },
              alt: `Logo of ${fields["Listing Name"]}`,
            },
          } : {}),
        };
        
        // Create the item in Sanity
        const result = await client.create(itemData);
        console.log(`✅ Synced: ${fields["Listing Name"]} (ID: ${result._id})`);
        syncedCount++;
        
      } catch (error) {
        console.error(`❌ Error syncing ${fields["Listing Name"]}:`, error);
      }
    }
    
    console.log(`🎉 Sync complete! Synced: ${syncedCount}, Skipped: ${skippedCount}`);
    
  } catch (error) {
    console.error("❌ Sync failed:", error);
  }
};

export const removeAirtableItems = async () => {
  try {
    console.log("🗑️ Removing all Airtable-synced items...");
    
    // Find items that were synced from Airtable (you might want to add a marker field)
    const items = await client.fetch(`*[_type == "item"]`);
    
    for (const item of items) {
      await client.delete(item._id);
      console.log(`🗑️ Deleted: ${item.name}`);
    }
    
    console.log(`✅ Removed ${items.length} items`);
  } catch (error) {
    console.error("❌ Remove failed:", error);
  }
};

export const updateAirtableItems = async () => {
  try {
    console.log("🔄 Updating Airtable-synced items...");
    
    const items = await client.fetch(`*[_type == "item"]`);
    
    for (const item of items) {
      // Update logic here - for example, refresh publish date
      await client
        .patch(item._id)
        .set({
          publishDate: new Date(),
        })
        .commit();
      
      console.log(`🔄 Updated: ${item.name}`);
    }
    
    console.log(`✅ Updated ${items.length} items`);
  } catch (error) {
    console.error("❌ Update failed:", error);
  }
};

// Helper functions
const mapCategories = (airtableCategories: string[], sanityCategories: any[]) => {
  return airtableCategories
    .map(catName => sanityCategories.find(cat => cat.name === catName))
    .filter(Boolean)
    .map((category, index) => ({
      _type: "reference",
      _ref: category._id,
      _key: index.toString(),
    }));
};

const mapTags = (airtableTags: string[], sanityTags: any[]) => {
  return airtableTags
    .map(tagName => sanityTags.find(tag => tag.name === tagName))
    .filter(Boolean)
    .map((tag, index) => ({
      _type: "reference",
      _ref: tag._id,
      _key: index.toString(),
    }));
};

const uploadImageFromUrl = async (imageUrl: string, filename: string): Promise<string> => {
  try {
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const asset = await client.assets.upload("image", buffer, {
      filename: `${filename}.png`,
    });
    
    return asset._id;
  } catch (error) {
    console.error(`Error uploading image ${imageUrl}:`, error);
    throw error;
  }
};

// Command line interface
const operation = process.argv[2];

const runOperation = async () => {
  switch (operation) {
    case "sync":
      await syncAirtableToSite();
      break;
    case "remove":
      await removeAirtableItems();
      break;
    case "update":
      await updateAirtableItems();
      break;
    default:
      console.log(`
Available commands:
- sync: Sync approved Airtable listings to the site
- remove: Remove all synced items from the site
- update: Update existing synced items
      `);
  }
};

// Run the operation
runOperation().catch(console.error);
