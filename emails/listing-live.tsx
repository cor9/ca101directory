import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type Props = {
  vendorName: string;
  listingName: string;
  slug: string;
  listingId: string;
  claimUrl: string;
  upgradeUrl: string;
  manageUrl: string;
  siteUrl?: string;
  optOutUrl: string;
};

export default function ListingLiveEmail({
  vendorName,
  listingName,
  slug,
  listingId,
  claimUrl,
  upgradeUrl,
  manageUrl,
  siteUrl = "https://directory.childactor101.com",
  optOutUrl,
}: Props) {
  const removeUrl = optOutUrl;

  return (
    <Html>
      <Head />
      <Preview>
        Your business is live on Child Actor 101 🎬 Claim or upgrade inside
      </Preview>
      <Body
        style={{
          backgroundColor: "#FFFDD0",
          fontFamily: "Inter, Arial, sans-serif",
          color: "#0C1A2B",
          padding: "32px 0",
        }}
      >
        <Container style={{ maxWidth: "600px", margin: "0 auto" }}>
          <Text style={{ fontSize: "18px", fontWeight: 600 }}>
            Hi {vendorName || "there"},
          </Text>

          <Text style={{ lineHeight: 1.6 }}>
            Your business, <strong>{listingName}</strong>, is now live on the{" "}
            <strong>
              Child Actor 101 Vendor & Industry Professionals Directory
            </strong>{" "}
            — a trusted hub where over 12,000 parents search for coaches,
            photographers, and youth-industry pros.
          </Text>

          <Text style={{ lineHeight: 1.6 }}>
            You’ve been added to our <strong>Free Listing</strong> tier so
            families can easily find you. To edit your details, upload a logo,
            or appear higher in search results, claim and upgrade here:
          </Text>

          <Section style={{ textAlign: "center", margin: "28px 0" }}>
            <Button
              href={claimUrl}
              style={{
                backgroundColor: "#E4572E",
                color: "#FFFFFF",
                fontWeight: 600,
                textDecoration: "none",
                padding: "14px 28px",
                borderRadius: 8,
                display: "inline-block",
              }}
            >
              👉 Claim & Manage My Listing
            </Button>
          </Section>

          <Text style={{ lineHeight: 1.6, marginTop: 8 }}>
            Upgrading unlocks perks like:
          </Text>
          <ul style={{ lineHeight: 1.6, paddingLeft: 24, marginTop: 0 }}>
            <li>✓ Featured placement in your category</li>
            <li>✓ Enhanced listing info</li>
            <li>✓ Logo and gallery visibility</li>
            <li>✓ 101 Approved badge eligibility</li>
            <li>✓ SEO boost and traffic analytics</li>
          </ul>

          <Section style={{ textAlign: "center", margin: "16px 0 24px" }}>
            <Button
              href={upgradeUrl}
              style={{
                backgroundColor: "#0C1A2B",
                color: "#FFFFFF",
                fontWeight: 600,
                textDecoration: "none",
                padding: "12px 22px",
                borderRadius: 8,
                display: "inline-block",
              }}
            >
              See Plans & Upgrade
            </Button>
          </Section>

          <Section style={{ textAlign: "center", margin: "14px 0 22px" }}>
            <Button
              href={manageUrl}
              style={{
                backgroundColor: "#2563eb",
                color: "#FFFFFF",
                fontWeight: 600,
                textDecoration: "none",
                padding: "10px 18px",
                borderRadius: 8,
                display: "inline-block",
              }}
            >
              Manage Listing
            </Button>
          </Section>

          <Text style={{ lineHeight: 1.6 }}>
            Prefer not to be listed? Reply to this email, or click below and
            we’ll remove your profile promptly:
          </Text>

          <Section style={{ textAlign: "center", margin: "18px 0 8px" }}>
            <Button
              href={removeUrl}
              style={{
                backgroundColor: "#DC2626",
                color: "#FFFFFF",
                fontWeight: 600,
                textDecoration: "none",
                padding: "10px 18px",
                borderRadius: 8,
                display: "inline-block",
              }}
            >
              Remove me from the directory
            </Button>
          </Section>

          <Text style={{ marginTop: 24, lineHeight: 1.6 }}>
            Thanks for being part of a community that helps parents discover
            trusted professionals.
          </Text>

          <Text style={{ marginTop: 32 }}>
            Warm regards, <br />
            <strong>Corey Ralston</strong> <br />
            Founder, Child Actor 101 <br />
            <Link
              href={siteUrl}
              style={{ color: "#3A76A6", textDecoration: "none" }}
            >
              directory.childactor101.com
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
