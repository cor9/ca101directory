import { Button } from "@/components/ui/button";
import { CheckCircleIcon, CreditCardIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PaymentPageProps {
  params: { id: string };
}

export default function PaymentPage({ params }: PaymentPageProps) {
  const listingId = params.id;

  if (!listingId) {
    return notFound();
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="flex items-center justify-center w-16 h-16 bg-brand-blue/10 rounded-full">
        <CreditCardIcon className="w-8 h-8 text-brand-blue" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Complete Your Listing Payment
        </h1>
        <p className="text-lg text-gray-900 max-w-md">
          Your listing has been submitted successfully. Complete payment to
          activate your listing.
        </p>
        <p className="text-sm text-gray-900">Listing ID: {listingId}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button asChild className="flex items-center gap-2">
          <Link href={process.env.NEXT_PUBLIC_STRIPE_BASIC} target="_blank">
            <CreditCardIcon className="w-4 h-4" />
            Pay for Basic Plan
          </Link>
        </Button>
        <Button asChild className="flex items-center gap-2">
          <Link href={process.env.NEXT_PUBLIC_STRIPE_PRO} target="_blank">
            <CreditCardIcon className="w-4 h-4" />
            Pay for Pro Plan
          </Link>
        </Button>
        <Button asChild className="flex items-center gap-2">
          <Link href={process.env.NEXT_PUBLIC_STRIPE_PREMIUM} target="_blank">
            <CreditCardIcon className="w-4 h-4" />
            Pay for Premium Plan
          </Link>
        </Button>
      </div>
    </div>
  );
}
