import { ComparePlans } from "@/components/pricing/compare-plans";
import { PricingFaq } from "@/components/pricing/pricing-faq";
import { currentUser } from "@/lib/auth";
import { constructMetadata } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export const metadata = constructMetadata({
  title: "Pricing",
  description: "Explore our subscription plans.",
});

export default async function PricingPage() {
  const user = await currentUser();

  if (user?.role === "ADMIN") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-5xl font-bold">Seriously?</h1>
        <Image
          src="/_static/illustrations/call-waiting.svg"
          alt="403"
          width={560}
          height={560}
          className="pointer-events-none -my-20 dark:invert"
        />
        <p className="text-balance px-4 text-center text-2xl font-medium">
          You are an {user.role}. Back to{" "}
          <Link
            href="/admin"
            className="text-muted-foreground underline underline-offset-4 hover:text-purple-500"
          >
            Dashboard
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-16 py-8 md:py-8">
      <hr className="container" />
      <ComparePlans />
      <PricingFaq />
    </div>
  );
}
