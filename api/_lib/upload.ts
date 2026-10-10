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
    const sbUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
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
        } else {
          const errText = await uploadRes.text();
          console.error('[Upload] Supabase upload failed:', uploadRes.status, errText);
          return { success: false, error: `Supabase Storage upload failed (HTTP ${uploadRes.status}): ${errText}` };
        }
      } catch (err: any) {
        console.error('[Upload] Supabase storage exception:', err);
        return { success: false, error: err.message || 'Supabase storage error.' };
      }
    }

    // 2. Local filesystem storage (only when Supabase is not configured, e.g. local dev)
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

/**
 * Creates a signed upload URL from Supabase Storage so large video files
 * can be uploaded directly from the browser, bypassing Vercel's 4.5 MB serverless limit.
 */
export async function createSignedUploadUrl(params: {
  filename: string;
  contentType: string;
}): Promise<{
  success: boolean;
  signedUrl?: string;
  publicUrl?: string;
  filename?: string;
  error?: string;
}> {
  const sbUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!sbUrl || !sbKey) {
    return {
      success: false,
      error: 'Supabase Storage is not configured. Please verify SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel settings.'
    };
  }

  const mimeType = params.contentType || '';
  if (mimeType && !ALLOWED_MIME_TYPES.has(mimeType)) {
    return { success: false, error: `File type ${mimeType} is not supported.` };
  }

  const originalExt = path.extname(params.filename).toLowerCase();
  const determinedExt = EXTENSION_MAP[mimeType] || originalExt || '.bin';
  const cleanId = crypto.randomBytes(8).toString('hex');
  const safeName = params.filename
    ? path.basename(params.filename, originalExt).replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30)
    : 'media';
  const finalFilename = `${Date.now()}-${safeName}-${cleanId}${determinedExt}`;
  const bucket = 'portfolio-media';

  try {
    const cleanSbUrl = sbUrl.replace(/\/$/, '');
    const signEndpoint = `${cleanSbUrl}/storage/v1/object/upload/sign/${bucket}/${finalFilename}`;

    const res = await fetch(signEndpoint, {
      method: 'POST',
      headers: {
        'apikey': sbKey,
        'Authorization': `Bearer ${sbKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ upsert: true })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[Upload] Supabase Storage refused signed upload URL:', res.status, errText);
      return {
        success: false,
        error: `Supabase Storage refused upload authorization (HTTP ${res.status}): ${errText}`
      };
    }

    const data = (await res.json()) as any;
    const rawUrl = data.url || data.signedUrl || data.signedURL;
    if (!rawUrl) {
      return { success: false, error: 'Supabase Storage returned invalid signed URL response.' };
    }

    let signedUrl = rawUrl.startsWith('http')
      ? rawUrl
      : rawUrl.startsWith('/storage/v1')
        ? `${cleanSbUrl}${rawUrl}`
        : `${cleanSbUrl}/storage/v1${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;

    // If token returned separately and not already in query string, append it
    if (data.token && !signedUrl.includes('token=')) {
      const separator = signedUrl.includes('?') ? '&' : '?';
      signedUrl = `${signedUrl}${separator}token=${encodeURIComponent(data.token)}`;
    }

    const publicUrl = `${cleanSbUrl}/storage/v1/object/public/${bucket}/${finalFilename}`;

    return {
      success: true,
      signedUrl,
      publicUrl,
      filename: finalFilename
    };
  } catch (err: any) {
    console.error('[Upload] Error in createSignedUploadUrl:', err);
    return {
      success: false,
      error: err.message || 'Failed to initialize signed upload with Supabase Storage.'
    };
  }
}
