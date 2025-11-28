import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Registration Success",
  description: "Your account has been created. Check your email to confirm.",
  canonicalUrl: `${siteConfig.url}/auth/registration-success`,
  noIndex: true,
});

export default function RegistrationSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
