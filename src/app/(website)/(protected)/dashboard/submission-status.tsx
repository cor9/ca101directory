import { Badge } from "@/components/ui/badge";
import { BadgeStyle, BadgeStyles, FreePlanStatus, getBadgeStyle, PricePlan } from "@/lib/submission";
import { cn } from "@/lib/utils";
import { ItemInfo } from "@/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { InfoIcon } from "lucide-react";

type SubmissionStatusProps = {
    item: ItemInfo;
};

function StatusBadge({ badgeStyle, children }: { badgeStyle: BadgeStyle, children: React.ReactNode }) {
    return (
        <Badge variant='outline' className={cn(
            "capitalize",
            badgeStyle === BadgeStyles.SUCCESS && "bg-green-100 text-green-800",
            badgeStyle === BadgeStyles.DANGER && "bg-red-100 text-red-800",
            badgeStyle === BadgeStyles.WARNING && "bg-yellow-100 text-yellow-800",
            badgeStyle === BadgeStyles.NORMAL && "bg-gray-100 text-gray-800"
        )}>
            {children}
        </Badge>
    )
}

export default function SubmissionStatus({ item }: SubmissionStatusProps) {
    const badgeStyle = getBadgeStyle(item);
    const status = item.pricePlan === PricePlan.FREE ? item.freePlanStatus : item.proPlanStatus;

    return (
        <>
            {
                status === FreePlanStatus.REJECTED ? (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <StatusBadge badgeStyle={badgeStyle}>
                                    <div className="flex items-center gap-2">
                                        <span className="capitalize">{status}</span>
                                        <InfoIcon className="w-3 h-3" />
                                    </div>
                                </StatusBadge>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="p-1 text-red-800">{item.rejectionReason}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ) : (
                    <StatusBadge badgeStyle={badgeStyle}>
                        <span className="capitalize">{status}</span>
                    </StatusBadge>
                )
            }
        </>
    )
}