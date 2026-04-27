import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/format';
import { SpecialtyBadge } from '../specialty-badge';
import type { BlogPostType } from '../types';
import { cn } from '@/lib/utils';

type CaseStudiesSectionProps = {
  initialPosts?: BlogPostType[];
  className?: string;
}

export function CaseStudiesSection({ initialPosts = [], className = "" }: CaseStudiesSectionProps) {
  if (!initialPosts || initialPosts.length === 0) return null;

  return (
    <section
      className={cn("rounded-none md:rounded-2xl py-8 border border-primary/10 bg-[linear-gradient(135deg,#E8F4F8_0%,#f0fafa_100%)] dark:bg-none dark:bg-slate-900", className)}
      aria-labelledby="case-studies-heading"
    >
      <div className="px-6 sm:px-8">
        {/* Section header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#155E88]/60 dark:text-primary/90">
              Pilihan Editor
            </p>
            <h2
              id="case-studies-heading"
              className="mt-1 text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl"
            >
              Studi Kasus Terbaru
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Dokumentasi kasus klinis nyata dari praktik sehari-hari.
            </p>
          </div>
          <Link
            href="/blog/category/studi-kasus"
            className="group flex shrink-0 items-center gap-1.5 rounded-lg border border-[#155E88]/20 bg-white px-3 py-1.5 text-xs font-semibold text-[#155E88] transition-all hover:border-[#155E88] hover:shadow-md dark:bg-transparent dark:text-white dark:border-[#155E88]/50"
          >
            Lihat Lainnya
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Cards carousel */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {initialPosts.map((post) => {
            const categorySlug =
              typeof post.category === 'object' && post.category !== null
                ? (post.category as { slug?: string }).slug ?? ''
                : '';
            const categoryName =
              typeof post.category === 'object' && post.category !== null
                ? (post.category as { name?: string }).name ?? ''
                : '';

            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-[#a9dbdc]/30 dark:border-[#a9dbdc]/20 bg-white p-4 transition-all hover:border-primary/75 min-w-64 max-w-64 sm:min-w-72 sm:max-w-72 snap-center shrink-0 dark:bg-transparent"
              >
                {/* Thumbnail */}
                {post.featured_image?.url && (
                  <div className="mb-3 h-36 overflow-hidden rounded-lg bg-[#E8F4F8] shrink-0">
                    <Image
                      src={post.featured_image.url}
                      alt={post.featured_image.alt_text ?? post.title}
                      width={400}
                      height={200}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}

                {/* Category badge */}
                {categoryName && (
                  <SpecialtyBadge
                    specialty={categorySlug || categoryName}
                    className="mb-2 self-start shrink-0"
                  />
                )}

                {/* Title */}
                <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 transition-colors group-hover:text-[#155E88] dark:text-slate-500">
                  {post.title}
                </h3>

                {/* Meta */}
                <p className="mt-auto pt-3 text-xs text-slate-400 shrink-0">
                  {post.published_at ? formatDate(post.published_at) : ''}
                  {post.reading_time ? ` · ${post.reading_time} mnt baca` : ''}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
