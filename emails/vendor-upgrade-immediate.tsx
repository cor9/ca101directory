import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type Props = {
  vendorName: string;
  listingName: string;
  upgradeUrl: string;
};

export default function VendorUpgradeImmediateEmail({
  vendorName,
  listingName,
  upgradeUrl,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>You’re live in the Directory</Preview>
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
            Your listing for <strong>{listingName}</strong> is now live in the
            Child Actor 101 Directory.
          </Text>
          <Text style={{ lineHeight: 1.6 }}>
            You’re now competing with 1,000+ listings. Parents decide quickly,
            so strong images, clear descriptions, and credibility details
            matter.
          </Text>
          <Text style={{ lineHeight: 1.6 }}>
            A completed, upgraded listing helps you stand out and get more
            profile views and contact clicks.
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
              Upgrade Listing
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
