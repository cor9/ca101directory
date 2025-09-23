import { createClient } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const businessSlug = formData.get("businessSlug") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size (200KB limit)
    const maxSizeInBytes = 200 * 1024;
    if (file.size > maxSizeInBytes) {
      return NextResponse.json(
        { error: "File must be under 200KB" },
        { status: 400 },
      );
    }

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      return NextResponse.json(
        { error: "Only JPEG and PNG images are allowed" },
        { status: 400 },
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.type === "image/jpeg" ? "jpg" : "png";
    const slug = businessSlug || "logo";
    const fileName = `${slug}-${timestamp}.${fileExtension}`;

    // Try to create bucket if it doesn't exist (ignore errors if it already exists)
    await supabase.storage.createBucket("attachments", {
      public: true,
      allowedMimeTypes: ["image/jpeg", "image/png"],
      fileSizeLimit: 200 * 1024,
    });

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("attachments")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: `Upload failed: ${error.message}` },
        { status: 500 },
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("attachments").getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: fileName,
    });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
