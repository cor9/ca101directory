import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Button,
  Link,
  Section,
} from "@react-email/components";

type Props = {
  vendorName: string;
  listingName: string;
  viewCount?: number;
  claimUrl: string;
  upgradeUrl: string;
  siteUrl?: string;
};

export default function ListingDay7TrafficUpdateEmail({
  vendorName,
  listingName,
  viewCount = 0,
  claimUrl,
  upgradeUrl,
  siteUrl = "https://directory.childactor101.com",
}: Props) {
  const hasViews = viewCount > 0;
  const viewText = hasViews
    ? `Your listing has been viewed <strong>${viewCount} times</strong> this week`
    : `Parents are finding your listing on Child Actor 101`;

  return (
    <Html>
      <Head />
      <Preview>
        {hasViews ? `${viewCount} parents viewed your listing this week 👀` : `Parents are finding you on Child Actor 101 👀`}
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
            Great news about <strong>{listingName}</strong>!
          </Text>

          <Section
            style={{
              backgroundColor: "#FEF3C7",
              padding: "20px",
              borderRadius: 8,
              border: "2px solid #FCD34D",
              margin: "20px 0"
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: 600, margin: 0, textAlign: "center" }}>
              📊 {viewText}
            </Text>
          </Section>

          <Text style={{ lineHeight: 1.6 }}>
            These are real parents actively searching for professionals like you in our directory of 250+ trusted vendors.
          </Text>

          <Text style={{ lineHeight: 1.6 }}>
            Here's what happens next:
          </Text>

          <ul style={{ lineHeight: 1.6, paddingLeft: 24, marginTop: 0 }}>
            <li>🔍 Parents search by category, location, and specialization</li>
            <li>📱 They click on listings that stand out (photos, detailed info)</li>
            <li>⭐ They save favorites and reach out to vendors they trust</li>
            <li>💼 <strong>Free listings appear at the bottom</strong> of search results</li>
          </ul>

          <Text style={{ lineHeight: 1.6 }}>
            <strong>Right now, parents are seeing your basic info at the bottom of the list.</strong> Want to appear at the top and get more inquiries?
          </Text>

          <Section style={{ textAlign: "center", margin: "28px 0" }}>
            <Button
              href={upgradeUrl}
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
              👉 Get Featured Placement
            </Button>
          </Section>

          <Text style={{ lineHeight: 1.6 }}>
            <strong>Pro members get:</strong>
          </Text>

          <ul style={{ lineHeight: 1.6, paddingLeft: 24, marginTop: 0 }}>
            <li>✓ <strong>Top placement</strong> in your category</li>
            <li>✓ Logo + gallery (4 photos)</li>
            <li>✓ Social media links</li>
            <li>✓ 101 Approved Badge eligibility (builds instant trust)</li>
            <li>✓ <strong>3-5x more profile views</strong></li>
          </ul>

          <Section style={{ textAlign: "center", margin: "16px 0 24px" }}>
            <Button
              href={claimUrl}
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
              See Plans & Pricing
            </Button>
          </Section>

          <Text style={{ marginTop: 24, lineHeight: 1.6, fontSize: 14, color: "#475569" }}>
            💰 <strong>Limited time:</strong> Founding members get 6 months of Pro for just $199 (normally $300). Lock in this price forever.
          </Text>

          <Text style={{ marginTop: 32 }}>
            Here to help, <br />
            <strong>Corey Ralston</strong> <br />
            Founder, Child Actor 101 <br />
            <Link href={siteUrl} style={{ color: "#3A76A6", textDecoration: "none" }}>
              directory.childactor101.com
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
