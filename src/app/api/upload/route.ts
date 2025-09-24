import { NextRequest } from 'next/server';
import { put } from '@vercel/blob';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const businessSlug = formData.get('businessSlug') as string;

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size (200KB limit)
    const maxSizeInBytes = 200 * 1024;
    if (file.size > maxSizeInBytes) {
      return Response.json(
        { error: 'File must be under 200KB' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      return Response.json(
        { error: 'Only JPEG and PNG images are allowed' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.type === 'image/jpeg' ? 'jpg' : 'png';
    const slug = businessSlug || 'logo';
    const filename = `${slug}-${timestamp}.${fileExtension}`;

    // Upload to Vercel Blob
    const blob = await put(`uploads/${filename}`, file, { 
      access: 'public' 
    });

    return Response.json({ 
      success: true,
      url: blob.url, 
      fileName: filename 
    });
  } catch (error) {
    console.error('Vercel Blob upload error:', error);
    return Response.json(
      { error: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}