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

  const viewContent = hasViews ? (
    <>
      Your listing has been viewed <strong>{viewCount} times</strong> this week
    </>
  ) : (
    <>Parents are finding your listing on Child Actor 101</>
  );

  return (
    <Html>
      <Head />
      <Preview>
        {hasViews
          ? `${viewCount} parents viewed your listing this week`
          : "See how parents are finding you in the Child Actor 101 Directory"}
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
            Good news about <strong>{listingName}</strong>.
          </Text>

          <Section
            style={{
              backgroundColor: "#FEF3C7",
              padding: "20px",
              borderRadius: 8,
              border: "2px solid #FCD34D",
              margin: "20px 0",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: 600,
                margin: 0,
                textAlign: "center",
              }}
            >
              {viewContent}
            </Text>
          </Section>

          <Text style={{ lineHeight: 1.6 }}>
            These are real parents actively searching for professionals like you
            in a directory of more than 250 trusted vendors.
          </Text>

          <Text style={{ lineHeight: 1.6 }}>Here is what happens next:</Text>

          <ul style={{ lineHeight: 1.6, paddingLeft: 24, marginTop: 0 }}>
            <li>Parents search by category, location, and specialization.</li>
            <li>
              They click on listings that stand out with strong photos and clear
              information.
            </li>
            <li>They save favorites and reach out to vendors they trust.</li>
            <li>
              Free listings appear after paid, featured vendors in search
              results.
            </li>
          </ul>

          <Text style={{ lineHeight: 1.6 }}>
            Right now, parents are only seeing a basic version of your listing.
            If you want to move higher in search and get more inquiries, an
            upgrade is the next smart step.
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
              Get Featured Placement
            </Button>
          </Section>

          <Text style={{ lineHeight: 1.6 }}>
            <strong>Pro members get:</strong>
          </Text>

          <ul style={{ lineHeight: 1.6, paddingLeft: 24, marginTop: 0 }}>
            <li>
              Top placement in your category, above free listings in search
              results.
            </li>
            <li>Logo plus gallery space for up to four photos.</li>
            <li>Social media links on your profile.</li>
            <li>Eligibility for the 101 Approved Badge, which builds trust.</li>
            <li>Three to five times more profile views on average.</li>
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
              See Plans and Pricing
            </Button>
          </Section>

          <Text
            style={{
              marginTop: 24,
              lineHeight: 1.6,
              fontSize: 14,
              color: "#475569",
            }}
          >
            <strong>Limited time:</strong> Founding members get six months of
            Pro for just 199 dollars (normally 300 dollars). You can lock in
            this pricing for the future.
          </Text>

          <Text style={{ marginTop: 32 }}>
            Here to help, <br />
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
