import { ItemInfo } from "@/types";

export enum PricePlan {
    FREE = "free",
    PRO = "pro",
}

export enum FreePlanStatus {
    APPROVED = "approved",
    REJECTED = "rejected",
    PENDING = "pending",
}

export enum ProPlanStatus {
    SUCCESS = "success",
    FAILED = "failed",
    PENDING = "pending",
}

export const getPublishable = (item: ItemInfo): boolean => {
    if (item.pricePlan === PricePlan.FREE) {
        return item.freePlanStatus === FreePlanStatus.APPROVED;
    } else if (item.pricePlan === PricePlan.PRO) {
        return item.proPlanStatus === ProPlanStatus.SUCCESS;
    }
    return false;
};

export const getBadgeStyle = (item: ItemInfo): "success" | "pending" | "danger" | "normal" => {
    if (item.pricePlan === PricePlan.FREE) {
        switch (item.freePlanStatus) {
            case FreePlanStatus.APPROVED: return "success";
            case FreePlanStatus.REJECTED: return "danger";
            case FreePlanStatus.PENDING: return "pending";
            default: return "normal";
        }
    } else if (item.pricePlan === PricePlan.PRO) {
        switch (item.proPlanStatus) {
            case ProPlanStatus.SUCCESS: return "success";
            case ProPlanStatus.FAILED: return "danger";
            case ProPlanStatus.PENDING: return "pending";
            default: return "normal";
        }
    }
    return "normal";
};