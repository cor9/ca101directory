"use server";

import { supabase } from "@/lib/supabase";

export async function getCategoriesByIds(categoryIds: string[]) {
  try {
    // First try to look up by ID in the categories table
    const { data: categories, error } = await supabase
      .from("categories")
      .select("id, category_name")
      .in("id", categoryIds);

    if (error) {
      console.error("Error fetching categories:", error);
    }

    const result: Record<string, string> = {};

    // If we found categories by ID, add them to result
    if (categories) {
      categories.forEach((cat) => {
        result[cat.id] = cat.category_name;
      });
    }

    // For any UUIDs that weren't found, try to map them to known category names
    // This handles cases where listings have old Airtable UUIDs
    const uuidToCategoryMap: Record<string, string> = {
      "c0b8d6a5-436a-4004-b6b6-8b58a9f5b3d2": "Acting Classes & Coaches",
      "10159a59-61f7-4375-8770-141b6ddc878f": "Headshot Photographers",
      "e4770486-0c03-4263-8d0b-99c11598ddbf": "Self-Tape Studios",
      "54d02e9e-e984-4de0-97df-28fde1d18344": "Demo Reel Creators",
      "7992d99a-6491-406e-b845-cfdb0986331d": "Vocal Coaches",
      "c5236852-82be-48df-8762-85c2b18f0d76": "Talent Managers",
      "1f3ec0a8-f2b8-41c4-b5fd-c7b78c266629": "Casting Workshops",
      "e656d5c5-35c8-426e-a02c-5adf5e82f7e7": "Reels Editors",
      "dff32333-23be-4cbc-86e6-9bde617e2ddd": "Social Media Consultants",
      "ca25586e-8cb2-40db-a06b-f6570a8952f9": "Acting Camps",
    };

    // Add any UUIDs that weren't found in the database but have known mappings
    categoryIds.forEach((categoryId) => {
      if (!result[categoryId] && uuidToCategoryMap[categoryId]) {
        result[categoryId] = uuidToCategoryMap[categoryId];
      }
    });

    return result;
  } catch (error) {
    console.error("Error in getCategoriesByIds:", error);
    return {};
  }
}
