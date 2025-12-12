import { getSocialProofStats } from "@/data/conversion-stats";
import { Sparkles, TrendingUp, Users } from "lucide-react";

/**
 * Social Proof & FOMO Generator
 * Shows live stats to create urgency and social validation
 */

export async function SocialProofStats() {
  const stats = await getSocialProofStats();

  const messages = [
    stats.upgradesThisWeekCount > 0 && {
      icon: TrendingUp,
      text: `${stats.upgradesThisWeekCount} ${stats.upgradesThisWeekCount === 1 ? "vendor" : "vendors"} upgraded to Pro this week`,
      color: "text-green-600 dark:text-green-400",
    },
    stats.newListingsThisWeekCount > 0 && {
      icon: Users,
      text: `${stats.newListingsThisWeekCount} new ${stats.newListingsThisWeekCount === 1 ? "professional" : "professionals"} joined this week`,
      color: "text-blue-600 dark:text-blue-400",
    },
    stats.proMembersCount > 0 && {
      icon: Sparkles,
      text: `Join ${stats.proMembersCount}+ Pro members growing their business`,
      color: "text-purple-600 dark:text-purple-400",
    },
    stats.categoryUpgradeLeader &&
      stats.categoryUpgradeCount > 0 && {
        icon: TrendingUp,
        text: `${stats.categoryUpgradeCount} ${stats.categoryUpgradeLeader} upgraded this month`,
        color: "text-orange-600 dark:text-orange-400",
      },
  ].filter(Boolean);

  if (messages.length === 0) {
    return null;
  }

  // Pick a random message to display (or rotate through them)
  const selectedMessage = messages[Math.floor(Math.random() * messages.length)];

  if (!selectedMessage) return null;

  const Icon = selectedMessage.icon;

  return (
    <div className="bg-muted/30 border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center gap-3 justify-center text-sm">
        <Icon className={`h-4 w-4 ${selectedMessage.color}`} />
        <span className="font-medium text-foreground">
          {selectedMessage.text}
        </span>
      </div>
    </div>
  );
}

/**
 * Compact version for inline display
 */
export async function SocialProofBadge() {
  const stats = await getSocialProofStats();

  if (stats.upgradesThisMonthCount === 0) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
      <TrendingUp className="h-3 w-3" />
      <span>{stats.upgradesThisMonthCount} upgraded this month</span>
    </div>
  );
}
