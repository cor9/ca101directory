import { siteConfig } from "@/config/site";
import {
  Body,
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
import { anchor, box, container, footer, footerLeft, footerRight, hr, main, paragraph } from "./email-formats";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
// const baseUrl = 'https://demo.mkdirs.com';

export const NewsletterWelcomeEmail = () => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Mkdirs!</Preview>
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
              Welcome to our community! We're thrilled to have you join us on this journey of exploring cutting-edge websites and tools.
            </Text>
            <Text style={paragraph}>
              Expect our monthly newsletter packed with curated insights, latest trends, and exclusive tips in the AI space.
            </Text>
            <Text style={paragraph}>
              We value your participation and feedback. Please don't hesitate to reach out to us if you have any questions or suggestions.
            </Text>
            <Text style={paragraph}>— The <Link style={anchor} href={baseUrl}>{siteConfig.name}</Link> team</Text>
            <Hr style={hr} />
            <Text style={footer}>
              <span style={footerLeft}>
                &copy; {new Date().getFullYear()}
                &nbsp;
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
  )
}

export default NewsletterWelcomeEmail;
