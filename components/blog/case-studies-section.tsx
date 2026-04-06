// Reference: AGENTS.md § 3.1 — Case studies highlight section for blog index page

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/format';
import { SpecialtyBadge } from './specialty-badge';
import type { BlogPostType } from './types';

type CaseStudiesSectionProps = {
  posts: BlogPostType[];
};

export function CaseStudiesSection({ posts }: CaseStudiesSectionProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section
      className="rounded-2xl py-8 px-6 sm:px-8"
      style={{ background: 'linear-gradient(135deg, #E8F4F8 0%, #f0fafa 100%)' }}
      aria-labelledby="case-studies-heading"
    >
      {/* Section header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#155E88]/60">
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
          className="group flex shrink-0 items-center gap-1.5 rounded-lg border border-[#155E88]/20 bg-white px-3 py-1.5 text-xs font-semibold text-[#155E88] shadow-sm transition-all hover:border-[#155E88] hover:shadow-md"
        >
          Lihat Semua
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 3).map((post) => {
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
              href={`/blog/posts/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-[#a9dbdc]/30 bg-white p-4 shadow-sm transition-all hover:border-[#155E88]/30 hover:shadow-md"
            >
              {/* Thumbnail */}
              {post.featured_image?.url && (
                <div className="mb-3 h-36 overflow-hidden rounded-lg bg-[#E8F4F8]">
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
                  className="mb-2 self-start"
                />
              )}

              {/* Title */}
              <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 transition-colors group-hover:text-[#155E88]">
                {post.title}
              </h3>

              {/* Meta */}
              <p className="mt-auto pt-3 text-xs text-slate-400">
                {post.published_at ? formatDate(post.published_at) : ''}
                {post.reading_time ? ` · ${post.reading_time} mnt baca` : ''}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
