"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { uploadLogoToSupabase } from "@/lib/supabase-upload";
import Image from "next/image";
import { useState } from "react";

export default function TestUploadPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const result = await uploadLogoToSupabase(file, "test-upload");

      if (result.success && result.url) {
        setUploadedUrl(result.url);
        console.log("✅ Upload successful:", result.url);
      } else {
        setError(result.error || "Upload failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>🧪 Supabase S3 Upload Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label
              htmlFor="file-upload"
              className="block text-sm font-medium mb-2"
            >
              Select an image to upload (PNG/JPEG, max 200KB):
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileUpload}
              disabled={uploading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {uploading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">
                Uploading to Supabase...
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800 text-sm">❌ Error: {error}</p>
            </div>
          )}

          {uploadedUrl && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <p className="text-green-800 text-sm">✅ Upload successful!</p>
                <p className="text-xs text-green-600 mt-1 break-all">
                  URL: {uploadedUrl}
                </p>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Image
                  src={uploadedUrl}
                  alt="Uploaded image"
                  width={400}
                  height={300}
                  className="w-full h-auto"
                />
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 space-y-1">
            <p>
              <strong>Bucket:</strong> directory-logos
            </p>
            <p>
              <strong>Endpoint:</strong>{" "}
              crkrittfvylvbtjetxoa.storage.supabase.co
            </p>
            <p>
              <strong>Region:</strong> us-west-1
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
