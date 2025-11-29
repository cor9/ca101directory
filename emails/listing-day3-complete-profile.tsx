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
      <Preview>Complete your profile to appear higher in search results</Preview>
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
            Your listing for <strong>{listingName}</strong> is live on Child
            Actor 101.
          </Text>

          <Text style={{ lineHeight: 1.6 }}>
            One quick note from the data: listings that feel complete and
            professional often get several times more views from parents who are
            actively searching for support.
          </Text>

          <Text style={{ lineHeight: 1.6 }}>
            Right now, your listing is showing only the basics. Parents are
            looking for:
          </Text>

          <ul style={{ lineHeight: 1.6, paddingLeft: 24, marginTop: 0 }}>
            <li>A logo or photo that immediately signals trust.</li>
            <li>
              A clear description of what you offer and how you work with young
              performers.
            </li>
            <li>Your unique approach and specializations.</li>
            <li>
              Who you work best with, including age ranges and experience
              levels.
            </li>
          </ul>

          <Text style={{ lineHeight: 1.6 }}>
            The good news: you can add all of this in a few minutes.
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
              Complete My Profile Now
            </Button>
          </Section>

          <Text
            style={{
              lineHeight: 1.6,
              fontSize: 14,
              color: "#475569",
            }}
          >
            A simple upgrade, like adding photos and a stronger description, can
            move you higher in search results and make it much more likely that
            parents save and contact your listing.
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
            Parents are searching right now. A complete profile makes it much
            easier for them to choose you.
          </Text>

          <Text style={{ marginTop: 32 }}>
            All the best, <br />
            <strong>Corey Ralston</strong> <br />
            Founder, Child Actor 101 <br />
            <Link
              href={siteUrl}
              style={{ color: "#3A76A6", textDecoration: "none" }}
            >
              directory.childactor101.com
            </Link>
          </Text>

          <Text
            style={{
              marginTop: 24,
              fontSize: 11,
              color: "#94A3B8",
              lineHeight: 1.6,
            }}
          >
            You are receiving this email because you created or claimed a
            listing in the Child Actor 101 Directory.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
