"use server";

export type BannerAdData = {
  content: string;
  url: string;
};

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
  data?: BannerAdData;
};

export async function getBannerAd(): Promise<ServerActionResponse> {
  // Temporarily disabled while migrating to Airtable
  // Banner ads will be re-implemented with Airtable integration
  return {
    status: "error",
    message: "Banner ads temporarily disabled during Airtable migration",
    data: null,
  };
}
