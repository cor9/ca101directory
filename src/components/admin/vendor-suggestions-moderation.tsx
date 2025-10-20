"use client";

import { Icons } from "@/components/icons/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface VendorSuggestion {
  id: string;
  name: string;
  website?: string;
  email?: string;
  city: string;
  state: string;
  region: string;
  category: string;
  created_at: string;
  reviewed: boolean;
  submitted_by?: string;
  profiles?: {
    full_name?: string;
  } | null;
}

export function VendorSuggestionsModeration() {
  const [suggestions, setSuggestions] = useState<VendorSuggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVendorSuggestions() {
      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("vendor_suggestions")
          .select(`
            id,
            name,
            website,
            email,
            city,
            state,
            region,
            category,
            created_at,
            reviewed,
            submitted_by,
            profiles!vendor_suggestions_submitted_by_fkey (
              full_name
            )
          `)
          .eq("reviewed", false)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching vendor suggestions:", error);
          return;
        }

        setSuggestions(
          (data || []).map((suggestion) => ({
            ...suggestion,
            profiles: Array.isArray(suggestion.profiles)
              ? suggestion.profiles[0]
              : suggestion.profiles,
          })),
        );
      } catch (error) {
        console.error("Error fetching vendor suggestions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVendorSuggestions();
  }, []);

  const handleMarkReviewed = async (suggestionId: string) => {
    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("vendor_suggestions")
        .update({ reviewed: true })
        .eq("id", suggestionId);

      if (error) {
        console.error("Error marking suggestion as reviewed:", error);
        toast.error("Failed to mark suggestion as reviewed");
        return;
      }

      setSuggestions(
        suggestions.filter((suggestion) => suggestion.id !== suggestionId),
      );
      toast.success("Suggestion marked as reviewed");
    } catch (error) {
      console.error("Error marking suggestion as reviewed:", error);
      toast.error("Failed to mark suggestion as reviewed");
    }
  };

  const handleDelete = async (suggestionId: string) => {
    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("vendor_suggestions")
        .delete()
        .eq("id", suggestionId);

      if (error) {
        console.error("Error deleting suggestion:", error);
        toast.error("Failed to delete suggestion");
        return;
      }

      setSuggestions(
        suggestions.filter((suggestion) => suggestion.id !== suggestionId),
      );
      toast.success("Suggestion deleted successfully");
    } catch (error) {
      console.error("Error deleting suggestion:", error);
      toast.error("Failed to delete suggestion");
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Vendor Suggestions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Vendor Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-paper">
            No pending vendor suggestions to review.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Vendor Suggestions ({suggestions.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{suggestion.name}</h3>
                <Badge variant="outline">{suggestion.category}</Badge>
              </div>
              <Badge variant="secondary" className="text-xs">
                {new Date(suggestion.created_at).toLocaleDateString()}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Location:</span> {suggestion.city}
                , {suggestion.state}
              </div>
              <div>
                <span className="font-medium">Region:</span> {suggestion.region}
              </div>
              {suggestion.website && (
                <div>
                  <span className="font-medium">Website:</span>{" "}
                  <a
                    href={suggestion.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {suggestion.website}
                  </a>
                </div>
              )}
              {suggestion.email && (
                <div>
                  <span className="font-medium">Email:</span> {suggestion.email}
                </div>
              )}
            </div>

            {suggestion.profiles?.full_name && (
              <div className="text-sm text-paper">
                Suggested by: {suggestion.profiles.full_name}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleMarkReviewed(suggestion.id)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Icons.check className="h-4 w-4 mr-1" />
                Mark Reviewed
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(suggestion.id)}
              >
                <Icons.trash className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
