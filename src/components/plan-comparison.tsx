"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PLAN_FEATURES } from "@/lib/constants";
import { Check, Crown, Star, Zap } from "lucide-react";

interface PlanComparisonProps {
  selectedPlan?: string;
  onPlanSelect: (plan: string) => void;
  showFreeOption?: boolean;
}

export function PlanComparison({
  selectedPlan,
  onPlanSelect,
  showFreeOption = true,
}: PlanComparisonProps) {
  const plans = showFreeOption
    ? [PLAN_FEATURES.FREE, PLAN_FEATURES.STANDARD, PLAN_FEATURES.PRO]
    : [PLAN_FEATURES.STANDARD, PLAN_FEATURES.PRO];

  const getPlanIcon = (planName: string) => {
    switch (planName) {
      case "Free Listing":
        return <Star className="h-5 w-5 text-yellow-500" />;
      case "Standard Plan":
        return <Zap className="h-5 w-5 text-blue-500" />;
      case "Pro Plan":
        return <Crown className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };

  const getPlanColor = (planName: string) => {
    switch (planName) {
      case "Free Listing":
        return "border-gray-200 bg-gray-50";
      case "Standard Plan":
        return "border-blue-200 bg-blue-50";
      case "Pro Plan":
        return "border-purple-200 bg-purple-50";
      default:
        return "border-gray-200";
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((plan) => (
        <Card
          key={plan.name}
          className={`relative cursor-pointer transition-all hover:shadow-lg ${
            selectedPlan === plan.name
              ? `ring-2 ring-[#FF6B35] ${getPlanColor(plan.name)}`
              : getPlanColor(plan.name)
          }`}
          onClick={() => onPlanSelect(plan.name)}
        >
          {plan.name === "Pro Plan" && (
            <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-purple-600">
              Most Popular
            </Badge>
          )}

          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-2">
              {getPlanIcon(plan.name)}
            </div>
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <div className="text-3xl font-bold text-[#FF6B35]">
              ${plan.price}
              {plan.price > 0 && (
                <span className="text-sm font-normal text-gray-600">
                  /month
                </span>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            {"limitations" in plan &&
              plan.limitations &&
              plan.limitations.length > 0 && (
                <div className="space-y-2 pt-2 border-t">
                  <p className="text-sm font-medium text-gray-700">
                    Limitations:
                  </p>
                  {plan.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">•</span>
                      <span className="text-sm text-gray-600">
                        {limitation}
                      </span>
                    </div>
                  ))}
                </div>
              )}

            <div className="pt-4">
              {plan.upgradePrompt && (
                <p className="text-xs text-gray-500 italic text-center">
                  {plan.upgradePrompt}
                </p>
              )}
            </div>

            <Button
              className={`w-full ${
                plan.name === "Free Listing"
                  ? "bg-gray-600 hover:bg-gray-700"
                  : plan.name === "Pro Plan"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-purple-600 hover:bg-purple-700"
              }`}
              variant={selectedPlan === plan.name ? "default" : "outline"}
              onClick={(e) => {
                e.stopPropagation();
                onPlanSelect(plan.name);
              }}
            >
              {plan.price === 0 ? "Get Started Free" : `Choose ${plan.name}`}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
