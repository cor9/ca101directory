import { getAllAirtableRecords } from "@/lib/direct-airtable";
import { slugify } from "@/lib/utils";
import { createClient } from "@sanity/client";
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
    const approvedRecords = airtableRecords.filter(
      (record) =>
        record.fields.Status === "APPROVED" ||
        record.fields.Status === "Approved",
    );
    console.log(`✅ Found ${approvedRecords.length} approved listings`);

    if (approvedRecords.length === 0) {
      console.log("⚠️ No approved listings found to sync");
      return;
    }

    // Get existing categories and tags from Sanity
    const categories = await client.fetch(`*[_type == "category"]`);
    const tags = await client.fetch(`*[_type == "tag"]`);

    console.log(
      `📂 Found ${categories.length} categories and ${tags.length} tags in Sanity`,
    );

    let syncedCount = 0;
    let skippedCount = 0;

    for (const record of approvedRecords) {
      const fields = record.fields;
      const listingName =
        typeof fields["Listing Name"] === "string"
          ? fields["Listing Name"]
          : "Untitled Listing";

      try {
        const existingItem = await client.fetch(
          `*[_type == "item" && name == "${listingName.replace(/"/g, '\\"')}"]`,
        );

        if (existingItem.length > 0) {
          console.log(`⏭️ Skipping existing item: ${listingName}`);
          skippedCount++;
          continue;
        }

        // Transform Airtable data to Sanity format
        const itemData = {
          _type: "item",
          name: listingName,
          slug: {
            _type: "slug",
            current: slugify(listingName),
          },
          link: typeof fields.Website === "string" ? fields.Website : "",
          description:
            typeof fields["What You Offer?"] === "string"
              ? fields["What You Offer?"]
              : "",
          introduction:
            typeof fields["Who Is It For?"] === "string"
              ? fields["Who Is It For?"]
              : "",
          unique:
            typeof fields["Why Is It Unique?"] === "string"
              ? fields["Why Is It Unique?"]
              : "",
          notes:
            typeof fields["Extras/Notes"] === "string"
              ? fields["Extras/Notes"]
              : "",
          format:
            typeof fields["Format (In-person/Online/Hybrid)"] === "string"
              ? fields["Format (In-person/Online/Hybrid)"]
              : "Hybrid",
          performerPermit: Boolean(
            fields["California Child Performer Services Permit "],
          ),
          bonded: Boolean(fields["Bonded For Advanced Fees"]),
          bondNumber:
            typeof fields["Bond#"] === "string" ? fields["Bond#"] : "",
          email: typeof fields.Email === "string" ? fields.Email : "",
          phone: typeof fields.Phone === "string" ? fields.Phone : "",
          city: typeof fields.City === "string" ? fields.City : "",
          state: typeof fields.State === "string" ? fields.State : "",
          zip: typeof fields.Zip === "string" ? fields.Zip : "",
          plan: typeof fields.Plan === "string" ? fields.Plan : "Free",
          publishDate: new Date(),
          pricePlan:
            (typeof fields.Plan === "string" ? fields.Plan : "Free") === "Free"
              ? "free"
              : "pro",
          freePlanStatus:
            (typeof fields.Plan === "string" ? fields.Plan : "Free") === "Free"
              ? "approved"
              : undefined,
          proPlanStatus:
            (typeof fields.Plan === "string" ? fields.Plan : "Free") !== "Free"
              ? "approved"
              : undefined,

          // Map categories
          categories: mapCategories(
            Array.isArray(fields.Categories) ? fields.Categories : [],
            categories,
          ),

          // Map tags (age ranges)
          tags: mapTags(
            Array.isArray(fields["Age Range"]) ? fields["Age Range"] : [],
            tags,
          ),

          // Handle profile image if available
          ...(Array.isArray(fields["Profile Image"]) &&
          fields["Profile Image"].length > 0
            ? {
                icon: {
                  _type: "image",
                  asset: {
                    _type: "reference",
                    _ref: await uploadImageFromUrl(
                      fields["Profile Image"][0].url,
                      `${slugify(listingName)}_logo`,
                    ),
                  },
                  alt: `Logo of ${listingName}`,
                },
              }
            : {}),
        };

        // Create the item in Sanity
        const result = await client.create(itemData);
        console.log(`✅ Synced: ${listingName} (ID: ${result._id})`);
        syncedCount++;
      } catch (error) {
        console.error(`❌ Error syncing ${listingName}:`, error);
      }
    }

    console.log(
      `🎉 Sync complete! Synced: ${syncedCount}, Skipped: ${skippedCount}`,
    );
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
const mapCategories = (
  airtableCategories: string[],
  sanityCategories: any[],
) => {
  return airtableCategories
    .map((catName) => sanityCategories.find((cat) => cat.name === catName))
    .filter(Boolean)
    .map((category, index) => ({
      _type: "reference",
      _ref: category._id,
      _key: index.toString(),
    }));
};

const mapTags = (airtableTags: string[], sanityTags: any[]) => {
  return airtableTags
    .map((tagName) => sanityTags.find((tag) => tag.name === tagName))
    .filter(Boolean)
    .map((tag, index) => ({
      _type: "reference",
      _ref: tag._id,
      _key: index.toString(),
    }));
};

const uploadImageFromUrl = async (
  imageUrl: string,
  filename: string,
): Promise<string> => {
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
