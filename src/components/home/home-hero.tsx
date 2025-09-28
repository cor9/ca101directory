import { Icons } from "@/components/icons/icons";
import { buttonVariants } from "@/components/ui/button";
import { heroConfig } from "@/config/hero";
import { cn } from "@/lib/utils";
import Link from "next/link";
import HomeSearchBox from "./home-search-box";

export default function HomeHero() {
  const LabelIcon = Icons[heroConfig.label.icon];
  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 via-brand-blue/5 to-brand-yellow/5 rounded-3xl -m-8" />

      <div className="relative max-w-6xl flex flex-col lg:flex-row items-center text-center lg:text-left gap-12 lg:gap-16">
        {/* Left side - Content */}
        <div className="flex-1 flex flex-col items-center lg:items-start gap-8">
          <Link
            href={heroConfig.label.href}
            target="_blank"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "px-4 rounded-full",
            )}
          >
            <span className="mr-2">🎉</span>
            <span>{heroConfig.label.text}</span>
            <LabelIcon className="size-4" />
          </Link>

          <h1 className="max-w-5xl font-bold text-balance text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
            {heroConfig.title.first}{" "}
            <span className="text-gradient_blue-orange font-bold">
              {heroConfig.title.second}
            </span>
          </h1>

          <p className="max-w-4xl text-balance text-muted-foreground sm:text-xl lg:text-left">
            {heroConfig.subtitle}
          </p>

          <div className="w-full max-w-md">
            <HomeSearchBox urlPrefix="/" />
          </div>

          {/* Auth buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link
              href="/auth/login"
              className="bg-brand-blue hover:bg-brand-blue-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>

        {/* Right side - Hero Logo */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <div className="relative">
            {/* Glow effect behind logo */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/20 via-brand-blue/20 to-brand-yellow/20 rounded-full blur-3xl scale-110" />

            {/* Logo container with enhanced styling */}
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
              <img
                src="/images/logo.png"
                alt="Child Actor 101 Directory Logo"
                width={400}
                height={400}
                className="w-full h-auto max-w-md mx-auto drop-shadow-lg"
              />

              {/* Decorative elements */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-brand-orange rounded-full animate-pulse" />
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-brand-blue rounded-full animate-pulse delay-300" />
              <div className="absolute top-1/2 -right-4 w-2 h-2 bg-brand-yellow rounded-full animate-pulse delay-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
