import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Login",
  description: "Login to your Child Actor 101 Directory account",
  canonicalUrl: `${siteConfig.url}/auth/login`,
  noIndex: true,
});

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
