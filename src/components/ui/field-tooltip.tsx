import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, Sparkles } from "lucide-react";

interface FieldTooltipProps {
  message: string;
  plan?: "Free" | "Standard" | "Pro";
  showUpgradeIcon?: boolean;
}

export function FieldTooltip({ message, plan, showUpgradeIcon = false }: FieldTooltipProps) {
  const isFreePlan = plan === "Free";
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center justify-center w-4 h-4 text-gray-900 hover:text-gray-900 transition-colors"
            aria-label="More information"
          >
            {showUpgradeIcon && isFreePlan ? (
              <Sparkles className="w-4 h-4 text-brand-orange" />
            ) : (
              <HelpCircle className="w-4 h-4" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-sm">{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

