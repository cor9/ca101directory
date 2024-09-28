import { ItemInfo } from "@/types";

export enum PricePlan {
    FREE = "free",
    PRO = "pro",
}

export enum FreePlanStatus {
    APPROVED = "approved",
    REJECTED = "rejected",
    PENDING = "pending",
    SUBMITTING = "submitting",
}

export enum ProPlanStatus {
    SUCCESS = "success",
    FAILED = "failed",
    PENDING = "pending",
    SUBMITTING = "submitting",
}

export const getPublishable = (item: ItemInfo): boolean => {
    if (item.pricePlan === PricePlan.FREE) {
        return item.freePlanStatus === FreePlanStatus.APPROVED;
    } else if (item.pricePlan === PricePlan.PRO) {
        return item.proPlanStatus === ProPlanStatus.SUCCESS;
    }
    return false;
};

export const BadgeStyles = {
    SUCCESS: "success",
    WARNING: "warning",
    DANGER: "danger",
    NORMAL: "normal",
} as const;

export type BadgeStyle = (typeof BadgeStyles)[keyof typeof BadgeStyles];

export const getBadgeStyle = (item: ItemInfo): BadgeStyle => {
    if (item.pricePlan === PricePlan.FREE) {
        switch (item.freePlanStatus) {
            case FreePlanStatus.APPROVED: return BadgeStyles.SUCCESS;
            case FreePlanStatus.REJECTED: return BadgeStyles.DANGER;
            case FreePlanStatus.PENDING: return BadgeStyles.WARNING;
            default: return BadgeStyles.NORMAL;
        }
    } else if (item.pricePlan === PricePlan.PRO) {
        switch (item.proPlanStatus) {
            case ProPlanStatus.SUCCESS: return BadgeStyles.SUCCESS;
            case ProPlanStatus.FAILED: return BadgeStyles.DANGER;
            case ProPlanStatus.PENDING: return BadgeStyles.WARNING;
            default: return BadgeStyles.NORMAL;
        }
    }
    return BadgeStyles.NORMAL;
};