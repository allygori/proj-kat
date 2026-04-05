import { ZodPostSchema, ZodCategorySchema, ZodTagSchema, ZodTipTapContentBlockSchema, ZodMediaSchema, ZodUserSchema } from '@/lib/validations';
import { infer as zodInfer } from 'zod';

export type CategoryType = zodInfer<typeof ZodCategorySchema>
export type TagType = zodInfer<typeof ZodTagSchema>
export type MediaType = zodInfer<typeof ZodMediaSchema>
export type UserType = zodInfer<typeof ZodUserSchema>


export type BlogPostType = zodInfer<typeof ZodPostSchema> & {
  _id: string; // Add MongoDB ID
  tags: TagType[];
  categories: CategoryType[];
  featured_image: zodInfer<typeof ZodMediaSchema>;
  author: zodInfer<typeof ZodUserSchema>;
  created_at: string;
  updated_at?: string;
}
