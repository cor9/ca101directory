import { submit } from "@/actions/submit";

export async function GET() {
  try {
    console.log("Testing form submission...");
    
    // Simulate the exact data the form would send
    const formData = {
      name: "Test Business",
      link: "https://example.com",
      description: "Test description",
      introduction: "Test services",
      unique: "Test unique value",
      format: "In-person",
      notes: "Test notes",
      email: "test@example.com",
      phone: "555-1234",
      city: "Test City",
      state: "CA",
      zip: "90210",
      bondNumber: "12345",
      performerPermit: true,
      bonded: false,
      categories: ["acting-classes"], // This is what the form sends (category IDs)
      tags: ["5-8", "9-12"],
      plan: "Basic",
      imageId: "",
      iconId: "", // Add this required field
    };

    console.log("Submitting form data:", formData);
    
    const result = await submit(formData);
    
    console.log("Form submission result:", result);
    
    return Response.json({
      success: true,
      message: "Form submission test completed",
      result: result,
    });
    
  } catch (error) {
    console.error("Form submission test error:", error);
    return Response.json({
      success: false,
      message: `Form submission test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
