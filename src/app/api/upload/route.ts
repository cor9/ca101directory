import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function POST(request: NextRequest) {
  try {
    console.log("Upload API called");
    
    // First, let's see what buckets exist
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    console.log("Available buckets:", buckets);
    console.log("Buckets error:", bucketsError);

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.type === "image/jpeg" ? "jpg" : "png";
    const fileName = `logo-${timestamp}.${fileExtension}`;

    console.log("Uploading file:", fileName);

    // Try uploading to the first available bucket
    const bucketName = buckets && buckets.length > 0 ? buckets[0].name : "public";
    console.log("Using bucket:", bucketName);

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json(
        { error: `Upload failed: ${error.message}` },
        { status: 500 },
      );
    }

    const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: fileName,
    });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 },
    );
  }
}