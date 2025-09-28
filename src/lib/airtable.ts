import Airtable from "airtable";
import { categoryMap, tagMap } from "./mappings";

// Transform form data to Airtable format with exact field names
export function toAirtable(formData: any) {
  console.log("🔍 toAirtable INPUT:", JSON.stringify(formData, null, 2));

  // Map categories and tags
  const mappedCategories =
    formData.categories
      ?.map((c: string) => categoryMap[c] || c)
      .filter(Boolean) || [];
  const mappedTags =
    formData.tags?.map((t: string) => tagMap[t] || t).filter(Boolean) || [];

  const record = {
    fields: {
      "Listing Name": formData.name,
      "What You Offer?": formData.description,
      "Who Is It For?": formData.introduction,
      "Why Is It Unique?": formData.unique,
      "Format (In-person/Online/Hybrid)": formData.format,
      "Extras/Notes": formData.notes,
      "California Child Performer Services Permit ": !!formData.performerPermit,
      "Bonded For Advanced Fees": !!formData.bonded,
      "Bond#": formData.bondNumber || "",
      Website: formData.link,
      Email: formData.email,
      Phone: formData.phone,
      City: formData.city,
      State: formData.state,
      Zip: formData.zip,
      "Age Range": mappedTags,
      Categories: mappedCategories,
      "Profile Image": formData.iconId
        ? [
            {
              url: `https://veynyzggmlgdy8nr.public.blob.vercel-storage.com/${formData.iconId}`,
            },
          ]
        : [],
      Plan: formData.plan,
      Status: "PENDING",
    },
  };

  console.log("🔍 toAirtable OUTPUT:", JSON.stringify(record, null, 2));
  return record;
}

// Initialize Airtable only if API key is available
let airtable: Airtable | null = null;
let base: Airtable.Base | null = null;

// Check if environment variables are available
const hasAirtableConfig =
  process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID;

if (hasAirtableConfig) {
  try {
    airtable = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY,
    });
    base = airtable.base(process.env.AIRTABLE_BASE_ID);
    console.log("✅ Airtable initialized successfully");
  } catch (error) {
    console.warn("❌ Airtable initialization failed:", error);
  }
} else {
  console.warn("⚠️ Airtable not configured - missing API key or base ID");
}

// Types for our data
export interface Listing {
  id: string;
  businessName: string;
  email: string;
  phone: string;
  website?: string;
  instagram?: string;
  servicesOffered?: string;
  description: string;
  uniqueValue?: string;
  format?: string;
  notes?: string;
  categories: string[]; // Multi-select field in Airtable
  tags?: string[]; // Multi-select field in Airtable (age ranges) - not implemented yet
  gallery?: string[];
  logo?: string;
  location: string;
  city?: string;
  state?: string;
  zip?: string;
  virtual: boolean;
  plan: "Basic" | "Pro" | "Premium" | "Free" | "Add-On";
  featured: boolean;
  approved101: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED";
  active: boolean;
  dateSubmitted: string;
  dateApproved?: string;
  performerPermit?: boolean;
  bonded?: boolean;
  bondNumber?: string;
  // New claim-related fields
  claimed?: boolean;
  claimedByEmail?: string;
  claimDate?: string;
  verificationStatus?: "Pending" | "Verified" | "Denied";
  badge101?: boolean;
}

export interface Category {
  id: string;
  categoryName: string;
  description?: string;
  icon?: string;
}

// Helper function to convert Airtable record to our interface
function recordToListing(record: Airtable.Record<any>): Listing {
  const fields = record.fields;

  return {
    id: record.id,
    businessName: fields["Listing Name"] || "Untitled Listing",
    email: fields["Email"] || "",
    phone: fields["Phone"] || "",
    website: fields["Website"] || "",
    instagram: fields["Instagram"] || "",
    servicesOffered: fields["Who Is It For?"] || "",
    description:
      fields["What You Offer?"] ||
      "Professional acting services for young performers",
    uniqueValue: fields["Why Is It Unique?"] || "",
    format: fields["Format (In-person/Online/Hybrid)"] || "Hybrid",
    notes: fields["Extras/Notes"] || "",
    categories: Array.isArray(fields["Categories"]) ? fields["Categories"] : [],
    tags: Array.isArray(fields["Age Range"]) ? fields["Age Range"] : [],
    gallery: Array.isArray(fields["Gallery"]) ? fields["Gallery"] : [],
    logo:
      Array.isArray(fields["Profile Image"]) &&
      fields["Profile Image"].length > 0
        ? fields["Profile Image"][0].url
        : "",
    location:
      fields["City"] && fields["State"]
        ? `${fields["City"]}, ${fields["State"]}`
        : fields["City"] || fields["State"] || "",
    virtual: false,
    plan: fields["Plan"] || "Free",
    featured: fields["Featured"] || false,
    approved101: fields["Approved101"] || false,
    status: fields["Status"] || "PENDING",
    active: fields["Active"] !== false, // Default to true for approved listings
    dateSubmitted: new Date().toISOString(),
    dateApproved:
      fields["Status"] === "APPROVED" ? new Date().toISOString() : "",
    performerPermit:
      fields["California Child Performer Services Permit "] || false,
    bonded: fields["Bonded For Advanced Fees"] || false,
    bondNumber: fields["Bond#"] || "",
    // New claim-related fields
    claimed: fields["Claimed?"] || false,
    claimedByEmail: fields["Claimed By Email"] || "",
    claimDate: fields["Claim Date"] || "",
    verificationStatus: fields["Verification Status"] || "Pending",
    badge101: fields["101 Badge"] || false,
  };
}

function recordToCategory(record: Airtable.Record<any>): Category {
  return {
    id: record.id,
    categoryName: record.get("Category Name") || "",
    description: record.get("Description"),
    icon: record.get("Icon")?.[0]?.url,
  };
}

// API functions
export async function getListings(): Promise<Listing[]> {
  if (!base) {
    console.warn("Airtable not initialized - returning empty listings");
    return [];
  }

  try {
    const records = await base("Listings")
      .select({
        filterByFormula: "{Status} = 'APPROVED'",
        sort: [{ field: "Listing Name", direction: "asc" }],
      })
      .all();

    console.log(`✅ Found ${records.length} approved listings in Airtable`);
    const listings = records.map(recordToListing);

    // Log first few listings for debugging
    if (listings.length > 0) {
      console.log("Sample approved listing:", {
        id: listings[0].id,
        businessName: listings[0].businessName,
        status: listings[0].status,
        featured: listings[0].featured,
      });
    }

    return listings;
  } catch (error) {
    console.error("Error fetching listings:", error);
    return [];
  }
}

export async function getAllListings(): Promise<Listing[]> {
  if (!base) {
    console.warn("Airtable not initialized - returning empty listings");
    return [];
  }

  try {
    const records = await base("Listings")
      .select({
        // No filter - get all records
        sort: [{ field: "Listing Name", direction: "asc" }],
      })
      .all();

    console.log(`✅ Found ${records.length} total listings in Airtable`);
    console.log(
      "🔍 First record fields:",
      Object.keys(records[0]?.fields || {}),
    );
    console.log("🔍 First record data:", records[0]?.fields);

    const listings = records.map(recordToListing);

    return listings;
  } catch (error) {
    console.error("Error fetching all listings:", error);
    return [];
  }
}

export async function getListingById(id: string): Promise<Listing | null> {
  if (!base) {
    console.warn("Airtable not initialized - returning null");
    return null;
  }

  try {
    const record = await base("Listings").find(id);
    return recordToListing(record);
  } catch (error) {
    console.error("Error fetching listing:", error);
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!base) {
    console.warn("Airtable not initialized - returning empty categories");
    return [];
  }

  try {
    const records = await base("Categories").select().all();

    return records.map(recordToCategory);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Interface for form data that matches what we actually pass
interface FormData {
  name: string;
  link: string;
  description: string;
  introduction: string;
  unique: string;
  format: string;
  notes: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  zip: string;
  bondNumber: string;
  plan: string;
  performerPermit: boolean;
  bonded: boolean;
  categories: string[]; // Array of category IDs
  tags: string[];
  gallery?: string[]; // Array of gallery image URLs
  iconId?: string | unknown; // Optional and can be unknown type
}

export async function createListing(data: FormData): Promise<string | null> {
  console.log("createListing called with data:", data);

  if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
    console.warn("Airtable not configured - missing API key or base ID");
    return null;
  }

  try {
    console.log("Creating listing with data:", data);

    // Use the same transform logic as the API route
    const record = {
      fields: {
        "Listing Name": data.name,
        "What You Offer?": data.description,
        "Who Is It For?": data.introduction,
        "Why Is It Unique?": data.unique,
        "Format (In-person/Online/Hybrid)":
          data.format === "Online"
            ? "Online Only"
            : data.format === "In-person"
              ? "In-Person Only"
              : "Hybrid (Online & In-Person)",
        "Extras/Notes": data.notes,
        "California Child Performer Services Permit ": !!data.performerPermit,
        "Bonded For Advanced Fees": !!data.bonded,
        "Bond#": data.bondNumber || "",
        Website: data.link,
        Email: data.email,
        Phone: data.phone,
        City: data.city,
        State: data.state,
        Zip: data.zip,
        "Age Range": (data.tags || []).map((t: string) => tagMap[t] || t),
        Categories: Array.isArray(data.categories)
          ? data.categories
              .map((c: string) => categoryMap[c] || c)
              .filter(Boolean)
          : [],
        "Profile Image": data.iconId
          ? [
              {
                url: `https://veynyzggmlgdy8nr.public.blob.vercel-storage.com/${data.iconId}`,
              },
            ]
          : [],
        "Gallery": data.gallery && data.gallery.length > 0
          ? data.gallery.map((url) => ({
              url: `https://veynyzggmlgdy8nr.public.blob.vercel-storage.com/${url}`,
            }))
          : [],
        Plan: data.plan, // must be one of "Free", "Basic", "Pro", "Premium"
      },
    };

    console.log("Final Airtable payload:", record);

    const response = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Listings`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(record),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Airtable API error:", response.status, errorText);
      return null;
    }

    const result = await response.json();
    console.log("Successfully created listing:", result.id);
    return result.id;
  } catch (error) {
    console.error("Error creating listing:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      data: data,
    });
    return null;
  }
}

// Update a listing's claim status
export async function updateListingClaim(
  listingId: string,
  claimData: {
    claimed: boolean;
    claimedByEmail: string;
    claimDate: string;
    verificationStatus: "Pending" | "Verified" | "Denied";
    plan?: string;
    badge101?: boolean;
  }
): Promise<boolean> {
  if (!hasAirtableConfig) {
    console.warn("Airtable not configured");
    return false;
  }

  try {
    const updateFields: any = {
      "Claimed?": claimData.claimed,
      "Claimed By Email": claimData.claimedByEmail,
      "Claim Date": claimData.claimDate,
      "Verification Status": claimData.verificationStatus,
    };

    // Update plan if provided
    if (claimData.plan) {
      updateFields["Plan"] = claimData.plan;
    }

    // Update 101 Badge if provided
    if (claimData.badge101 !== undefined) {
      updateFields["101 Badge"] = claimData.badge101;
    }

    const response = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Listings/${listingId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: updateFields,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Airtable API error:", response.status, errorText);
      return false;
    }

    console.log("Successfully updated listing claim status");
    return true;
  } catch (error) {
    console.error("Error updating listing claim:", error);
    return false;
  }
}
