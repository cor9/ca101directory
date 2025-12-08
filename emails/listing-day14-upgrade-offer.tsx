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
  const hasViews = viewCount > 0;

  return (
    <Html>
      <Head />
      <Preview>
        Your listing is getting seen, but Pro vendors are getting the inquiries
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
            I wanted to reach out personally about{" "}
            <strong>{listingName}</strong>.
          </Text>

          <Text style={{ lineHeight: 1.6 }}>
            It has been about two weeks since your listing went live, and here
            is what I am seeing on the directory side.
          </Text>

          <Section
            style={{
              backgroundColor: "#DBEAFE",
              padding: "20px",
              borderRadius: 8,
              border: "2px solid #60A5FA",
              margin: "20px 0",
            }}
          >
            <Text style={{ fontSize: 15, margin: "0 0 12px 0" }}>
              Your current snapshot:
            </Text>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
              {hasViews && (
                <li>
                  Parents have viewed your profile around {viewCount} times.
                </li>
              )}
              <li>
                Your listing appears below featured Pro vendors in search
                results.
              </li>
              <li>
                Parents are clicking first on listings with strong photos and
                trust badges.
              </li>
              <li>
                Free listings tend to see fewer direct inquiries from the
                directory.
              </li>
            </ul>
          </Section>

          <Text style={{ lineHeight: 1.6 }}>
            In the same categories, many Pro members are seeing several qualified
            parent inquiries each week. The main difference is how they show up
            in the directory.
          </Text>

          <Text
            style={{
              lineHeight: 1.6,
              fontSize: 16,
              fontWeight: 600,
              color: "#DC2626",
            }}
          >
            Pro vendors are at the top of search with clear photos, trust
            signals, and stronger profiles.
          </Text>

          <Section
            style={{
              backgroundColor: "#FEF3C7",
              padding: "20px",
              borderRadius: 8,
              margin: "24px 0",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: 600,
                margin: "0 0 12px 0",
                textAlign: "center",
              }}
            >
              What a Pro upgrade adds:
            </Text>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
              <li>Top placement in your category search results.</li>
              <li>Professional photos, including logo and gallery images.</li>
              <li>Eligibility for the 101 Approved badge.</li>
              <li>Stronger social proof with reviews and ratings display.</li>
              <li>
                A prominent contact button so parents can reach you directly.
              </li>
              <li>
                Analytics that show you how parents are finding and engaging
                with your listing.
              </li>
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
              Upgrade to Pro and Start Getting More Inquiries
            </Button>
          </Section>

          <Section
            style={{
              backgroundColor: "#FEE2E2",
              padding: "16px",
              borderRadius: 8,
              margin: "24px 0",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                margin: 0,
                textAlign: "center",
                color: "#991B1B",
              }}
            >
              Founding Member Pricing is available for a limited time:
              199 dollars for six months of Pro (regularly 300 dollars), plus a
              founding vendor badge and the ability to keep that rate going
              forward.
            </Text>
          </Section>

          <Text style={{ lineHeight: 1.6 }}>
            My honest recommendation: if you want the directory to be a real
            source of clients, Pro is built to pay for itself with one or two
            bookings. Most vendors see it as a simple, focused marketing
            investment.
          </Text>

          <Text style={{ lineHeight: 1.6 }}>
            If you are not ready to invest in your listing yet, your free
            listing will stay up and continue to appear below featured vendors.
            You will still benefit from being present, you just will not have
            the extra visibility and trust signals.
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
              View Pro Plans and Pricing
            </Button>
          </Section>

          <Text style={{ lineHeight: 1.6 }}>
            Questions about whether Pro is a good fit for you right now? Reply
            to this email and I will take a look at your situation personally.
          </Text>

          <Text style={{ marginTop: 32 }}>
            Rooting for your success, <br />
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
              fontSize: 12,
              color: "#64748B",
              lineHeight: 1.6,
            }}
          >
            P.S. This is the final email in this sequence about upgrading to
            Pro. If I do not hear from you, I will assume you would like to stay
            on the free tier and you will only receive important updates about
            your listing going forward.
          </Text>

          <Text
            style={{
              marginTop: 16,
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
