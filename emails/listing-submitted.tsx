import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ListingSubmittedEmailProps {
  vendorName: string;
  listingName: string;
  listingId: string;
  plan: string;
  isEdit?: boolean;
}

export default function ListingSubmittedEmail({
  vendorName = "Vendor",
  listingName = "Your Listing",
  listingId = "123",
  plan = "Free",
  isEdit = false,
}: ListingSubmittedEmailProps) {
  const isPaidPlan = plan !== "Free" && plan !== "free";
  const action = isEdit ? "updated" : "submitted";
  const reviewTime =
    isPaidPlan && !isEdit
      ? "Your listing is now live!"
      : "Listings are typically reviewed within 24-48 hours.";

  return (
    <Html>
      <Head />
      <Preview>
        {isEdit ? "Listing Updated" : "Listing Submitted"} - {listingName}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://directory.childactor101.com/logo.png"
            width="150"
            height="75"
            alt="Child Actor 101 Directory"
            style={logo}
          />

          <Heading style={h1}>
            ✅ Listing {isEdit ? "Updated" : "Submitted"} Successfully!
          </Heading>

          <Text style={text}>Hi {vendorName},</Text>

          <Text style={text}>
            {isEdit
              ? `Your updates to "${listingName}" have been successfully submitted.`
              : `Thank you for submitting "${listingName}" to Child Actor 101 Directory!`}
          </Text>

          <Section style={infoBox}>
            <Text style={infoText}>
              <strong>Plan:</strong> {plan}
            </Text>
            {!isPaidPlan && (
              <Text style={infoText}>
                💡 Want more features? Upgrade to Standard or Pro for enhanced
                visibility, gallery images, and priority placement.
              </Text>
            )}
          </Section>

          <Text style={text}>
            <strong>What happens next?</strong>
          </Text>

          {isPaidPlan && !isEdit ? (
            <>
              <Text style={text}>
                🎉 Your listing is already live and visible in the directory!
              </Text>
              <Text style={text}>
                Parents and industry professionals can now find and contact you.
              </Text>
            </>
          ) : isEdit ? (
            <>
              <Text style={text}>
                📝 Your listing remains visible with the current information
                while our team reviews your changes.
              </Text>
              <Text style={text}>{reviewTime}</Text>
              <Text style={text}>
                Once approved, your changes will go live and you'll receive
                another confirmation email.
              </Text>
            </>
          ) : (
            <>
              <Text style={text}>
                📝 Our team will review your listing to ensure quality and
                accuracy.
              </Text>
              <Text style={text}>{reviewTime}</Text>
              <Text style={text}>
                Once approved, your listing will go live and you'll receive a
                confirmation email with your live link!
              </Text>
            </>
          )}

          <Section style={buttonContainer}>
            <Button
              style={button}
              href={`https://directory.childactor101.com/dashboard/vendor/listing`}
            >
              View Your Dashboard
            </Button>
          </Section>

          <Text style={text}>
            Questions? Contact us at{" "}
            <Link href="mailto:corey@childactor101.com" style={link}>
              corey@childactor101.com
            </Link>
          </Text>

          <Text style={footer}>
            © 2025 Child Actor 101 Directory. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const logo = {
  margin: "0 auto",
  display: "block",
};

const h1 = {
  color: "#1F2327",
  fontSize: "32px",
  fontWeight: "700",
  margin: "40px 0",
  padding: "0",
  textAlign: "center" as const,
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 24px",
};

const infoBox = {
  backgroundColor: "#f0f7ff",
  border: "1px solid #d1e7ff",
  borderRadius: "8px",
  padding: "16px",
  margin: "24px",
};

const infoText = {
  color: "#333",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "8px 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#FF6B35",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "700",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 32px",
};

const link = {
  color: "#0066CC",
  textDecoration: "underline",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  margin: "24px",
  textAlign: "center" as const,
};
