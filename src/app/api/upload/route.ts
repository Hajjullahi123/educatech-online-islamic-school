import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import crypto from 'crypto';
import { auth } from '@/auth';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Cloud Storage Option: Supabase Storage (REST API)
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const bucketName = process.env.SUPABASE_BUCKET || 'recitations';
      const fileExt = file.name.split('.').pop() || 'wav';
      const filename = `${crypto.randomUUID()}.${fileExt}`;
      const uploadUrl = `${process.env.SUPABASE_URL}/storage/v1/object/${bucketName}/${filename}`;

      const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': file.type || 'audio/wav',
        },
        body: buffer,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Supabase upload failed: ${errText}`);
      }

      // Construct public URL
      const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${bucketName}/${filename}`;
      return NextResponse.json({ success: true, url: publicUrl });
    }

    // 2. Local Storage Option (Development/Testing Fallback)
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    
    // Ensure upload directory exists
    await mkdir(uploadDir, { recursive: true });

    const fileExt = file.name.split('.').pop() || 'wav';
    const filename = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = join(uploadDir, filename);

    await writeFile(filePath, buffer);

    const localUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: localUrl });

  } catch (error: any) {
    console.error('File Upload Error:', error);
    return NextResponse.json({ error: error.message || 'File upload failed' }, { status: 500 });
  }
}
export const runtime = 'nodejs';
