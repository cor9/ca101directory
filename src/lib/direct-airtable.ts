import Airtable from "airtable";

// Direct Airtable query to see all records
export async function getAllAirtableRecords() {
  const airtable = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY!,
  });
  
  const base = airtable.base(process.env.AIRTABLE_BASE_ID!);
  
  try {
    const records = await base("Listings").select({
      // Get all fields
      fields: [
        "Listing Name",
        "What You Offer?",
        "Who Is It For?",
        "Why Is It Unique?",
        "Format (In-person/Online/Hybrid)",
        "Extras/Notes",
        "Website",
        "Email",
        "Phone",
        "City",
        "State",
        "Zip",
        "Categories",
        "Age Range",
        "Profile Image",
        "Plan",
        "Status",
        "Active",
        "Featured",
        "Approved101"
      ]
    }).all();
    
    console.log(`Found ${records.length} total records in Airtable`);
    
    return records.map(record => ({
      id: record.id,
      fields: record.fields,
      createdTime: record.createdTime
    }));
  } catch (error) {
    console.error("Error fetching Airtable records:", error);
    return [];
  }
}
