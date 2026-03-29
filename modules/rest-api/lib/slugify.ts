/**
 * Slug Auto-Generation (Backend)
 *
 * Converts a title/name to a URL-safe slug and ensures uniqueness
 * by appending a numeric suffix when needed.
 */

import { type Model, type Document } from "mongoose";

/**
 * Convert text to a URL-safe slug.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")       // spaces → hyphens
    .replace(/[^\w\-]+/g, "")   // remove non-word chars (except hyphens)
    .replace(/\-\-+/g, "-")     // collapse multiple hyphens
    .replace(/^-+/, "")         // trim leading hyphens
    .replace(/-+$/, "");        // trim trailing hyphens
}

/**
 * Generate a unique slug for a Mongoose model.
 *
 * If `slug` already exists, appends -1, -2, etc.
 * Pass `excludeId` to ignore the current document (for updates).
 */
export async function uniqueSlug<T extends Document>(
  model: Model<T>,
  text: string,
  excludeId?: string
): Promise<string> {
  let base = slugify(text);
  if (!base) base = "untitled";

  let slug = base;
  let counter = 0;

  while (true) {
    const filter: Record<string, unknown> = { slug };
    if (excludeId) {
      filter._id = { $ne: excludeId };
    }

    const existing = await model.findOne(filter).lean();
    if (!existing) break;

    counter++;
    slug = `${base}-${counter}`;
  }

  return slug;
}
