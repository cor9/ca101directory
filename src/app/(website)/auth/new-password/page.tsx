import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import Link from "next/link";

export const metadata = constructMetadata({
  title: "Use a magic link",
  description: "Passwords have been replaced with secure email links.",
  canonicalUrl: `${siteConfig.url}/auth/new-password`,
  noIndex: true,
});

const NewPasswordPage = () => {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-3xl font-semibold text-gray-900">
        Magic links replaced password resets
      </h1>
      <p className="text-gray-700">
        If you requested a password reset, just head to the login page and ask
        for a new magic link. It only takes a second and keeps your account more
        secure than a traditional password.
      </p>
      <Link
        href="/auth/login"
        className="btn-primary inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-medium"
      >
        Go to login
      </Link>
    </div>
  );
};

export default NewPasswordPage;
