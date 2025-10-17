import { NextResponse } from "next/server";
import { getCategories } from "@/data/categories";
import { getCategoriesByIds } from "@/actions/categories";

export async function GET() {
  try {
    // Get all categories from Supabase
    const categories = await getCategories();
    
    // Test the getCategoriesByIds function with the Actorsite category IDs
    const actorsiteCategoryIds = [
      "c0b8d6a5-436a-4004-b6b6-8b58a9f5b3d2",
      "10159a59-61f7-4375-8770-141b6ddc878f",
      "e4770486-0c03-4263-8d0b-99c11598ddbf",
      "54d02e9e-e984-4de0-97df-28fde1d18344",
      "7992d99a-6491-406e-b845-cfdb0986331d",
      "c5236852-82be-48df-8762-85c2b18f0d76",
      "1f3ec0a8-f2b8-41c4-b5fd-c7b78c266629",
      "e656d5c5-35c8-426e-a02c-5adf5e82f7e7",
      "dff32333-23be-4cbc-86e6-9bde617e2ddd",
      "ca25586e-8cb2-40db-a06b-f6570a8952f9"
    ];
    
    const resolvedCategories = await getCategoriesByIds(actorsiteCategoryIds);
    
    return NextResponse.json({
      totalCategories: categories.length,
      categories: categories,
      actorsiteCategoryIds: actorsiteCategoryIds,
      resolvedCategories: resolvedCategories,
      debug: {
        environment: {
          hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        },
      },
    });
  } catch (error) {
    console.error("Debug categories error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch categories",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
