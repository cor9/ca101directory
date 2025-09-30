import { NextResponse } from "next/server";
import { categoryMap, tagMap } from "@/lib/mappings";

function toAirtable(formData: any) {
  return {
    fields: {
      "Listing Name": formData.name,
      "What You Offer?": formData.description,
      "Who Is It For?": formData.introduction,
      "Why Is It Unique?": formData.unique,
      "Format (In-person/Online/Hybrid)": formData.format === "Online" ? "Online Only" : formData.format === "In-person" ? "In-Person Only" : "Hybrid (Online & In-Person)",
      "Extras/Notes": formData.notes,
      "California Child Performer Services Permit ": !!formData.performerPermit,
      "Bonded For Advanced Fees": !!formData.bonded,
      "Bond#": formData.bondNumber || "",
      "Website": formData.link,
      "Email": formData.email,
      "Phone": formData.phone,
      "City": formData.city,
      "State": formData.state,
      "Zip": formData.zip,
      "Age Range": (formData.tags || []).map((t: string) => tagMap[t] || t),
      "Categories": Array.isArray(formData.categories) ? formData.categories.map((c: string) => categoryMap[c] || c).filter(Boolean) : [],
      "Profile Image": (formData.imageId || formData.iconId)
        ? [{ url: `https://veynyzggmlgdy8nr.public.blob.vercel-storage.com/${formData.imageId || formData.iconId}` }]
        : [],
      "Plan": formData.plan, // must be one of "Free", "Basic", "Pro", "Premium"
    },
  };
}

export async function POST(req: Request) {
  try {
    const formData = await req.json();
    const record = toAirtable(formData);

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

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
