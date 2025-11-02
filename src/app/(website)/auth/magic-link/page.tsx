import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { MagicLinkHandler } from "./magic-link-handler";

type MagicLinkPageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export const metadata: Metadata = constructMetadata({
  title: "Secure Login - Child Actor 101 Directory",
  description: "Complete your secure passwordless login.",
  canonicalUrl: `${siteConfig.url}/auth/magic-link`,
});

function parseBoolean(value: string | null | undefined) {
  if (!value) return false;
  return value === "1" || value === "true" || value === "on";
}

function parseSingle(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default function MagicLinkPage({ searchParams }: MagicLinkPageProps) {
  const email = parseSingle(searchParams.email) ?? "";
  const remember = parseBoolean(parseSingle(searchParams.remember));
  const redirectTo = parseSingle(searchParams.redirectTo) ?? "/dashboard";
  const intent = parseSingle(searchParams.intent) ?? "login";

  return (
    <div className="container mx-auto max-w-lg px-4 py-16">
      <MagicLinkHandler
        email={email}
        remember={remember}
        redirectTo={redirectTo}
        intent={intent}
      />
    </div>
  );
}
