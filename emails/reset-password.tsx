import { siteConfig } from "@/config/site";
import {
    Body,
    Button,
    Container,
    Head,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text
} from "@react-email/components";

interface ResetPasswordEmailProps {
    userName?: string;
    resetLink?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
// const baseUrl = 'https://demo.mkdirs.com';

/**
 * https://demo.react.email/preview/welcome/stripe-welcome
 */
export const ResetPasswordEmail = ({
    userName,
    resetLink,
}: ResetPasswordEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Reset your password</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={box}>
                        <Img
                            src={`${baseUrl}/logo.png`}
                            width="32"
                            height="32"
                            alt="Logo"
                        />
                        <Hr style={hr} />
                        <Text style={paragraph}>
                            Hi {userName},
                        </Text>
                        <Text style={paragraph}>
                            Thanks for submitting your account information. You're now ready to
                            make live transactions with Stripe!
                        </Text>
                        <Text style={paragraph}>
                            Someone recently requested a password change for your
                            account. If this was you, you can set a new password here:
                        </Text>
                        <Button style={button} href={resetLink}>
                            Reset password
                        </Button>
                        <Hr style={hr} />
                        <Text style={paragraph}>
                            If you don&apos;t want to change your password or didn&apos;t
                            request this, just ignore and delete this message.
                        </Text>
                        <Text style={paragraph}>
                            To keep your account secure, please don&apos;t forward this email
                            to anyone.
                        </Text>
                        <Text style={paragraph}>— The {siteConfig.name} team</Text>
                        <Hr style={hr} />
                        <Text style={footer}>
                            <Link style={anchor} href={baseUrl}>
                                {siteConfig.name}
                            </Link>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Link style={anchor} href={siteConfig.links.twitter}>
                                Twitter
                            </Link>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Link style={anchor} href={siteConfig.links.github}>
                                Github
                            </Link>
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

ResetPasswordEmail.PreviewProps = {
    userName: "Javayhu",
    resetLink: "https://demo.mkdirs.com",
} as ResetPasswordEmailProps;

export default ResetPasswordEmail;

const main = {
    backgroundColor: "#f6f9fc",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px 0 48px",
    marginBottom: "64px",
};

const box = {
    padding: "0 48px",
};

const hr = {
    borderColor: "#e6ebf1",
    margin: "20px 0",
};

const paragraph = {
    color: "#525f7f",

    fontSize: "16px",
    lineHeight: "24px",
    textAlign: "left" as const,
};

const anchor = {
    color: "#556cd6",
};

const button = {
    backgroundColor: "#656ee8",
    borderRadius: "5px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    width: "100%",
    padding: "10px",
};

const footer = {
    color: "#8898aa",
    fontSize: "12px",
    lineHeight: "16px",
};
