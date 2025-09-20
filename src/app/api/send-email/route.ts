import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

function isValidOrigin(requestHeaders: Headers): boolean {
  const origin = requestHeaders.get('origin');
  const referer = requestHeaders.get('referer');
  console.log('isValidOrigin, origin', origin);
  console.log('isValidOrigin, referer', referer);

  const allowedDomains = [
    process.env.NEXT_PUBLIC_APP_URL,
    'http://localhost:3000'
  ].filter(Boolean);

  return allowedDomains.some(domain => 
    origin?.includes(domain as string) ||
    referer?.includes(domain as string)
  );
}

/**
 * Simplified email sending for Child Actor 101 Directory
 * This will be extended to integrate with Airtable when needed
 */
export async function POST(request: Request) {
  try {
    // check if the request is from a valid origin
    const headersList = headers();
    if (!isValidOrigin(headersList)) {
      return NextResponse.json(
        { message: 'Unauthorized request origin' },
        { status: 403 }
      );
    }

    const body = await request.json();
    console.log('SendEmail request:', body);

    // TODO: Implement email sending with Airtable integration
    // This would include:
    // 1. Get listing details from Airtable
    // 2. Send approval/rejection emails based on status
    // 3. Use Resend or similar email service

    return NextResponse.json({ message: 'Email functionality pending Airtable integration' }, { status: 200 });
  } catch (error) {
    console.error('Error in send-email:', error);
    return NextResponse.json(
      { message: 'Failed to process email request' },
      { status: 500 }
    );
  }
}
