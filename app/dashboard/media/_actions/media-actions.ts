'use server';

// Reference: AGENTS.md § 3.5 & 6 — Media Server Actions
import { put, del } from '@vercel/blob';
import { db } from '@/lib/db';
import Media from '@/models/media';
import { auth } from '@/lib/auth/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

/**
 * Get current session helper
 */
async function getSession() {
  return await auth.api.getSession({
    headers: await headers()
  });
}

/**
 * Upload Media Action
 * Handles Vercel Blob upload and Mongoose metadata storage.
 */
export async function uploadMediaAction(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const file = formData.get('file') as File;
  if (!file) throw new Error('No file provided');

  // 1. Upload to Vercel Blob
  const blob = await put(file.name, file, {
    access: 'public',
    addRandomSuffix: true
  });

  // 2. Save to Database
  await db.connect();
  const mediaAsset = await Media.create({
    filename: file.name,
    original_name: file.name,
    mime_type: file.type,
    size: file.size,
    url: blob.url,
    uploaded_by: session.user.id,
  });

  revalidatePath('/dashboard/media');
  return JSON.parse(JSON.stringify(mediaAsset));
}

/**
 * Get Media Assets Action
 */
export async function getMediaAssetsAction(query: { skip?: number; limit?: number; folder?: string } = {}) {
  await db.connect();

  const { skip = 0, limit = 50, folder } = query;

  const filter: any = { deleted_at: null };
  if (folder) filter.folder = folder;

  const assets = await Media.find(filter)
    .sort({ created_at: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return JSON.parse(JSON.stringify(assets));
}

/**
 * Update Media Metadata Action
 */
export async function updateMediaMetadataAction(id: string, data: { alt_text?: string; caption?: string; credits?: string }) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  await db.connect();
  const asset = await Media.findByIdAndUpdate(id, data, { new: true });

  revalidatePath('/dashboard/media');
  return JSON.parse(JSON.stringify(asset));
}

/**
 * Delete Media Action (Soft Delete)
 */
export async function deleteMediaAction(id: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  await db.connect();
  await Media.findByIdAndUpdate(id, { deleted_at: new Date() });

  revalidatePath('/dashboard/media');
  return { success: true };
}

/**
 * Purge Media Action (Permanent Delete)
 * Deletes from Vercel Blob and MongoDB.
 */
export async function purgeMediaAction(id: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  await db.connect();
  const asset = await Media.findById(id);
  if (!asset) throw new Error('Asset not found');

  // Hard delete from Vercel Blob
  try {
    if (asset.url) {
      await del(asset.url);
    }
  } catch (err) {
    console.error('Failed to delete from Vercel Blob:', err);
    // Continue deleting from DB anyway? Or throw?
  }

  // Hard delete from MongoDB
  await Media.findByIdAndDelete(id);

  revalidatePath('/dashboard/media');
  return { success: true };
}
