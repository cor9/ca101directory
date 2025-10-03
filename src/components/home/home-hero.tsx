import { Icons } from "@/components/icons/icons";
import { buttonVariants } from "@/components/ui/button";
import { heroConfig } from "@/config/hero";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import HomeSearchBox from "./home-search-box";

export default function HomeHero() {
  const LabelIcon = Icons[heroConfig.label.icon];
  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-tomato-red/5 via-retro-blue/5 to-mustard-gold/5 rounded-3xl -m-8" />

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
            <Suspense
              fallback={
                <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <SearchIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Search professionals...
                  </span>
                </div>
              }
            >
              <HomeSearchBox urlPrefix="/" />
            </Suspense>
          </div>

          {/* Auth buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link
              href="/auth/login"
              className="bg-tomato-red hover:bg-tomato-red/90 text-cream px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="border-2 border-retro-blue text-retro-blue hover:bg-retro-blue hover:text-cream px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>

        {/* Right side - Hero Logo */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <div className="relative">
            {/* Glow effect behind logo */}
            <div className="absolute inset-0 bg-gradient-to-r from-tomato-red/20 via-retro-blue/20 to-mustard-gold/20 rounded-full blur-3xl scale-110" />

            {/* Logo container with enhanced styling */}
            <div className="relative backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
              <img
                src="/logo.png"
                alt="Child Actor 101 Directory Logo"
                width={400}
                height={400}
                className="w-full h-auto max-w-md mx-auto drop-shadow-lg"
              />

              {/* Decorative elements */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-tomato-red rounded-full animate-pulse" />
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-retro-blue rounded-full animate-pulse delay-300" />
              <div className="absolute top-1/2 -right-4 w-2 h-2 bg-mustard-gold rounded-full animate-pulse delay-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
