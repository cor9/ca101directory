import { Icons } from "@/components/icons/icons";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import Link from "next/link";

export const metadata = constructMetadata({
  title: "Login Link Expired",
  description: "Your magic link has expired. Request a new one to log in.",
  canonicalUrl: `${siteConfig.url}/auth/expired`,
  noIndex: true,
});

export default function MagicLinkExpiredPage() {
  return (
    <div className="container mx-auto max-w-lg px-4 py-16">
      <div className="rounded-2xl border border-border-subtle bg-bg-2 p-8 text-center shadow-lg">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-orange/10 text-primary-orange">
          <Icons.alert className="h-6 w-6" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold text-gray-900">
          Magic Link Expired
        </h1>
        <p className="mt-3 text-gray-700">
          Magic links expire after <strong>1 hour</strong> for security. Request
          a new one to log in.
        </p>
        <div className="mt-6 space-y-3">
          <Link href="/auth/login">
            <Button className="w-full">Request New Magic Link</Button>
          </Link>
          <p className="text-sm text-gray-600">
            💡 <strong>Tip:</strong> Check your email right away and click the
            link within an hour.
          </p>
        </div>
      </div>
    </div>
  );
}
