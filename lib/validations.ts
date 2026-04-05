import { isValidObjectId } from "mongoose";
import { z } from "zod";

export const ZodUserSchema = z.object({
  // better-auth fields
  email: z.email(),
  name: z.string(),
  image: z.string().optional(),
  emailVerified: z.boolean(),
  // Custom fields
  role: z.enum(['admin', 'editor', 'author']).default("author"),
  username: z.string().optional(),
  deleted_at: z.date().optional(), // soft delete
  createdAt: z.date().optional(), // Use `created_at` to store the created date
  updatedAt: z.date().optional() // and `updated_at` to store the last updated date
})


export const ZodTipTapContentBlockSchema = z.object({
  type: z.string().min(1, "Content block type is required"), // e.g., 'paragraph', 'heading', 'image'
  attrs: z.object(), // e.g., { src: '...' }
  content: z.object(), // Nested inline content
  marks: z.object(), // e.g., bold, italic
});

export const ZodPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  nid: z.string().min(5, "Nano ID is required"),
  excerpt: z.string().max(255, "Excerpt is too long, max: 255 characters").optional(),
  content: z.string().optional(), // HTML content
  content_blocks: z.array(ZodTipTapContentBlockSchema), // TipTap Json data
  featured_image: z.union([
    z.string().refine((val) => isValidObjectId(val), { message: "Invalid ObjectId" }),
    z.undefined(),
  ]),
  category: z.union([
    z.string().refine((val) => isValidObjectId(val), { message: "Invalid ObjectId" }),
    z.undefined(),
  ]),
  tags: z.array(
    z.union([
      z.string().refine((val) => isValidObjectId(val), { message: "Invalid ObjectId" }),
      z.undefined(),
    ])
  ).max(3, "Maximum 3 tags allowed").optional(),
  published_status: z.enum(["draft", "published", "scheduled"]).default("draft"),
  published_at: z.string().datetime(), // ISO string from frontend
  scheduled_publish_date: z.string().datetime().optional(),
  metadata: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.union([
      z.string().refine((val) => isValidObjectId(val), { message: "Invalid ObjectId" }),
      z.undefined(),
    ])
  }),
  author: z.union([
    z.string().refine((val) => isValidObjectId(val), { message: "Invalid ObjectId" }),
    z.undefined(),
  ]),
  reading_time: z.number().optional(),
  related_posts: z.array(z.string()).optional(),
});

export const ZodCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  parent: z.string().optional(),
  level: z.number().min(1).max(3).optional(),
});

export const ZodTagSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
});

export const ZodMediaSchema = z.object({
  filename: z.string(),
  mime_type: z.string(),
  size: z.number(), // in bytes
  url: z.string(), // Vercel Blob URL
  alt_text: z.string(),
  caption: z.string(),
  credits: z.string(),
});

// export const ZodUserSchema = z.object({
//   email: z.string(),
//   name: z.string(),
//   image: z.number(),
//   role: z.string(),
// });


