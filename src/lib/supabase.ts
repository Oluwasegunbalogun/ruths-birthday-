import { createClient } from '@supabase/supabase-js';
import imageCompression from 'browser-image-compression';

const supabaseUrl = 'https://nzdiakfcopufqpctrkru.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56ZGlha2Zjb3B1ZnFwY3Rya3J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxODA5MTAsImV4cCI6MjA5MTc1NjkxMH0.MOWE1zUPR8qBdovQnzMo_n5nhJSs448o5-L0qh7ddjU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Robust media upload helper with image compression and mobile optimization
 */
export const uploadMedia = async (file: File, path: string = 'contributions') => {
  let fileToUpload = file;
  
  // 1. Image compression for mobile & performance
  if (file.type.startsWith('image/')) {
    try {
      const options = {
        maxSizeMB: 1, // Max 1MB
        maxWidthOrHeight: 1920, // Max 1080p-ish
        useWebWorker: true,
        fileType: 'image/jpeg', // Convert HEIC/PNG to JPEG for best compatibility
        initialQuality: 0.8
      };
      
      // Only compress if it's larger than 1MB or could be optimized
      if (file.size > 1 * 1024 * 1024 || file.type === 'image/heic') {
        fileToUpload = await imageCompression(file, options);
      }
    } catch (e) {
      console.warn('Image compression failed or skipped, using original file', e);
    }
  }

  // 2. Robust filename generation (avoid collisions and special char issues)
  const getExtension = (f: File) => {
    const nameParts = f.name.split('.');
    if (nameParts.length > 1) return nameParts.pop()?.toLowerCase();
    return f.type.split('/')[1] || 'jpg';
  };

  const fileExt = getExtension(file);
  const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
  const filePath = `${path}/${cleanFileName}`;

  // 3. Robust upload with explicit content type
  const { error } = await supabase.storage
    .from('media')
    .upload(filePath, fileToUpload, {
      contentType: fileToUpload.type || (file.type.startsWith('image/') ? 'image/jpeg' : 'video/mp4'),
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Supabase storage error:', error);
    throw new Error(error.message || 'Upload failed');
  }

  // 4. Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('media')
    .getPublicUrl(filePath);

  return publicUrl;
};