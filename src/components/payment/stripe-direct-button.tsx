"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PricePlan } from "@/types";
import { ArrowRightIcon, RocketIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface StripeDirectButtonProps {
  pricePlan: PricePlan;
  className?: string;
}

export function StripeDirectButton({
  pricePlan,
  className,
}: StripeDirectButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    // Redirect to pricing page where Stripe Pricing Table is embedded
    // This ensures fresh checkout sessions are created each time
    router.push("/pricing");
  };

  const getButtonText = () => {
    switch (pricePlan.title.toLowerCase()) {
      case "basic":
        return "Get Started";
      case "pro":
        return "Choose Pro";
      case "premium":
        return "Go Premium";
      case "101 badge add-on":
        return "Add Badge";
      default:
        return "Choose Plan";
    }
  };

  const getButtonIcon = () => {
    switch (pricePlan.title.toLowerCase()) {
      case "basic":
        return <ArrowRightIcon className="mr-2 size-4" />;
      case "pro":
      case "premium":
        return <RocketIcon className="mr-2 size-4" />;
      default:
        return <ArrowRightIcon className="mr-2 size-4" />;
    }
  };

  return (
    <Button
      size="lg"
      variant="default"
      className={cn(
        "overflow-hidden rounded-full",
        "group transition-transform duration-300 ease-in-out hover:scale-105",
        "bg-primary text-primary-foreground dark:bg-primary/90",
        "hover:bg-primary/90 dark:hover:bg-primary/80",
        "shadow-lg hover:shadow-xl",
        className,
      )}
      onClick={handleClick}
    >
      <div className="flex items-center justify-center gap-2">
        {getButtonIcon()}
        <span>{getButtonText()}</span>
      </div>
    </Button>
  );
}
