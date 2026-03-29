/**
 * Post Zod Schemas
 */

import { z } from "zod";

const seoSchema = z.object({
  meta_title: z.string().max(60).optional(),
  meta_description: z.string().max(160).optional(),
  og_image: z.string().url().optional(),
});

export const createPostSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi").max(200),
  excerpt: z.string().max(500).optional(),
  body: z.record(z.string(), z.unknown()).optional(),
  featured_image: z.string().optional(), // ObjectId as string
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  seo: seoSchema.optional(),
});

export const updatePostSchema = createPostSchema.partial();

export const publishPostSchema = z.object({
  status: z.enum(["published", "draft", "archived"]),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type PublishPostInput = z.infer<typeof publishPostSchema>;
