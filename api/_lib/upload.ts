import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif',
  'video/mp4',
  'video/webm',
  'video/quicktime'
]);

const EXTENSION_MAP: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
  'image/gif': '.gif',
  'video/mp4': '.mp4',
  'video/webm': '.webm',
  'video/quicktime': '.mov'
};

function getUploadDir(): string {
  const dir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

/**
 * Handle Base64 DataURL or buffer upload
 */
export async function saveUploadedFile(params: {
  filename?: string;
  dataUrl?: string;
  buffer?: Buffer;
  contentType?: string;
}): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    let fileBuffer: Buffer;
    let mimeType: string = params.contentType || '';
    let originalExt = '';

    if (params.dataUrl) {
      const matches = params.dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return { success: false, error: 'Invalid base64 data format.' };
      }
      mimeType = matches[1];
      fileBuffer = Buffer.from(matches[2], 'base64');
    } else if (params.buffer) {
      fileBuffer = params.buffer;
    } else {
      return { success: false, error: 'No media data provided.' };
    }

    if (params.filename) {
      originalExt = path.extname(params.filename).toLowerCase();
    }

    if (mimeType && !ALLOWED_MIME_TYPES.has(mimeType)) {
      return { success: false, error: `File type ${mimeType} is not supported.` };
    }

    const determinedExt = EXTENSION_MAP[mimeType] || originalExt || '.bin';
    const cleanId = crypto.randomBytes(8).toString('hex');
    const safeName = params.filename
      ? path.basename(params.filename, originalExt).replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30)
      : 'media';
    const finalFilename = `${Date.now()}-${safeName}-${cleanId}${determinedExt}`;

    // 1. Check Supabase Storage if configured
    const sbUrl = process.env.SUPABASE_URL;
    const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    if (sbUrl && sbKey) {
      try {
        const bucket = 'portfolio-media';
        const uploadRes = await fetch(`${sbUrl.replace(/\/$/, '')}/storage/v1/object/${bucket}/${finalFilename}`, {
          method: 'POST',
          headers: {
            'apikey': sbKey,
            'Authorization': `Bearer ${sbKey}`,
            'Content-Type': mimeType || 'application/octet-stream'
          },
          body: fileBuffer
        });

        if (uploadRes.ok) {
          const publicUrl = `${sbUrl.replace(/\/$/, '')}/storage/v1/object/public/${bucket}/${finalFilename}`;
          return { success: true, url: publicUrl };
        }
      } catch (err) {
        console.warn('[Upload] Supabase upload failed, falling back to local file storage:', err);
      }
    }

    // 2. Local filesystem storage
    const uploadDir = getUploadDir();
    const destPath = path.join(uploadDir, finalFilename);
    fs.writeFileSync(destPath, fileBuffer);

    return {
      success: true,
      url: `/uploads/${finalFilename}`
    };
  } catch (err: any) {
    console.error('[Upload] Error saving file:', err);
    return { success: false, error: err.message || 'File upload failed.' };
  }
}
