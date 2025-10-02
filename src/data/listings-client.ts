"use client";

import { createClient } from "@/lib/supabase/client";
import type { Listing } from "./listings";

export async function getPublicListingsClient(params?: {
  q?: string;
  state?: string;
  region?: string;
  city?: string;
  category?: string;
}): Promise<Listing[]> {
  console.log("getPublicListingsClient: Starting fetch with params:", params);

  try {
    const supabase = createClient();
    let query = supabase
      .from("listings")
      .select("*")
      .eq("active", "checked")
      .order("created_at", { ascending: false });

    // Apply filters
    if (params?.q) {
      query = query.or(
        `listing_name.ilike.%${params.q}%,what_you_offer.ilike.%${params.q}%,who_is_it_for.ilike.%${params.q}%`
      );
    }

    if (params?.state) {
      query = query.eq("state", params.state);
    }

    if (params?.region) {
      query = query.eq("region", params.region);
    }

    if (params?.city) {
      query = query.eq("city", params.city);
    }

    if (params?.category) {
      query = query.ilike("categories", `%${params.category}%`);
    }

    const { data, error } = await query;

    console.log("getPublicListingsClient: Result:", { 
      count: data?.length || 0, 
      error 
    });

    if (error) {
      console.error("getPublicListingsClient: Error:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("getPublicListingsClient: Error fetching listings:", error);
    return [];
  }
}
