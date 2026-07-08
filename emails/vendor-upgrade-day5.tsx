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

export default function VendorUpgradeDay5Email({
  vendorName,
  listingName,
  upgradeUrl,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Don’t let this sit unfinished</Preview>
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
            Your listing for <strong>{listingName}</strong> is live, but it may
            be underperforming if it’s still incomplete.
          </Text>
          <Text style={{ lineHeight: 1.6 }}>
            Founding pricing and priority placement won’t be available forever.
          </Text>
          <Text style={{ lineHeight: 1.6 }}>
            This is your final reminder to lock in your upgrade and maximize
            visibility.
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
