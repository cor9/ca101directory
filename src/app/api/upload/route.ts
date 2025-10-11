import { createServerClient } from "@/lib/supabase";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const businessSlug = formData.get("businessSlug") as string;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size (5MB limit)
    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return Response.json(
        { error: "File must be under 5MB" },
        { status: 400 },
      );
    }

    // Validate file type (allow JPEG, PNG, and WebP)
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      return Response.json(
        { error: "Only JPEG, PNG, and WebP images are allowed" },
        { status: 400 },
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension =
      file.type === "image/jpeg"
        ? "jpg"
        : file.type === "image/webp"
          ? "webp"
          : "png";
    const slug = businessSlug || "logo";
    const filename = `${slug}-${timestamp}.${fileExtension}`;

    // Upload to Supabase Storage
    const supabase = createServerClient();
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("listing-images")
      .upload(filename, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return Response.json({ error: "Upload failed" }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("listing-images")
      .getPublicUrl(uploadData.path);

    return Response.json({
      success: true,
      url: urlData.publicUrl,
      fileName: filename,
    });
  } catch (error) {
    console.error("Supabase upload error:", error);
    return Response.json(
      {
        error: `Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    );
  }
}
