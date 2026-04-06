// Reference: AGENTS.md § 3.4 — Post index row with square thumbnail
// Used in blog index table and category/tag listing pages

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/format';
import { SpecialtyBadge } from './specialty-badge';
import type { BlogPostType, TagType } from './types';

type PostIndexRowProps = {
  post: BlogPostType;
};

export function PostIndexRow({ post }: PostIndexRowProps) {
  const { title, slug, excerpt, published_at, featured_image, category, tags, reading_time } = post;

  const categorySlug =
    typeof category === 'object' && category !== null
      ? (category as { slug?: string; name?: string }).slug ?? ''
      : '';

  const categoryName =
    typeof category === 'object' && category !== null
      ? (category as { name?: string }).name ?? ''
      : '';

  const dateStr = published_at ? formatDate(published_at) : null;

  return (
    <Link
      href={`/blog/posts/${slug}`}
      className="group flex items-center gap-4 border-b border-[#E2EDF2] py-4 transition-colors hover:border-[#a9dbdc]/60 dark:border-slate-800 dark:hover:border-slate-700 sm:gap-5"
      aria-label={`Baca artikel: ${title}`}
    >
      {/* Date — hidden on very small screens */}
      <span className="hidden w-20 shrink-0 text-xs tabular-nums text-slate-400 dark:text-slate-500 sm:block">
        {dateStr ?? '—'}
      </span>

      {/* Square thumbnail 1:1 */}
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#E8F4F8] dark:bg-slate-800 sm:h-14 sm:w-14">
        {featured_image?.url ? (
          <Image
            src={featured_image.url}
            alt={featured_image.alt_text ?? title}
            width={56}
            height={56}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          /* Placeholder with initial letter */
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-lg font-bold text-[#155E88]/30 dark:text-[#a9dbdc]/30">
              {title?.[0]?.toUpperCase() ?? 'K'}
            </span>
          </div>
        )}
      </div>

      {/* Specialty badge */}
      <div className="hidden w-32 shrink-0 md:block">
        {categoryName ? (
          <SpecialtyBadge specialty={categorySlug || categoryName} />
        ) : null}
      </div>

      {/* Title + excerpt */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900 transition-colors group-hover:text-[#155E88] dark:text-slate-100 dark:group-hover:text-[#a9dbdc] sm:text-base">
          {title}
        </p>
        {excerpt && (
          <p className="mt-0.5 hidden truncate text-xs text-slate-500 dark:text-slate-400 sm:block">
            {excerpt}
          </p>
        )}
        {/* Tags — visible on mobile where badge column is hidden */}
        {categoryName && (
          <div className="mt-1 md:hidden">
            <SpecialtyBadge specialty={categorySlug || categoryName} size="sm" />
          </div>
        )}
      </div>

      {/* Reading time + arrow */}
      <div className="flex shrink-0 items-center gap-3">
        {reading_time && (
          <span className="hidden text-xs text-slate-400 dark:text-slate-500 lg:block">
            {reading_time} mnt
          </span>
        )}
        <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#155E88] dark:text-slate-600 dark:group-hover:text-[#a9dbdc]" />
      </div>
    </Link>
  );
}
