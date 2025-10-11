// Fix Supabase auto-confirmation issue
// Run this with: node fix-email-confirmation.js YOUR_ACCESS_TOKEN

const projectId = "crkrittfvylvbtjetxoa";
const accessToken = process.argv[2];

if (!accessToken) {
  console.log("❌ Please provide your access token:");
  console.log("node fix-email-confirmation.js YOUR_ACCESS_TOKEN");
  console.log("");
  console.log("Get token from: https://supabase.com/dashboard/account/tokens");
  process.exit(1);
}

async function disableAutoConfirmation() {
  try {
    console.log("🔧 Disabling auto-confirmation...");

    const response = await fetch(
      `https://api.supabase.com/v1/projects/${projectId}/config/auth`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mailer_autoconfirm: false,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    const result = await response.json();
    console.log("✅ SUCCESS! Auto-confirmation disabled!");
    console.log("✅ Users will now see email confirmation message!");
    console.log("✅ They must click email link to activate account!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.log("");
    console.log("Make sure:");
    console.log("1. Your access token is correct");
    console.log("2. Token has admin permissions");
    console.log(
      "3. Get token from: https://supabase.com/dashboard/account/tokens",
    );
  }
}

disableAutoConfirmation();
