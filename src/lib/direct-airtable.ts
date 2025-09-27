import Airtable from "airtable";

// Direct Airtable query to see all records
export async function getAllAirtableRecords() {
  const airtable = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY!,
  });

  const base = airtable.base(process.env.AIRTABLE_BASE_ID!);

  try {
    const records = await base("Listings")
      .select({
        // Get basic fields first to see what exists
        fields: [
          "Listing Name",
          "Email",
          "Phone",
          "Website",
          "Status",
          "Plan",
        ],
      })
      .all();

    console.log(`Found ${records.length} total records in Airtable`);

    return records.map((record) => ({
      id: record.id,
      fields: record.fields,
      createdTime: record.createdTime,
    }));
  } catch (error) {
    console.error("Error fetching Airtable records:", error);
    return [];
  }
}
