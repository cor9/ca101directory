"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CompedToggleProps {
  listingId: string;
  isComped: boolean;
  currentPlan: string | null;
}

export function CompedToggle({
  listingId,
  isComped,
  currentPlan,
}: CompedToggleProps) {
  const [comped, setComped] = useState(isComped);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/toggle-comped", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId,
          comped: !comped,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update comped status");
      }

      setComped(!comped);
      toast.success(
        !comped
          ? "Listing marked as comped (Pro plan)"
          : "Comped status removed",
      );
    } catch (error) {
      console.error("Error toggling comped status:", error);
      toast.error("Failed to update comped status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={comped ? "default" : "outline"}
        size="sm"
        onClick={handleToggle}
        disabled={isLoading}
        className={comped ? "bg-yellow-500 hover:bg-yellow-600" : ""}
      >
        {comped ? "Comped" : "Mark Comped"}
      </Button>

      {comped && (
        <Badge
          variant="secondary"
          className="bg-yellow-100 text-yellow-800 text-xs"
        >
          <CheckIcon className="w-3 h-3 mr-1" />
          Pro
        </Badge>
      )}
    </div>
  );
}
