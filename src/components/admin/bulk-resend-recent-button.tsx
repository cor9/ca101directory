"use client";

import { bulkResendClaimEmailsForRecentAdds } from "@/actions/admin-bulk-resend-recent";
import { Button } from "@/components/ui/button";
import { Clock, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function BulkResendRecentButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleBulkResend = async () => {
    if (
      !confirm(
        "Send claim/upgrade emails to listings created in the last 6 hours?",
      )
    ) {
      return;
    }
    setIsLoading(true);
    try {
      const result = await bulkResendClaimEmailsForRecentAdds(6);
      if (result.success) {
        toast.success(result.message);
        if (result.details) {
          console.log("Bulk recent resend details:", result.details);
          if (result.details.errors.length > 0) {
            toast.error(
              `${result.details.errors.length} errors occurred. Check console for details.`,
            );
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
      className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
    >
      <Clock className="w-4 h-4 mr-2" />
      <Mail className="w-4 h-4 mr-1" />
      {isLoading ? "Sending..." : "Bulk Resend (Recent Adds)"}
    </Button>
  );
}


