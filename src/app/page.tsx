export default function MinimalHomePage() {
  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h1>🎭 Child Actor 101 Directory</h1>
      <p>Find trusted acting professionals for your child's acting career.</p>
      <p>
        <strong>Domain:</strong> https://directory.childactor101.com
      </p>

      <h2>Status: Under Construction</h2>
      <p>We're currently setting up our directory. Please check back soon!</p>

      <h2>Environment Check:</h2>
      <ul>
        <li>
          NEXTAUTH_SECRET:{" "}
          {process.env.NEXTAUTH_SECRET ? "✅ Configured" : "❌ Missing"}
        </li>
        <li>
          AIRTABLE_API_KEY:{" "}
          {process.env.AIRTABLE_API_KEY ? "✅ Configured" : "❌ Missing"}
        </li>
        <li>
          AIRTABLE_BASE_ID:{" "}
          {process.env.AIRTABLE_BASE_ID ? "✅ Configured" : "❌ Missing"}
        </li>
      </ul>

      <h2>OAuth Status:</h2>
      <div
        style={{
          background: "#e7f3ff",
          padding: "10px",
          border: "1px solid #b3d9ff",
          borderRadius: "5px",
          margin: "20px 0",
        }}
      >
        <strong>🔄 OAuth Approval in Progress:</strong> Google and Facebook
        OAuth providers are temporarily disabled while waiting for approval (can
        take 48+ hours). Email/password authentication is available.
      </div>

      {!process.env.AIRTABLE_API_KEY && (
        <div
          style={{
            background: "#fff3cd",
            padding: "10px",
            border: "1px solid #ffeaa7",
            borderRadius: "5px",
            margin: "20px 0",
          }}
        >
          <strong>⚠️ Configuration Required:</strong> Environment variables are
          not configured. Please add them to your Vercel project settings for
          full functionality.
        </div>
      )}

      <p>
        <a href="/test">View Test Page</a>
      </p>
    </div>
  );
}
