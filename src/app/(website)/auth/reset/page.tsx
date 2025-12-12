import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import Link from "next/link";

export const metadata = constructMetadata({
  title: "Log in with a magic link",
  description: "We use secure magic links instead of passwords.",
  canonicalUrl: `${siteConfig.url}/auth/reset`,
  noIndex: true,
});

const ResetPage = () => {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-3xl font-semibold text-gray-900">
        Passwords are no longer needed 🎉
      </h1>
      <p className="text-gray-700">
        We now use secure, one-time magic links for every login. Enter your
        email on the login page and we&apos;ll send you a link that keeps you
        signed in on this device.
      </p>
      <Link
        href="/auth/login"
        className="btn-primary inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-medium"
      >
        Send me a login link
      </Link>
    </div>
  );
};

export default ResetPage;
