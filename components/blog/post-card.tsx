'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ArrowRight, Tag } from 'lucide-react';
// import { ZodPostSchema } from '@/lib/validations';
// import { infer as zodInfer } from 'zod';
import type { CategoryType, TagType, BlogPostType } from "./types"

// type BlogPost = zodInfer<typeof ZodPostSchema>;

/**
 * PostCard Component
 * Refined minimalist card for blog post previews.
 * Displays title, excerpt, featured image, metadata, and tags.
 * Supports multiple layouts and variations.
 * 
 * See AGENTS.md § 3.4 for blog post field specifications.
 */

// type PostCardProps = {
//   slug: string;
//   title: string;
//   excerpt: string;
//   featuredImage?: string;
//   author: string;
//   publishedAt: Date;
//   readingTime: number;
//   category: string;
//   tags?: string[];
//   featured?: boolean;
// };

// type PostCardProps = BlogPost & {
//   featured: boolean;
//   featuredImage?: {
//     url: string
//   };
//   publishedAt: string;
//   readingTime?: number;
// }

type PostCardProps = {
  data: BlogPostType;
  featured?: boolean;
}

export function PostCard({ data, featured = false }: PostCardProps) {
  const { title, slug, excerpt, published_at, featured_image, author, tags, content_blocks, reading_time, nid } = data;


  const publishDate = formatDistanceToNow(new Date(published_at), {
    addSuffix: true,
  });

  if (featured) {
    // Featured post: larger layout with side-by-side image
    return (
      <Link href={`/blog/${slug}`}>
        <article className="group grid grid-cols-1 gap-8 rounded-xl border border-slate-200 p-8 transition-all hover:border-slate-300 hover:shadow-lg dark:border-slate-800 dark:hover:border-slate-700 dark:hover:shadow-slate-900/20 md:grid-cols-2">
          {/* Content */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                  {/* {
                    (categories as CategoryType[]).map((c: CategoryType, idx: number) => (
                      <span key={idx}>{c.name}</span>
                    ))
                  } */}
                </span>
              </div>
              <h2 className="text-3xl font-bold leading-tight text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                {title}
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                {excerpt}
              </p>
            </div>

            {/* Metadata and CTA */}
            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-500">
                <span>{reading_time} min read</span>
                <span>•</span>
                <span>{publishDate}</span>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1 dark:text-slate-600" />
            </div>
          </div>

          {/* Featured image */}
          {featured_image?.url && (
            <div className="relative h-64 overflow-hidden rounded-lg md:h-full">
              <Image
                src={featured_image?.url}
                alt={title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
          )}
        </article>
      </Link>
    );
  }

  // Standard card layout
  return (
    <Link href={`/blog/${slug}`}>
      <article className="group flex flex-col rounded-lg border border-slate-200 overflow-hidden transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:hover:border-slate-700 dark:hover:shadow-slate-900/20">
        {/* Featured image */}
        {featured_image?.url && (
          <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
            <Image
              src={featured_image?.url}
              alt={title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col justify-between p-6">
          {/* Category badge */}
          <div className="mb-3 flex items-center gap-2">
            {/* <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
              {categories}
            </span> */}
          </div>

          {/* Title and excerpt */}
          <div className="flex-1">
            <h3 className="text-xl font-bold leading-tight text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
              {title}
            </h3>
            <p className="mt-3 line-clamp-2 text-slate-600 dark:text-slate-400">
              {excerpt}
            </p>
          </div>

          {/* Tags */}
          {(tags || []).length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {(tags as TagType[] || []).slice(0, 2).map((tag) => (
                <div
                  key={tag.slug}
                  className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  <Tag className="h-3 w-3" />
                  <span>{tag.name}</span>
                </div>
              ))}
            </div>
          )}

          {/* Metadata footer */}
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-700">
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-500">
              <span className="font-medium">{author?.name}</span>
              <span>•</span>
              <time dateTime={new Date(published_at).toISOString()}>
                {publishDate}
              </time>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-500">
              {reading_time} min
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
