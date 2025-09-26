import Airtable from "airtable";
import { categoryMap, tagMap } from "./mappings";

// Transform form data to Airtable format with proper field mapping
export function toAirtable(raw: any) {
  console.log("🔍 toAirtable INPUT:", JSON.stringify(raw, null, 2));
  const fields: Record<string, any> = {};

  // Basic fields
  fields["Listing Name"] = raw.name;
  fields["Website"] = raw.link;
  fields["What You Offer?"] = raw.description;
  fields["Who Is It For?"] = raw.introduction;
  fields["Why Is It Unique?"] = raw.unique;
  fields["Format (In-person/Online/Hybrid)"] = raw.format;
  fields["Extras/Notes"] = raw.notes;
  fields["Email"] = raw.email;
  fields["Phone"] = raw.phone;
  fields["City"] = raw.city;
  fields["State"] = raw.state;
  fields["Zip"] = raw.zip;
  fields["Bond#"] = raw.bondNumber;
  fields["Plan"] = raw.plan;
  fields["California Child Performer Services Permit"] = !!raw.performerPermit;
  fields["Bonded For Advanced Fees"] = !!raw.bonded;

  // ✅ FORCE MAP categories: IDs → Labels
  if (raw.categories?.length) {
    console.log("🔍 RAW CATEGORIES:", raw.categories);
    const mappedCategories = raw.categories
      .map((c: string) => {
        const mapped = categoryMap[c] || c;
        console.log(`🔍 Mapping ${c} → ${mapped}`);
        return mapped;
      })
      .map((c: string) => c.trim())
      .filter(Boolean);
    console.log("🔍 MAPPED CATEGORIES:", mappedCategories);
    fields["Categories"] = mappedCategories;
  }

  // ✅ FORCE MAP tags: fake values → real labels
  if (raw.tags?.length) {
    console.log("🔍 RAW TAGS:", raw.tags);
    const mappedTags = raw.tags
      .map((t: string) => {
        const mapped = tagMap[t] || t;
        console.log(`🔍 Mapping ${t} → ${mapped}`);
        return mapped;
      })
      .map((t: string) => t.trim())
      .filter(Boolean);
    console.log("🔍 MAPPED TAGS:", mappedTags);
    fields["Age Range"] = mappedTags;
  }

  // ✅ Blob ID → Airtable attachment
  if (raw.iconId) {
    console.log("🔍 RAW ICONID:", raw.iconId);
    const imageUrl = raw.iconId.startsWith("http")
      ? raw.iconId
      : `https://veynyzggmlgdy8nr.public.blob.vercel-storage.com/${raw.iconId}`;
    console.log("🔍 IMAGE URL:", imageUrl);
    fields["Profile Image"] = [
      {
        url: imageUrl,
      },
    ];
  }

  fields["Status"] = "Pending";

  console.log("🔍 toAirtable OUTPUT:", JSON.stringify({ fields }, null, 2));
  return { fields };
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
  status: "Pending" | "Approved" | "Rejected";
  dateSubmitted: string;
  dateApproved?: string;
  performerPermit?: boolean;
  bonded?: boolean;
  bondNumber?: string;
}

export interface Category {
  id: string;
  categoryName: string;
  description?: string;
  icon?: string;
}

// Helper function to convert Airtable record to our interface
function recordToListing(record: Airtable.Record<any>): Listing {
  return {
    id: record.id,
    businessName: record.get("Listing Name") || "",
    email: record.get("Email") || "",
    phone: record.get("Phone") || "",
    website: record.get("Website") || "",
    instagram: record.get("Instagram") || "",
    servicesOffered: record.get("Who Is It For?") || "",
    description: record.get("What You Offer?") || "",
    uniqueValue: record.get("Why Is It Unique?") || "",
    format: record.get("Format (In-person/Online/Hybrid)") || "",
    notes: record.get("Extras/Notes") || "",
    categories: record.get("Categories") || [],
    tags: record.get("Tags") || [],
    gallery: record.get("Gallery") || [],
    logo: record.get("Profile Image") || "",
    location:
      record.get("City") && record.get("State")
        ? `${record.get("City")}, ${record.get("State")}`
        : "",
    virtual: false,
    plan: record.get("Plan") || "Basic",
    featured: record.get("Top Rated") || false,
    approved101: record.get("Approved Badge") || false,
    status: record.get("Status") || "Pending",
    dateSubmitted: record.get("Submissions") ? new Date().toISOString() : "",
    dateApproved: record.get("Approved Badge") ? new Date().toISOString() : "",
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
        filterByFormula: "{Status} = 'Live'",
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
  iconId?: string | unknown; // Optional and can be unknown type
}

export async function createListing(data: FormData): Promise<string | null> {
  console.log("createListing called with data:", data);

  if (!base) {
    console.warn("Airtable not initialized - cannot create listing");
    console.log("Airtable config check:", {
      hasApiKey: !!process.env.AIRTABLE_API_KEY,
      hasBaseId: !!process.env.AIRTABLE_BASE_ID,
      apiKeyLength: process.env.AIRTABLE_API_KEY?.length,
      baseId: process.env.AIRTABLE_BASE_ID,
    });
    return null;
  }

  try {
    console.log("Creating listing with data:", data);

    // Transform the data using the new toAirtable function
    const airtablePayload = toAirtable(data);
    console.log("Transformed Airtable payload:", airtablePayload);

    const record = await base("Listings").create(airtablePayload.fields);

    console.log("Successfully created listing:", record.id);
    return record.id;
  } catch (error) {
    console.error("Error creating listing:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      data: data,
    });

    // Log more specific error information
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error name:", error.name);
    }

    // Try to get more details from Airtable error
    if (error && typeof error === "object" && "error" in error) {
      console.error("Airtable error details:", error.error);
    }

    return null;
  }
}
