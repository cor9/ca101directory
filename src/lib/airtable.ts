import Airtable from "airtable";

// Transform form data to Airtable format with proper field mapping
function toAirtable(input: any, categoryList?: any[]) {
  const raw = Array.isArray(input) ? input[0] : input;
  const fields: Record<string, any> = {};

  // Basic fields - only include if not empty
  if (raw.name) fields["Listing Name"] = raw.name;
  if (raw.link) fields["Website"] = raw.link;
  if (raw.description) fields["What You Offer?"] = raw.description;
  if (raw.introduction) fields["Who Is It For?"] = raw.introduction;
  if (raw.unique) fields["Why Is It Unique?"] = raw.unique;
  if (raw.format) fields["Format (In-person/Online/Hybrid)"] = raw.format;
  if (raw.notes) fields["Extras/Notes"] = raw.notes;
  if (raw.email) fields["Email"] = raw.email;
  if (raw.phone) fields["Phone"] = raw.phone;
  if (raw.city) fields["City"] = raw.city;
  if (raw.state) fields["State"] = raw.state;
  if (raw.zip) fields["Zip"] = raw.zip;
  if (raw.bondNumber) fields["Bond#"] = raw.bondNumber;
  if (raw.plan) fields["Plan"] = raw.plan;

  // Booleans → checkboxes
  if (raw.performerPermit) fields["California Child Performer Services Permit"] = true;
  if (raw.bonded) fields["Bonded For Advanced Fees"] = true;

  // Tags → map to Airtable Age Range options
  if (raw.tags?.length) {
    fields["Age Range"] = raw.tags.map((t: string) => {
      switch (t) {
        case "tag-1": return "5-8";
        case "tag-2": return "9-12";
        case "tag-3": return "13-17";
        case "tag-4": return "18+";
        default: return t;
      }
    });
  }

  // Categories → convert IDs to labels
  if (raw.categories?.length) {
    fields["Categories"] = raw.categories.map((c: string) => {
      switch (c) {
        case "recxsGFD5Xs9eSrrT": return "Audition Prep";
        case "recU2Jd1GsEfx3dXN": return "Acting Camps";
        case "recGWyL3dBfz7nDah": return "Acting Schools";
        case "rec4gFz49LQTQpzhw": return "Acting Classes & Coaches";
        case "recBPeoMS8Ghm2mRt": return "Headshot Photographers";
        case "recTSyIC1sely9Fwl": return "Demo Reel Creators";
        case "recAPXv9eCyzYgcgr": return "Reels Editors";
        case "recrSwhgGyYYlOMR4": return "Vocal Coaches";
        case "rec0eZlDZC86OjLkd": return "Talent Managers";
        case "rec2mbj4iZVFfYbtH": return "Branding Coaches";
        case "rec3jCyLDaKsL36wY": return "Mental Health for Performers";
        case "recDaDp71kATa5Nho": return "Theatre Training";
        case "recEzCXUrNjduDPv3": return "Photobooths";
        case "recFtiDORwyd6Ej0W": return "Voiceover Studios";
        case "recHRNvMQqmImHd88": return "Wardrobe Stylists";
        case "recJ49lV4DM7viH4r": return "Casting Workshops";
        case "recLAGc9mi29wP6Ly": return "Hair/Makeup Artists";
        case "recaKFcvvAY3NqkF0": return "Social Media Consultants";
        case "recbLZdIkrvWBu4gC": return "Publicists";
        case "reco5EsuJlr5Fsgzq": return "Financial Advisors";
        case "recuEMmRy0yDs4lMq": return "On-Set Tutors";
        case "recuGGsXdALBP95rU": return "Entertainment Lawyers";
        case "recuUt5HgXOqd8wjD": return "Costume Rental";
        case "recvBdvbiJdHP6IiT": return "Self-Tape Studios";
        case "recyn6J2gCtzSVkVn": return "College Prep Coaches";
        default: return c;
      }
    });
  }

  // Attachments → turn blob ID into public URL
  if (raw.iconId && typeof raw.iconId === "string") {
    fields["Profile Image"] = [
      {
        url: `https://ca101directory.public.blob.vercel-storage.com/${raw.iconId}`
      }
    ];
  }

  // Set default status
  fields["Status"] = "Pending";

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

export async function createListing(
  data: FormData,
  categoryList?: any[],
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
