"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Eye, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface PendingListing {
  id: string;
  listing_name: string;
  plan: string;
  created_at: string;
  owner_id: string;
}

interface AdminNotificationsProps {
  className?: string;
}

export function AdminNotifications({ className }: AdminNotificationsProps) {
  const [pendingListings, setPendingListings] = useState<PendingListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPendingListings();
    // Refresh every 5 minutes
    const interval = setInterval(fetchPendingListings, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchPendingListings = async () => {
    try {
      const response = await fetch("/api/admin/pending-listings");
      if (response.ok) {
        const data = await response.json();
        setPendingListings(data);
      }
    } catch (error) {
      console.error("Error fetching pending listings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const dismissNotification = (listingId: string) => {
    setDismissed(prev => {
      const newSet = new Set(prev);
      newSet.add(listingId);
      return newSet;
    });
  };

  const visibleListings = pendingListings.filter(listing => !dismissed.has(listing.id));

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="bauhaus-heading text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Admin Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="bauhaus-body text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (visibleListings.length === 0) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="bauhaus-heading text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Admin Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="bauhaus-body text-sm text-muted-foreground">
            No pending listings to review
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="bauhaus-heading text-lg flex items-center gap-2">
          <Bell className="h-5 w-5 text-bauhaus-orange" />
          Admin Notifications
          <Badge variant="destructive" className="ml-2">
            {visibleListings.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {visibleListings.slice(0, 5).map((listing) => (
          <div
            key={listing.id}
            className="bauhaus-card p-4 flex items-center justify-between"
          >
            <div className="flex-1">
              <h4 className="bauhaus-heading text-sm font-medium">
                {listing.listing_name}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {listing.plan}
                </Badge>
                <span className="bauhaus-body text-xs text-muted-foreground">
                  {new Date(listing.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="bauhaus-btn-secondary text-xs"
              >
                <Link href={`/dashboard/admin/listings?highlight=${listing.id}`}>
                  <Eye className="h-3 w-3 mr-1" />
                  REVIEW
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dismissNotification(listing.id)}
                className="h-8 w-8 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
        {visibleListings.length > 5 && (
          <div className="text-center pt-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="bauhaus-btn-secondary"
            >
              <Link href="/dashboard/admin/listings">
                VIEW ALL {visibleListings.length} PENDING LISTINGS
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
