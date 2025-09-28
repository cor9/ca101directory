"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CrownIcon, 
  StarIcon, 
  TrendingUpIcon, 
  CheckCircleIcon,
  ArrowRightIcon,
  EditIcon,
  BarChartIcon
} from "lucide-react";
import Link from "next/link";
import type { ItemInfo } from "@/types";

interface ClaimedListingActionsProps {
  listing: ItemInfo;
  isOwner?: boolean;
}

export function ClaimedListingActions({ listing, isOwner = false }: ClaimedListingActionsProps) {
  if (!isOwner) {
    return null;
  }

  const currentPlan = listing.pricePlan || "free";
  const isFree = currentPlan === "free";
  const isPro = currentPlan === "pro";
  const isPremium = currentPlan === "premium";

  return (
    <div className="space-y-6">
      {/* Owner Actions */}
      <Card className="border-brand-orange/20 bg-gradient-to-r from-brand-orange/5 to-brand-blue/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-brand-orange">
            <CrownIcon className="w-5 h-5" />
            Owner Dashboard
          </CardTitle>
          <CardDescription>
            You own this listing - manage and upgrade your visibility
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/edit/${listing._id}`} className="flex items-center gap-2">
                <EditIcon className="w-4 h-4" />
                Edit Listing
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard" className="flex items-center gap-2">
                <BarChartIcon className="w-4 h-4" />
                View Analytics
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Plan Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StarIcon className="w-5 h-5 text-brand-blue" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge 
                variant={isFree ? "secondary" : isPro ? "default" : "destructive"}
                className="text-sm"
              >
                {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
              </Badge>
              <span className="text-muted-foreground">
                {isFree ? "Free listing" : `${currentPlan} plan`}
              </span>
            </div>
            {isFree && (
              <Button size="sm" asChild className="bg-brand-orange hover:bg-brand-orange-dark">
                <Link href="/pricing" className="flex items-center gap-2">
                  Upgrade
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Options */}
      {isFree && (
        <Card className="border-brand-blue/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-brand-blue">
              <TrendingUpIcon className="w-5 h-5" />
              Upgrade Your Visibility
            </CardTitle>
            <CardDescription>
              Get more exposure and professional features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pro Plan */}
              <div className="p-4 border border-brand-blue/20 rounded-lg bg-brand-blue/5">
                <div className="flex items-center gap-2 mb-2">
                  <StarIcon className="w-4 h-4 text-brand-blue" />
                  <h4 className="font-semibold text-brand-blue">Pro Plan</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Featured placement, logo display, priority support
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-3 h-3 text-green-600" />
                    <span>Featured placement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-3 h-3 text-green-600" />
                    <span>Logo display</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-3 h-3 text-green-600" />
                    <span>Priority support</span>
                  </div>
                </div>
                <Button size="sm" className="w-full mt-3 bg-brand-blue hover:bg-brand-blue-dark">
                  Upgrade to Pro - $45/month
                </Button>
              </div>

              {/* Premium Plan */}
              <div className="p-4 border border-brand-orange/20 rounded-lg bg-brand-orange/5">
                <div className="flex items-center gap-2 mb-2">
                  <CrownIcon className="w-4 h-4 text-brand-orange" />
                  <h4 className="font-semibold text-brand-orange">Premium Plan</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  All Pro features plus 101 Badge and premium support
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-3 h-3 text-green-600" />
                    <span>All Pro features</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-3 h-3 text-green-600" />
                    <span>101 Badge (if qualified)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-3 h-3 text-green-600" />
                    <span>Dedicated support</span>
                  </div>
                </div>
                <Button size="sm" className="w-full mt-3 bg-brand-orange hover:bg-brand-orange-dark">
                  Upgrade to Premium - $90/month
                </Button>
              </div>
            </div>

            <div className="text-center">
              <Button variant="outline" asChild>
                <Link href="/pricing" className="flex items-center gap-2">
                  View All Plans
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
