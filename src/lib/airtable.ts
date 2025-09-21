import Airtable from "airtable";

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
  category: string[];
  gallery?: string[];
  logo?: string;
  location: string;
  virtual: boolean;
  ageRange: string[];
  plan: "Basic" | "Pro" | "Premium" | "Add-On";
  featured: boolean;
  approved101: boolean;
  status: "Pending" | "Approved" | "Rejected";
  dateSubmitted: string;
  dateApproved?: string;
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
    email: "", // Not in current CSV structure
    phone: "", // Not in current CSV structure
    website: "", // Not in current CSV structure
    instagram: "", // Not in current CSV structure
    servicesOffered: "", // Not in current CSV structure
    description: "", // Not in current CSV structure
    category: [], // Not in current CSV structure
    gallery: [], // Not in current CSV structure
    logo: "", // Not in current CSV structure
    location: "", // Not in current CSV structure
    virtual: false, // Not in current CSV structure
    ageRange: [], // Not in current CSV structure
    plan: "Basic", // Not in current CSV structure
    featured: false, // Not in current CSV structure
    approved101: record.get("Approved") || false,
    status: record.get("Status") || "Pending",
    dateSubmitted: record.get("Form Submitted") ? new Date().toISOString() : "",
    dateApproved: record.get("Approved") ? new Date().toISOString() : "",
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

export async function createListing(
  data: Partial<Listing>,
): Promise<string | null> {
  if (!base) {
    console.warn("Airtable not initialized - cannot create listing");
    return null;
  }

  try {
    const record = await base("Listings").create({
      "Listing Name": data.businessName,
      "Form Submitted": true,
      Reviewed: false,
      Approved: false,
      Status: "Pending",
      "Converted Paid Listing": "",
    });

    return record.id;
  } catch (error) {
    console.error("Error creating listing:", error);
    return null;
  }
}
