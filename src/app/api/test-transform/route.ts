import { getCategories } from "@/lib/airtable";
import { type NextRequest, NextResponse } from "next/server";

// Transform function (moved to top level to avoid ES5 strict mode error)
function toAirtable(input: any, categoryList?: any[]) {
  const raw = Array.isArray(input) ? input[0] : input;
  const fields: Record<string, any> = {};

  // Map form fields to Airtable field names
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

  // Handle boolean fields
  if (raw.performerPermit) {
    fields["California Child Performer Services Permit"] = true;
  }
  if (raw.bonded) {
    fields["Bonded For Advanced Fees"] = true;
  }

  // Handle multi-select fields
  if (raw.tags?.length) fields["Age Range"] = raw.tags;
  if (raw.categories?.length) {
    // Convert category IDs to category names for multi-select
    const categoryNames = raw.categories
      .map((categoryId: string) => {
        if (typeof categoryId === "string" && categoryId.startsWith("rec")) {
          // This is a record ID, convert it to the category name
          return categoryList?.find((cat) => cat.id === categoryId)?.categoryName;
        } else {
          // This is already a category name
          return categoryId;
        }
      })
      .filter(Boolean); // Remove any undefined values
    
    if (categoryNames.length > 0) {
      fields["Categories"] = categoryNames;
    }
  }

  // Handle Vercel Blob attachment
  if (raw.iconId) {
    fields["Profile Image"] = [
      {
        url: `https://ca101directory.public.blob.vercel-storage.com/${raw.iconId}`,
      },
    ];
  }

  return { fields };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Test transform - received data:", body);

    // Get categories for testing
    const categoryList = await getCategories();
    console.log("Test transform - categories:", categoryList);

    // Test the transform
    const transformed = toAirtable(body, categoryList);
    console.log("Test transform - result:", transformed);

    return NextResponse.json({
      success: true,
      original: body,
      transformed: transformed,
      categories: categoryList,
    });
  } catch (error) {
    console.error("Test transform error:", error);
    return NextResponse.json(
      { error: "Transform test failed", details: error },
      { status: 500 },
    );
  }
}

