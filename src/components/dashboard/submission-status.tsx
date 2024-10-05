import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BadgeStyle, BadgeStyles, FreePlanStatus, getBadgeStyle, PricePlan } from "@/lib/submission";
import { cn } from "@/lib/utils";
import { ItemInfo } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { InfoIcon } from "lucide-react";

type SubmissionStatusProps = {
    item: ItemInfo;
};

function StatusBadge({ badgeStyle, children }: { badgeStyle: BadgeStyle, children: React.ReactNode }) {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'free':
                return 'bg-[#E8FFF3] text-[#00BA88]';
            case 'paid':
                return 'bg-[#FFF8E8] text-[#FF9900]';
            case 'freemium':
                return 'bg-[#E8F7FF] text-[#00CFFF]';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    return (
        <div className={cn(
            "px-3 py-1 rounded-full text-sm font-medium",
            "capitalize",
            badgeStyle === BadgeStyles.SUCCESS && "bg-green-100 text-green-800",
            badgeStyle === BadgeStyles.DANGER && "bg-red-100 text-red-800",
            badgeStyle === BadgeStyles.WARNING && "bg-yellow-100 text-yellow-800",
            badgeStyle === BadgeStyles.NORMAL && "bg-gray-100 text-gray-800"
        )}>
            {children}
        </div>
    );
    // return (
    //     <Badge variant='outline' className={cn(
    //         "capitalize",
    //         badgeStyle === BadgeStyles.SUCCESS && "bg-green-100 text-green-800",
    //         badgeStyle === BadgeStyles.DANGER && "bg-red-100 text-red-800",
    //         badgeStyle === BadgeStyles.WARNING && "bg-yellow-100 text-yellow-800",
    //         badgeStyle === BadgeStyles.NORMAL && "bg-gray-100 text-gray-800"
    //     )}>
    //         {children}
    //     </Badge>
    // )
}

export default function SubmissionStatus({ item }: SubmissionStatusProps) {
    const badgeStyle = getBadgeStyle(item);
    const status = item.pricePlan === PricePlan.FREE ? item.freePlanStatus : item.proPlanStatus;

    return (
        <div>
            {
                status === FreePlanStatus.REJECTED ? (
                    <Popover>
                        <PopoverTrigger>
                            <StatusBadge badgeStyle={badgeStyle}>
                                <div className="flex items-center gap-2">
                                    <span className="capitalize">{status}</span>
                                    <InfoIcon className="w-3 h-3" />
                                </div>
                            </StatusBadge>
                        </PopoverTrigger>
                        <PopoverContent>
                            <Card>
                                <p className="p-4 text-red-800">{item.rejectionReason}</p>
                            </Card>
                        </PopoverContent>
                    </Popover>
                ) : (
                    <StatusBadge badgeStyle={badgeStyle}>
                        <span className="capitalize">{status}</span>
                    </StatusBadge>
                )
            }
        </div>
    )
}