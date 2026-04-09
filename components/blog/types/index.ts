import { ZodPostSchema, ZodCategorySchema, ZodTagSchema, ZodTipTapContentBlockSchema, ZodMediaSchema, ZodUserSchema } from '@/lib/validations';
import { infer as zodInfer } from 'zod';

export type CategoryType = zodInfer<typeof ZodCategorySchema> & {
  _id: string;
  created_at: string;
  updated_at?: string;
  parent?: CategoryType; // Populate support
}

export type TagType = zodInfer<typeof ZodTagSchema> & {
  _id: string;
  created_at: string;
  updated_at?: string;
}

export type MediaType = zodInfer<typeof ZodMediaSchema> & {
  _id: string;
  created_at: string;
}

export type UserType = zodInfer<typeof ZodUserSchema> & {
  _id: string;
}

export type BlogPostType = zodInfer<typeof ZodPostSchema> & {
  _id: string; 
  tags: TagType[];
  category: CategoryType; // Matches schema union/object populate
  featured_image: MediaType;
  author: UserType;
  created_at: string;
  updated_at?: string;
}
