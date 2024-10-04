import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text
} from "@react-email/components";

interface VerifyEmailProps {
  confirmLink?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
// const baseUrl = 'https://demo.mkdirs.com';

/**
 * https://demo.react.email/preview/magic-links/aws-verify-email
 * https://demo.react.email/preview/reset-password/dropbox-reset-password
 */
export const VerifyEmail = ({
  confirmLink
}: VerifyEmailProps) => {
  return (
      <Html>
          <Head />
          <Preview>Verify your email address</Preview>
          <Body style={main}>
              <Container style={container}>
                  <Img
                      src={`${baseUrl}/logo.png`}
                      width="32"
                      height="32"
                      alt="Logo"
                  />
                  <Section>
                      <Text style={text}>Verify your email address</Text>
                      <Text style={text}>
                        Thanks for starting the new account creation process. 
                        We want to make sure it's really you. 
                        Please click the confirmation link to continue.
                      </Text>
                      <Button style={button} href={confirmLink}>
                          Confirm Email
                      </Button>
                      <Text style={text}>
                          If you don&apos;t want to create an account, you can ignore this message.
                      </Text>
                  </Section>
              </Container>
          </Body>
      </Html>
  );
};

VerifyEmail.PreviewProps = {
  userName: "Javayhu",
  confirmLink: "https://demo.mkdirs.com",
} as VerifyEmailProps;

export default VerifyEmail;

const main = {
  backgroundColor: "#f6f9fc",
  padding: "10px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  padding: "45px",
};

const text = {
  fontSize: "16px",
  fontFamily:
      "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
};

const button = {
  backgroundColor: "#007ee6",
  borderRadius: "4px",
  color: "#fff",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "210px",
  padding: "14px 7px",
};
