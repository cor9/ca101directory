"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createCheckoutRedirectUrl } from "@/lib/stripe/client";
import type { ItemInfo, PricePlan } from "@/types";
import { ArrowRightIcon, Loader2Icon, RocketIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface StripeDirectButtonProps {
  pricePlan: PricePlan;
  className?: string;
  item?: ItemInfo;
  listingId?: string;
  claimToken?: string;
  flowOverride?: string;
}

export function StripeDirectButton({
  pricePlan,
  className,
  item,
  listingId,
  claimToken,
  flowOverride,
}: StripeDirectButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;

    const activeListingId = listingId ?? item?._id;
    if (!activeListingId) {
      toast.info("Create or select a listing before upgrading.");
      router.push("/claim");
      return;
    }

    try {
      setIsLoading(true);
      const redirectUrl = await createCheckoutRedirectUrl({
        pricePlan,
        listingId: activeListingId,
        claimToken,
        flowOverride,
      });
      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Failed to create checkout session", error);
      const message =
        error instanceof Error
          ? error.message
          : "We couldn't reach Stripe. Please try again in a moment.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
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
      disabled={isLoading}
      onClick={handleClick}
    >
      <div className="flex items-center justify-center gap-2">
        {isLoading ? (
          <Loader2Icon className="mr-2 size-4 animate-spin" />
        ) : (
          getButtonIcon()
        )}
        <span>{isLoading ? "Redirecting..." : getButtonText()}</span>
      </div>
    </Button>
  );
}
