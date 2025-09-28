import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ClaimVerificationEmailProps {
  to: string;
  businessName: string;
  listingName: string;
  verificationToken: string;
  listingSlug: string;
}

export async function sendClaimVerificationEmail({
  to,
  businessName,
  listingName,
  verificationToken,
  listingSlug,
}: ClaimVerificationEmailProps) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-claim/${verificationToken}`;

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_EMAIL_FROM!,
      to: [to],
      subject: `Verify Your Listing Claim - ${businessName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3B82F6, #F97316); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Child Actor 101 Directory</h1>
            <p style="color: white; margin: 10px 0 0 0;">Listing Claim Verification</p>
          </div>
          
          <div style="padding: 30px;">
            <h2 style="color: #1F2937; margin-bottom: 20px;">Verify Your Listing Claim</h2>
            
            <p style="color: #6B7280; line-height: 1.6;">
              Hello ${businessName},
            </p>
            
            <p style="color: #6B7280; line-height: 1.6;">
              You've requested to claim the listing "<strong>${listingName}</strong>" in the Child Actor 101 Directory.
            </p>
            
            <p style="color: #6B7280; line-height: 1.6;">
              To complete the verification process and gain control of your listing, please click the button below:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: #F97316; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Verify & Claim Listing
              </a>
            </div>
            
            <p style="color: #6B7280; line-height: 1.6; font-size: 14px;">
              This verification link will expire in 24 hours. If you didn't request this claim, please ignore this email.
            </p>
            
            <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1F2937; margin-top: 0;">What happens after verification?</h3>
              <ul style="color: #6B7280; line-height: 1.6;">
                <li>✅ Full control over your listing details</li>
                <li>✅ Ability to edit contact information</li>
                <li>✅ Access to upgrade to Pro/Premium plans</li>
                <li>✅ View analytics and performance metrics</li>
              </ul>
            </div>
            
            <p style="color: #6B7280; line-height: 1.6; font-size: 14px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${verificationUrl}" style="color: #3B82F6;">${verificationUrl}</a>
            </p>
          </div>
          
          <div style="background: #F9FAFB; padding: 20px; text-align: center; border-top: 1px solid #E5E7EB;">
            <p style="color: #6B7280; font-size: 14px; margin: 0;">
              Child Actor 101 Directory | <a href="mailto:corey@childactor101.com" style="color: #3B82F6;">Contact Support</a>
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Email send error:", error);
      throw new Error("Failed to send verification email");
    }

    return data;
  } catch (error) {
    console.error("Claim verification email error:", error);
    throw error;
  }
}
