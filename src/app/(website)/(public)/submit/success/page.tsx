import { Button } from "@/components/ui/button";
import { CheckCircleIcon, HomeIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

interface SuccessPageProps {
  searchParams: { id?: string };
}

export default function SuccessPage({ searchParams }: SuccessPageProps) {
  const listingId = searchParams.id;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
        <CheckCircleIcon className="w-8 h-8 text-green-600" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-paper">
          Listing Submitted Successfully!
        </h1>
        <p className="text-lg text-paper max-w-md">
          Thank you for submitting your listing. We'll review it and get back to
          you soon.
        </p>
        {listingId && (
          <p className="text-sm text-paper">Reference ID: {listingId}</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button asChild>
          <Link href="/search" className="flex items-center gap-2">
            <SearchIcon className="w-4 h-4" />
            Browse Directory
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/" className="flex items-center gap-2">
            <HomeIcon className="w-4 h-4" />
            Go Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
