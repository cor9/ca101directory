import Airtable from "airtable";

// Transform form data to Airtable format with proper field mapping
function toAirtable(input: any, categoryList?: any[]) {
  const raw = Array.isArray(input) ? input[0] : input;
  const fields: Record<string, any> = {};

  // Map form fields to Airtable field names
  if (raw.name) fields["Listing Name"] = raw.name;
  if (raw.link) fields["Website"] = raw.link;
  if (raw.description) fields["Description"] = raw.description;
  if (raw.introduction) fields["Introduction"] = raw.introduction;
  if (raw.unique) fields["Unique"] = raw.unique;
  if (raw.format) fields["Format"] = raw.format;
  if (raw.notes) fields["Notes"] = raw.notes;
  if (raw.email) fields["Email"] = raw.email;
  if (raw.phone) fields["Phone"] = raw.phone;
  if (raw.city) fields["City"] = raw.city;
  if (raw.state) fields["State"] = raw.state;
  if (raw.zip) fields["Zip"] = raw.zip;
  if (raw.bondNumber) fields["Bond#"] = raw.bondNumber;
  if (raw.plan) fields["Plan"] = raw.plan;

  // Handle boolean fields
  if (raw.performerPermit) {
    fields["California Child Performer Services Permit"] = true;
  }
  if (raw.bonded) {
    fields["Bonded For Advanced Fees"] = true;
  }

  // Handle multi-select fields
  if (raw.tags?.length) fields["Tags"] = raw.tags;
  if (raw.categories?.length) {
    // Convert category IDs to labels
    const categoryId = raw.categories[0] || raw.categories;
    if (typeof categoryId === 'string' && categoryId.startsWith('rec')) {
      // This is a record ID, convert it to the category name
      const categoryName = categoryList?.find(cat => cat.id === categoryId)?.categoryName || "Acting Classes";
      fields["Categories"] = categoryName;
    } else {
      // This is already a category name
      fields["Categories"] = categoryId;
    }
  }

  // Handle Vercel Blob attachment
  if (raw.iconId) {
    fields["Profile Image"] = [
      {
        url: `https://ca101directory.public.blob.vercel-storage.com/${raw.iconId}`
      }
    ];
  }

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
  categories: string; // Single select field in Airtable (for now)
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
    categories: record.get("Categories") || "",
    tags: [], // Not implemented yet in Airtable
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

export async function createListing(
  data: Partial<Listing>,
  categoryList?: any[]
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

    // Transform the data using the new toAirtable function
    const airtablePayload = toAirtable(data, categoryList);
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
