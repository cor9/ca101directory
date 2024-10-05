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

interface NotifySubmissionEmailProps {
    itemName?: string;
    reviewLink?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
// const baseUrl = 'https://demo.mkdirs.com';

/**
 * https://demo.react.email/preview/welcome/stripe-welcome
 */
export const NotifySubmissionEmail = ({
    itemName,
    reviewLink,
}: NotifySubmissionEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>New submission</Preview>
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
                            New submission
                        </Text>
                        <Text style={paragraph}>
                            A new submission named <b>{itemName}</b> is ready to be reviewed.
                        </Text>
                        <Button style={button} href={reviewLink}>
                            Review submission
                        </Button>
                        <Text style={paragraph}>— The <Link style={anchor} href={baseUrl}>{siteConfig.name}</Link> team</Text>
                        <Hr style={hr} />
                        <Text style={footer}>
                            <span style={footerLeft}>
                                &copy; {new Date().getFullYear()}
                                &nbsp;&nbsp;
                                All rights reserved.
                            </span>
                            <span style={footerRight}>
                                <Link style={anchor} href={siteConfig.links.twitter}>
                                    Twitter
                                </Link>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <Link style={anchor} href={siteConfig.links.github}>
                                    Github
                                </Link>
                            </span>
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

NotifySubmissionEmail.PreviewProps = {
    itemName: "Mkdirs",
    reviewLink: "https://demo.mkdirs.com",
} as NotifySubmissionEmailProps;

export default NotifySubmissionEmail;

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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
};

const footerLeft = {
    flex: 1,
};

const footerRight = {
    textAlign: "right" as const,
};
