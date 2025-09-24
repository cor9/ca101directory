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
  uniqueValue?: string;
  format?: string;
  notes?: string;
  category: string[];
  gallery?: string[];
  logo?: string;
  location: string;
  city?: string;
  state?: string;
  zip?: string;
  virtual: boolean;
  ageRange: string[];
  plan: "Basic" | "Pro" | "Premium" | "Add-On";
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
    category: record.get("Categories") || [],
    gallery: record.get("Gallery") || [],
    logo: record.get("Profile Image") || "",
    location:
      record.get("City") && record.get("State")
        ? `${record.get("City")}, ${record.get("State")}`
        : "",
    virtual: false,
    ageRange: record.get("Age Range") || [],
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

export async function createListing(
  data: Partial<Listing>,
): Promise<string | null> {
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

    const airtableData = {
      "Listing Name": data.businessName,
      "What You Offer?": data.description,
      "Who Is It For?": data.servicesOffered,
      "Why Is It Unique?": data.uniqueValue,
      "Format (In-person/Online/Hybrid)": data.format,
      "Extras/Notes": data.notes,
      Website: data.website,
      Email: data.email,
      Phone: data.phone,
      City: data.city,
      State: data.state,
      Zip: data.zip,
      "Age Range": data.ageRange,
      Categories: data.category,
      Plan: data.plan,
      Status: data.status,
    };

    console.log("Airtable data to create:", airtableData);

    const record = await base("Listings").create(airtableData);

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

    return null;
  }
}
