'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ArrowRight, Tag } from 'lucide-react';
import type { TagType, BlogPostType } from "./types"

type PostCardFeaturedProps = {
  data: BlogPostType;
  featured?: boolean;
}

export function PostCardFeatured({ data, featured = false }: PostCardFeaturedProps) {
  const { title, slug, excerpt, published_at, featured_image, author, tags, content_blocks, reading_time, nid } = data;


  const publishDate = formatDistanceToNow(new Date(published_at), {
    addSuffix: true,
  });

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
