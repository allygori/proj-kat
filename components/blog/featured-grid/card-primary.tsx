'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ArrowRight, Tag } from 'lucide-react';
import type { TagType, BlogPostType } from "../types"
import { SpecialtyBadge } from '../specialty-badge';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';

type PostCardHeroPrimaryProps = {
  data: BlogPostType;
  className?: string;
}

export function PostCardHeroPrimary({ data, className = "" }: PostCardHeroPrimaryProps) {
  const { title, slug, excerpt, published_at, featured_image, category, author, tags, content_blocks, reading_time, nid } = data;


  const publishDate = formatDistanceToNow(new Date(published_at), {
    addSuffix: true,
  });

  return (
    <div className={cn(className, "group")}>
      {featured_image?.url ? (
        <Link
          href={`/posts/${slug}`}
        >
          <div className="relative h-56 sm:h-64 lg:h-[400px] rounded-2xl overflow-hidden bg-white shadow-xs transition-all">
            <Image
              src={featured_image.url}
              alt={featured_image.alt_text ?? title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
          </div>
        </Link>
      ) : (
        <div className="h-56 bg-linear-to-br from-[#E8F4F8] to-[#a9dbdc]/30 sm:h-64 lg:h-[400px]" />
      )}
      <div className="grid md:grid-cols-2 md:gap-4 py-4">
        <Link
          href={`/posts/${slug}`}
          className="block"
        >
          <h2 className="text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#155E88] dark:text-white dark:group-hover:text-[#a9dbdc] sm:text-2xl hover:underline group-hover:underline">
            {title}
          </h2>
        </Link>
        {/* category, date & reading time */}
        <div>
          <div>
            {
              category?.name && (
                <>
                  <span className="text-sm font-medium text-slate-500">
                    {category?.name}
                  </span>
                  <span className="text-xs text-slate-400">{` · `}</span>
                </>
              )
            }
            <span className="text-xs text-slate-400">
              {formatDate(published_at)}
            </span>
            {
              reading_time && (
                <span className="text-xs text-slate-400">
                  {reading_time ? ` · ${reading_time} menit` : ''}
                </span>
              )
            }
          </div>
          {
            excerpt && (
              <Link
                href={`/posts/${slug}`}
              >
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-400">
                  {excerpt}
                </p>
              </Link>
            )
          }
        </div>
      </div>
    </div>
  );

}
