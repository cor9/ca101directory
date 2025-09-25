import { NextRequest, NextResponse } from "next/server";
import { getCategories } from "@/lib/airtable";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Test transform - received data:", body);

    // Get categories for testing
    const categoryList = await getCategories();
    console.log("Test transform - categories:", categoryList);

    // Transform function (same as in airtable.ts)
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

    // Test the transform
    const transformed = toAirtable(body, categoryList);
    console.log("Test transform - result:", transformed);

    return NextResponse.json({
      success: true,
      original: body,
      transformed: transformed,
      categories: categoryList
    });

  } catch (error) {
    console.error("Test transform error:", error);
    return NextResponse.json(
      { error: "Transform test failed", details: error },
      { status: 500 }
    );
  }
}
