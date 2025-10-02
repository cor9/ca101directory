"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CompedToggleProps {
  listingId: string;
  isComped: boolean;
  currentPlan: string | null;
}

export function CompedToggle({ listingId, isComped, currentPlan }: CompedToggleProps) {
  const [comped, setComped] = useState(isComped);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/toggle-comped", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId,
          comped: checked,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update comped status");
      }

      setComped(checked);
      toast.success(
        checked 
          ? "Listing marked as comped (Pro plan)" 
          : "Comped status removed"
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
      <div className="flex items-center space-x-2">
        <Switch
          id={`comped-${listingId}`}
          checked={comped}
          onCheckedChange={handleToggle}
          disabled={isLoading}
        />
        <Label htmlFor={`comped-${listingId}`} className="text-sm">
          Comped
        </Label>
      </div>
      
      {comped && (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
          <CheckIcon className="w-3 h-3 mr-1" />
          Pro
        </Badge>
      )}
    </div>
  );
}
