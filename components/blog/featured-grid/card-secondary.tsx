'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ArrowRight, Tag } from 'lucide-react';
import type { TagType, BlogPostType } from "../types"
import { SpecialtyBadge } from '../specialty-badge';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';

type PostCardHeroSecondaryProps = {
  post: BlogPostType;
  className?: string;
}

export function PostCardHeroSecondary({ post, className = "" }: PostCardHeroSecondaryProps) {
  const { title, slug, excerpt, published_at, featured_image, category, author, tags, content_blocks, reading_time, nid } = post;


  const publishDate = formatDistanceToNow(new Date(published_at), {
    addSuffix: true,
  });

  return (
    <div className={cn(className, "group")}>
      <div>
        {
          category?.name && (
            <>
              <span className="text-xs font-medium text-slate-500">
                {category?.name}
              </span>
              <span className="text-xs text-slate-400">{` · `}</span>
            </>
          )
        }
        <span className="text-xs text-slate-400">
          {formatDate(published_at)}
        </span>
      </div>

      <Link
        href={`/posts/${slug}`}
      >
        <h2 className="text-base mb-2 font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#155E88] dark:text-white dark:group-hover:text-[#a9dbdc] hover:underline group-hover:underline">
          {title}
        </h2>
      </Link>

      <div className="grid grid-cols-8 gap-3">
        {
          featured_image?.url ? (
            <Link
              href={`/posts/${slug}`}
              className="block col-span-2"
            >
              <div className="relative aspect-square rounded-md overflow-hidden bg-white shadow-xs transition-all">
                <Image
                  src={featured_image.url}
                  alt={featured_image.alt_text ?? title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
                {/* <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" /> */}
              </div>
            </Link>
          ) : (
            <div className="aspect-square rounded-md bg-linear-to-br from-[#E8F4F8] to-[#a9dbdc]/30" />
          )
        }
        {
          excerpt && (
            <Link
              href={`/posts/${slug}`}
              className="block col-span-6"
            >
              <p className="text-sm text-slate-700 dark:text-slate-400">
                {excerpt}
              </p>
            </Link>
          )
        }
      </div>
    </div>
  );

}
