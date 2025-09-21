export default function TestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>✅ Child Actor 101 Directory - Test Page</h1>
      <p>This is a simple test page to verify that Vercel deployment is working.</p>
      <p>If you can see this page, the basic routing is working correctly.</p>
      
      <h2>Environment Variables Status:</h2>
      <ul>
        <li>NEXTAUTH_SECRET: {process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing'}</li>
        <li>AIRTABLE_API_KEY: {process.env.AIRTABLE_API_KEY ? '✅ Set' : '❌ Missing'}</li>
        <li>AIRTABLE_BASE_ID: {process.env.AIRTABLE_BASE_ID ? '✅ Set' : '❌ Missing'}</li>
        <li>NODE_ENV: {process.env.NODE_ENV || 'Not set'}</li>
      </ul>
      
      <h2>Next Steps:</h2>
      <p>If environment variables are missing, you need to add them to your Vercel project settings.</p>
    </div>
  );
}
