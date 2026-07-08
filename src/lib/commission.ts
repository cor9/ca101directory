import { COMMISSION_RATES, PRO_ANNUAL_PRICE_CENTS } from "@/config/commission";

export type AttributionSource = "assignment" | "link";

export type AttributionResult =
  | {
      attributed: true;
      repId: string;
      source: AttributionSource;
      note?: string;
    }
  | {
      attributed: false;
      reason:
        | "house_sale"
        | "excluded_free"
        | "excluded_comped"
        | "excluded_admin";
    };

export type ActiveAssignment = {
  repId: string;
  assignedAt: Date;
};

/**
 * Pure decision function for §3 step 0 (eligibility) + steps 1-3 (attribution).
 * Callers are responsible for fetching `activeAssignment`, `repCodeLookup`,
 * `comped`, and `isAdminInitiated` from the database/session before calling.
 */
export function resolveAttribution(params: {
  plan: string;
  comped: boolean;
  isAdminInitiated: boolean;
  activeAssignment: ActiveAssignment | null;
  attributionWindowDays: number;
  now: Date;
  repCode?: string;
  repCodeLookup?: { repId: string; active: boolean } | null;
  conflictingRepCode?: string;
}): AttributionResult {
  if (!(params.plan in COMMISSION_RATES)) {
    return { attributed: false, reason: "excluded_free" };
  }
  if (params.comped) {
    return { attributed: false, reason: "excluded_comped" };
  }
  if (params.isAdminInitiated) {
    return { attributed: false, reason: "excluded_admin" };
  }

  if (params.activeAssignment) {
    const ageDays =
      (params.now.getTime() - params.activeAssignment.assignedAt.getTime()) /
      (1000 * 60 * 60 * 24);
    if (ageDays <= params.attributionWindowDays) {
      const note =
        params.repCode &&
        params.repCodeLookup?.repId &&
        params.repCodeLookup.repId !== params.activeAssignment.repId
          ? `conflicting rep_code=${params.repCode} at checkout`
          : undefined;
      return {
        attributed: true,
        repId: params.activeAssignment.repId,
        source: "assignment",
        note,
      };
    }
  }

  if (params.repCode && params.repCodeLookup?.active) {
    return {
      attributed: true,
      repId: params.repCodeLookup.repId,
      source: "link",
    };
  }

  return { attributed: false, reason: "house_sale" };
}

/**
 * New-sale commission only. Renewal commissioning is deferred to Sprint 2b —
 * do not extend this function for renewal rates without wiring the
 * corresponding subscription-lifecycle webhook handling first.
 */
export function computeCommission(
  plan: string,
  saleAmountCents: number,
): { tierRate: number; amountCents: number; priceDrift: boolean } | null {
  const tierRate = COMMISSION_RATES[plan];
  if (tierRate === undefined) {
    return null;
  }
  const amountCents = Math.round(saleAmountCents * tierRate);
  const priceDrift =
    plan === "pro" && saleAmountCents !== PRO_ANNUAL_PRICE_CENTS;
  return { tierRate, amountCents, priceDrift };
}

/**
 * Computes a clawback adjustment for a refund against an already-paid
 * commission. Returns a negative amount, rounded toward the house
 * (Math.floor of the magnitude) for partial refunds.
 */
export function computeRefundAdjustment(
  originalAmountCents: number,
  originalSaleAmountCents: number,
  refundedAmountCents: number,
): number {
  if (refundedAmountCents >= originalSaleAmountCents) {
    return -originalAmountCents;
  }
  const fraction = refundedAmountCents / originalSaleAmountCents;
  return -Math.floor(originalAmountCents * fraction);
}
