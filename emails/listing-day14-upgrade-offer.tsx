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
  upgradeUrl: string;
  siteUrl?: string;
};

export default function ListingDay14UpgradeOfferEmail({
  vendorName,
  listingName,
  viewCount = 0,
  upgradeUrl,
  siteUrl = "https://directory.childactor101.com",
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>
        You're missing out on {viewCount > 0 ? `${viewCount}+` : 'dozens of'} parent inquiries 💼
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
            I wanted to reach out personally about <strong>{listingName}</strong>.
          </Text>

          <Text style={{ lineHeight: 1.6 }}>
            It's been 2 weeks since your listing went live, and here's what I'm seeing:
          </Text>

          <Section
            style={{
              backgroundColor: "#DBEAFE",
              padding: "20px",
              borderRadius: 8,
              border: "2px solid #60A5FA",
              margin: "20px 0"
            }}
          >
            <Text style={{ fontSize: 15, margin: "0 0 12px 0" }}>
              📊 <strong>Your Stats:</strong>
            </Text>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
              {viewCount > 0 && <li>{viewCount} parents viewed your profile</li>}
              <li>Your listing appears on page 3-4 of search results</li>
              <li>Parents are favoriting competitors with photos</li>
              <li><strong>0 inquiries from the directory</strong> (free tier limitation)</li>
            </ul>
          </Section>

          <Text style={{ lineHeight: 1.6 }}>
            Meanwhile, <strong>Pro members in your category are getting 3-5 inquiries per week</strong> from qualified parents ready to book.
          </Text>

          <Text style={{ lineHeight: 1.6, fontSize: 16, fontWeight: 600, color: "#DC2626" }}>
            The difference? They show up at the top with professional photos and trust signals.
          </Text>

          <Section
            style={{
              backgroundColor: "#FEF3C7",
              padding: "20px",
              borderRadius: 8,
              margin: "24px 0"
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: 600, margin: "0 0 12px 0", textAlign: "center" }}>
              💎 What You're Missing:
            </Text>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
              <li><strong>Top placement</strong> — appear first in search results</li>
              <li><strong>Professional photos</strong> — logo + gallery (4 images)</li>
              <li><strong>Trust badges</strong> — 101 Approved badge eligibility</li>
              <li><strong>Social proof</strong> — reviews & ratings display</li>
              <li><strong>Direct inquiries</strong> — contact button prominently displayed</li>
              <li><strong>Analytics</strong> — see exactly how parents find you</li>
            </ul>
          </Section>

          <Section style={{ textAlign: "center", margin: "28px 0" }}>
            <Button
              href={upgradeUrl}
              style={{
                backgroundColor: "#E4572E",
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: 16,
                textDecoration: "none",
                padding: "16px 32px",
                borderRadius: 8,
                display: "inline-block",
              }}
            >
              🚀 Upgrade to Pro — Start Getting Inquiries
            </Button>
          </Section>

          <Section
            style={{
              backgroundColor: "#FEE2E2",
              padding: "16px",
              borderRadius: 8,
              margin: "24px 0"
            }}
          >
            <Text style={{ fontSize: 14, margin: 0, textAlign: "center", color: "#991B1B" }}>
              ⏰ <strong>Founding Member Pricing Ends Soon:</strong> $199 for 6 months of Pro (normally $300)<br />
              Lock in this rate forever + get founding vendor badge
            </Text>
          </Section>

          <Text style={{ lineHeight: 1.6 }}>
            <strong>Here's my honest recommendation:</strong>
          </Text>

          <Text style={{ lineHeight: 1.6 }}>
            If you're serious about getting clients from the directory, Pro pays for itself with just 1-2 bookings. Our Pro members say it's the best marketing investment they've made.
          </Text>

          <Text style={{ lineHeight: 1.6 }}>
            If you're not ready to invest in your listing, that's okay too — your free listing will stay up. But you'll continue to appear at the bottom while competitors capture the inquiries.
          </Text>

          <Section style={{ textAlign: "center", margin: "24px 0" }}>
            <Button
              href={upgradeUrl}
              style={{
                backgroundColor: "#0C1A2B",
                color: "#FFFFFF",
                fontWeight: 600,
                textDecoration: "none",
                padding: "12px 24px",
                borderRadius: 8,
                display: "inline-block",
              }}
            >
              View Pro Plans & Pricing
            </Button>
          </Section>

          <Text style={{ lineHeight: 1.6 }}>
            Questions? Just reply to this email — I read every message personally.
          </Text>

          <Text style={{ marginTop: 32 }}>
            Rooting for your success, <br />
            <strong>Corey Ralston</strong> <br />
            Founder, Child Actor 101 <br />
            <Link href={siteUrl} style={{ color: "#3A76A6", textDecoration: "none" }}>
              directory.childactor101.com
            </Link>
          </Text>

          <Text style={{ marginTop: 24, fontSize: 12, color: "#64748B", lineHeight: 1.6 }}>
            P.S. This is my last email about upgrading. If I don't hear from you, I'll assume you're happy with the free tier and won't email again about Pro. You'll only get important updates about your listing.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
