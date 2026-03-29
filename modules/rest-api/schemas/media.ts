/**
 * Media Zod Schemas
 */

import { z } from "zod";

export const updateMediaSchema = z.object({
  alt: z.string().max(200).optional(),
  caption: z.string().max(500).optional(),
});

export type UpdateMediaInput = z.infer<typeof updateMediaSchema>;
