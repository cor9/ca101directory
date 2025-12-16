"use client";

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
    <Button
      variant={comped ? "default" : "outline"}
      size="sm"
      onClick={handleToggle}
      disabled={isLoading}
      className={
        comped
          ? "bg-yellow-500 hover:bg-yellow-600 text-white"
          : "border-neutral-600 hover:bg-neutral-800 text-neutral-300"
      }
    >
      {comped ? (
        <>
          <CheckIcon className="w-4 h-4 mr-1" />
          Comped
        </>
      ) : (
        "Mark Comped"
      )}
    </Button>
  );
}
