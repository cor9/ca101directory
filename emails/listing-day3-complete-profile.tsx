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
  claimUrl: string;
  manageUrl: string;
  siteUrl?: string;
};

export default function ListingDay3CompleteProfileEmail({
  vendorName,
  listingName,
  claimUrl,
  manageUrl,
  siteUrl = "https://directory.childactor101.com",
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>
        Complete your profile to appear higher in search results 📈
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
            Your listing for <strong>{listingName}</strong> is live on Child Actor 101!
          </Text>

          <Text style={{ lineHeight: 1.6 }}>
            I wanted to share a quick tip: <strong>Complete listings get 3x more views</strong> from parents searching for professionals like you.
          </Text>

          <Text style={{ lineHeight: 1.6 }}>
            Right now, your listing is showing basic information. But parents are looking for:
          </Text>

          <ul style={{ lineHeight: 1.6, paddingLeft: 24, marginTop: 0 }}>
            <li>📸 A professional logo or photo (builds trust instantly)</li>
            <li>📝 Detailed description of your services</li>
            <li>⭐ Your unique approach and specializations</li>
            <li>🎯 Who you work best with (age ranges, experience levels)</li>
          </ul>

          <Text style={{ lineHeight: 1.6 }}>
            The good news? <strong>You can add all of this in just 5 minutes.</strong>
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
              👉 Complete My Profile Now
            </Button>
          </Section>

          <Text style={{ lineHeight: 1.6, fontSize: 14, color: "#475569" }}>
            <strong>Pro tip:</strong> Listings with photos appear at the top of search results and get saved to favorites 5x more often.
          </Text>

          <Section style={{ textAlign: "center", margin: "16px 0 24px" }}>
            <Button
              href={manageUrl}
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
              Manage My Listing
            </Button>
          </Section>

          <Text style={{ marginTop: 24, lineHeight: 1.6 }}>
            Parents are searching right now — make sure they choose you.
          </Text>

          <Text style={{ marginTop: 32 }}>
            All the best, <br />
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
