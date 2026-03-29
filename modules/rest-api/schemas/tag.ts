/**
 * Tag Zod Schemas
 */

import { z } from "zod";

export const createTagSchema = z.object({
  name: z.string().min(1, "Nama tag wajib diisi").max(50),
});

export const updateTagSchema = createTagSchema.partial();

export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
