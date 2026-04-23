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

export default function VendorUpgrade48hEmail({
  vendorName,
  listingName,
  upgradeUrl,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Here’s what parents actually see</Preview>
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
            Quick reminder about <strong>{listingName}</strong>: parents scan
            listings, they don’t read every word.
          </Text>
          <Text style={{ lineHeight: 1.6 }}>
            Incomplete profiles are usually skipped first. Listings with
            stronger visuals and premium placement get more attention.
          </Text>
          <Text style={{ lineHeight: 1.6 }}>
            If you want your listing to be taken seriously in the first few
            seconds, now is the time to finish and upgrade it.
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
