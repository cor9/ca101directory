"use client";

import { bulkResendEmailsToNewListings } from "@/actions/admin-bulk-resend";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function BulkResendButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleBulkResend = async () => {
    if (!confirm("Send 'listing live' emails to all 24 listings updated on November 6, 2025?")) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await bulkResendEmailsToNewListings();

      if (result.success) {
        toast.success(result.message);
        if (result.details) {
          console.log("Bulk resend details:", result.details);
          if (result.details.errors.length > 0) {
            toast.error(`${result.details.errors.length} errors occurred. Check console for details.`);
          }
        }
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleBulkResend}
      disabled={isLoading}
      variant="outline"
      className="border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white"
    >
      <Mail className="w-4 h-4 mr-2" />
      {isLoading ? "Sending..." : "Bulk Resend (24 listings)"}
    </Button>
  );
}






