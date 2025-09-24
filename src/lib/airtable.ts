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
    businessName: record.get("Business Name") || "",
    email: record.get("Email") || "",
    phone: record.get("Phone") || "",
    website: record.get("Website") || "",
    instagram: record.get("Instagram") || "",
    servicesOffered: record.get("Services Offered") || "",
    description: record.get("Description") || "",
    category: record.get("Category") || [],
    gallery: record.get("Gallery") || [],
    logo: record.get("Logo") || "",
    location: record.get("Location") || "",
    virtual: record.get("Virtual") || false,
    ageRange: record.get("Age Range") || [],
    plan: record.get("Plan") || "Basic",
    featured: record.get("Featured") || false,
    approved101: record.get("101 Approved") || false,
    status: record.get("Status") || "Pending",
    dateSubmitted: record.get("Date Submitted") ? new Date().toISOString() : "",
    dateApproved: record.get("Date Approved") ? new Date().toISOString() : "",
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
        sort: [{ field: "Business Name", direction: "asc" }],
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
      "Business Name": data.businessName,
      "Email": data.email,
      "Phone": data.phone,
      "Website": data.website,
      "Description": data.description,
      "Services Offered": data.servicesOffered,
      "Category": data.category,
      "Location": data.location,
      "Virtual": data.virtual,
      "Age Range": data.ageRange,
      "Plan": data.plan,
      "Featured": data.featured,
      "101 Approved": data.approved101,
      "Status": data.status,
      "Form Submitted": true,
      "Reviewed": false,
      "Converted Paid Listing": "",
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
