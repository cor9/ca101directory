import { auth } from "@/auth";
import { createServerClient } from "@/lib/supabase";
import { validateImageUpload } from "@/lib/uploads/image-validation";
import type { NextRequest } from "next/server";

// Use Node.js runtime for broader compatibility with Storage upload
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const businessSlug = formData.get("businessSlug") as string;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    const validation = validateImageUpload(file);
    if (validation.valid === false) {
      if (validation.reason === "too_large") {
        return Response.json(
          {
            error: `File too large (${Math.round(file.size / 1024 / 1024)}MB). Max 10MB. Consider resizing to under 2000px.`,
          },
          { status: 400 },
        );
      }
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
          : file.type === "image/heic" || file.type === "image/heif"
            ? "heic"
            : "png";
    // businessSlug is client-supplied and becomes part of the storage object
    // path: allow only [a-z0-9-] so it can't inject path segments.
    const slug =
      String(businessSlug || "logo")
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60) || "logo";
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
