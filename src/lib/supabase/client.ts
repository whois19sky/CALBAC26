'use client'

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mwlmrpgcapayddcxqhsu.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_GGYVswUEbxwfN_kAMvEO7w_8VxV-ogm'
  )
}

const MAX_DIMENSION = 1920; // px, on the longest side — plenty for any use on this site
const JPEG_QUALITY = 0.82;
const HARD_SIZE_CAP_BYTES = 8 * 1024 * 1024; // 8MB absolute reject, even after compression attempts

/**
 * Resizes/compresses an image client-side before it ever reaches the server.
 * This is what prevents a full-resolution phone camera photo (often 3-10MB+)
 * from being uploaded as-is, which can overload server memory when the image
 * has to be processed repeatedly for display across the site.
 * Non-image files are passed through unchanged.
 */
async function resizeImageIfNeeded(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;
      if (width <= MAX_DIMENSION && height <= MAX_DIMENSION && file.size <= HARD_SIZE_CAP_BYTES) {
        // Already a reasonable size — no need to re-encode and lose quality for nothing.
        resolve(file);
        return;
      }

      if (width > height && width > MAX_DIMENSION) {
        height = Math.round((height * MAX_DIMENSION) / width);
        width = MAX_DIMENSION;
      } else if (height > MAX_DIMENSION) {
        width = Math.round((width * MAX_DIMENSION) / height);
        height = MAX_DIMENSION;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file); // fall back to original if canvas isn't available for some reason
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const resizedFile = new File([blob], file.name, { type: 'image/jpeg' });
          resolve(resizedFile);
        },
        'image/jpeg',
        JPEG_QUALITY
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file); // if it can't even load as an image, let the upload proceed and fail normally
    };

    img.src = objectUrl;
  });
}

export const uploadFileToStorage = async (file: File, bucket: string = 'uploads'): Promise<string | null> => {
  const processedFile = await resizeImageIfNeeded(file);

  if (processedFile.size > HARD_SIZE_CAP_BYTES) {
    console.error('Upload rejected: file still too large after compression attempt.');
    return null;
  }

  const supabase = createClient();
  const fileExt = processedFile.type === 'image/jpeg' ? 'jpg' : (file.name.split('.').pop() || 'jpg');
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, processedFile);

  if (uploadError) {
    console.error('Upload Error:', uploadError);
    return null;
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return data.publicUrl;
};
