import { createClient } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function POST(request: NextRequest) {
  try {
    console.log("Upload API called");
    
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const businessSlug = formData.get("businessSlug") as string;

    console.log("File received:", file?.name, file?.size, file?.type);

    if (!file) {
      console.log("No file provided");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size (200KB limit)
    const maxSizeInBytes = 200 * 1024;
    if (file.size > maxSizeInBytes) {
      console.log("File too large:", file.size);
      return NextResponse.json(
        { error: "File must be under 200KB" },
        { status: 400 },
      );
    }

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      console.log("Invalid file type:", file.type);
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

    console.log("Uploading file:", fileName);

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

    console.log("Upload successful:", data);

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("attachments").getPublicUrl(fileName);

    console.log("Public URL:", publicUrl);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: fileName,
    });
  } catch (error) {
    console.error("Upload API error:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack");
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 },
    );
  }
}
