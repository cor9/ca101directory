import { Button } from "@/components/ui/button";
import { SparklesIcon, ClockIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export function FoundingMemberBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-blue via-purple-600 to-pink-600 p-8 text-white shadow-2xl">
      {/* Animated background effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
          <SparklesIcon className="h-4 w-4" />
          <span>LIMITED TIME OFFER</span>
          <ClockIcon className="h-4 w-4 animate-pulse" />
        </div>

        {/* Headline */}
        <h2 className="mb-4 text-4xl font-bold md:text-5xl">
          🎉 Founding Member Pricing
        </h2>

        {/* Subheadline */}
        <p className="mb-6 text-xl md:text-2xl">
          Lock in <span className="font-bold underline decoration-yellow-300">lifetime rates</span>{" "}
          before prices go up!
        </p>

        {/* Value props */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
            <div className="text-3xl font-bold">🔒</div>
            <div className="mt-2 text-sm font-semibold">Lifetime Rate</div>
            <div className="mt-1 text-xs opacity-90">
              Your rate never increases
            </div>
          </div>
          <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
            <div className="text-3xl font-bold">⭐</div>
            <div className="mt-2 text-sm font-semibold">Founding Badge</div>
            <div className="mt-1 text-xs opacity-90">
              Exclusive badge on your listing
            </div>
          </div>
          <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
            <div className="text-3xl font-bold">🎁</div>
            <div className="mt-2 text-sm font-semibold">Special Perks</div>
            <div className="mt-1 text-xs opacity-90">
              Early access to new features
            </div>
          </div>
        </div>

        {/* CTA */}
        <Button
          size="lg"
          asChild
          className="group bg-white text-brand-blue hover:bg-gray-100 shadow-xl"
        >
          <Link href="#founding-plans" className="flex items-center gap-2">
            <span className="font-bold">See Founding Member Plans</span>
            <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>

        {/* Urgency text */}
        <p className="mt-4 text-sm opacity-90">
          ⏰ <strong>Limited spots available</strong> - Once we hit our founding member
          cap, prices return to regular rates
        </p>
      </div>
    </div>
  );
}

// Compact version for secondary placements
export function FoundingMemberBannerCompact() {
  return (
    <div className="rounded-lg bg-gradient-to-r from-brand-blue to-purple-600 p-6 text-white shadow-lg">
      <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
        <div className="flex-shrink-0">
          <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
            <SparklesIcon className="h-6 w-6" />
          </div>
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-bold">🎉 Founding Member Rates Available</h3>
          <p className="text-sm opacity-90">
            Lock in lifetime rates before prices increase - Limited time only!
          </p>
        </div>
        <Button
          size="sm"
          asChild
          className="flex-shrink-0 bg-white text-brand-blue hover:bg-gray-100"
        >
          <Link href="/pricing#founding-plans">
            View Plans <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

