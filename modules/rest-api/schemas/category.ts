/**
 * Category Zod Schemas
 */

import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Nama kategori wajib diisi").max(100),
  description: z.string().max(500).optional(),
  parent: z.string().optional(), // ObjectId as string
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
