import { createServerClient } from "@/lib/supabase";
import { auth } from "@/auth";
import type { NextRequest } from "next/server";

// Use Node.js runtime for broader compatibility with Storage upload
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const businessSlug = formData.get("businessSlug") as string;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size (10MB limit)
    const maxSizeInBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return Response.json(
        { error: `File too large (${Math.round(file.size / 1024 / 1024)}MB). Max 10MB. Consider resizing to under 2000px.` },
        { status: 400 },
      );
    }

    // Validate file type (allow JPEG, PNG, WebP, and HEIC)
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp|heic)$/) && !/\.heic$/i.test((formData.get("file") as File)?.name || "")) {
      return Response.json(
        { error: "Only JPEG, PNG, WebP, and HEIC images are allowed" },
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

    // Upload to Supabase Storage (ensure Node/Edge-safe payload)
    const supabase = createServerClient();
    const bytes = new Uint8Array(await file.arrayBuffer());
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("listing-images")
      .upload(filename, bytes, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return Response.json({ error: "Upload failed" }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("listing-images")
      .getPublicUrl(uploadData.path);

    // Try to capture user context for server-side triage logs
    try {
      const session = await auth();
      console.log("upload: user:", session?.user?.id, session?.user?.email);
    } catch (e) {
      console.log("upload: no session available");
    }
    console.log("upload: file:", {
      name: (formData.get("file") as File)?.name,
      type: file.type,
      size: file.size,
      filename,
      slug,
    });

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
