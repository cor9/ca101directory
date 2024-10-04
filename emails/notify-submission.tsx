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

interface NotifySubmissionEmailProps {
    submissionLink?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
// const baseUrl = 'https://demo.mkdirs.com';

/**
 * https://demo.react.email/preview/reset-password/dropbox-reset-password
 */
export const NotifySubmissionEmail = ({
    submissionLink,
}: NotifySubmissionEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>New submission</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Img
                        src={`${baseUrl}/logo.png`}
                        width="32"
                        height="32"
                        alt="Logo"
                    />
                    <Section>
                        <Text style={text}>Hi,</Text>
                        <Text style={text}>
                            A new submission is ready to be reviewed.
                        </Text>
                        <Button style={button} href={submissionLink}>
                            Review submission
                        </Button>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

NotifySubmissionEmail.PreviewProps = {
    submissionLink: "https://demo.mkdirs.com",
} as NotifySubmissionEmailProps;

export default NotifySubmissionEmail;

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
