export type ListingType = "SERVICE_VENDOR" | "INDUSTRY_PRO" | "REGULATED_PRO";

export const isIndustryPro = (t?: string | null) => t === "INDUSTRY_PRO";
export const isRegulatedPro = (t?: string | null) => t === "REGULATED_PRO";
export const isServiceVendor = (t?: string | null) => !t || t === "SERVICE_VENDOR";


