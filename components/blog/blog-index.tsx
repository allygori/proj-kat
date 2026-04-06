'use client';

// Reference: AGENTS.md § 3.1 — Blog index main layout
// Split into featured hero + Case Studies highlight + index table with specialty filter

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/format';
import { PostIndexRow } from './post-index-row';
import { CaseStudiesSection } from './case-studies-section';
import { SpecialtyBadge } from './specialty-badge';
import type { BlogPostType } from './types';

type BlogIndexClientProps = {
  posts: BlogPostType[];
  caseStudySlug?: string; // slug of "Studi Kasus" category in DB
};

const SPECIALTY_FILTERS = [
  { label: 'Semua', value: '' },
  { label: 'Ortodonti', value: 'ortodonti' },
  { label: 'Bedah Mulut', value: 'bedah-mulut' },
  { label: 'Konservasi', value: 'konservasi' },
  { label: 'Prostodonsia', value: 'prostodonsia' },
  { label: 'Periodonsia', value: 'periodonsia' },
  { label: 'Pedodontik', value: 'pedodontik' },
  { label: 'Radiologi', value: 'radiologi' },
  { label: 'Umum', value: 'umum' },
];

export function BlogIndexClient({ posts, caseStudySlug = 'studi-kasus' }: BlogIndexClientProps) {
  const [activeFilter, setActiveFilter] = useState('');

  const sortedPosts = useMemo(
    () =>
      [...posts].sort(
        (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      ),
    [posts]
  );

  // Separate case studies
  const caseStudyPosts = useMemo(
    () =>
      sortedPosts.filter((p) => {
        const cat = p.category as { slug?: string } | null;
        return cat?.slug === caseStudySlug;
      }),
    [sortedPosts, caseStudySlug]
  );

  // Featured = first post overall
  const featuredPost = sortedPosts[0];
  const secondaryPosts = sortedPosts.slice(1, 3);

  // Filtered index
  const indexPosts = useMemo(() => {
    if (!activeFilter) return sortedPosts;
    return sortedPosts.filter((p) => {
      const cat = p.category as { slug?: string; name?: string } | null;
      const slug = cat?.slug?.toLowerCase() ?? '';
      const name = cat?.name?.toLowerCase() ?? '';
      return slug.includes(activeFilter) || name.includes(activeFilter);
    });
  }, [sortedPosts, activeFilter]);

  if (!featuredPost) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="text-slate-400">Belum ada tulisan yang diterbitkan.</p>
      </div>
    );
  }

  const featuredCategoryName =
    typeof featuredPost.category === 'object' && featuredPost.category !== null
      ? (featuredPost.category as { name?: string }).name ?? ''
      : '';
  const featuredCategorySlug =
    typeof featuredPost.category === 'object' && featuredPost.category !== null
      ? (featuredPost.category as { slug?: string }).slug ?? ''
      : '';

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
      {/* ── Hero section ── */}
      <section className="pt-10 pb-12" aria-labelledby="hero-heading">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#155E88]/60">
          Jurnal & Catatan Klinis
        </p>
        <h1
          id="hero-heading"
          className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl"
          style={{ letterSpacing: '-0.02em' }}
        >
          Dari meja seorang dokter gigi.
        </h1>
        <p className="mt-3 max-w-2xl text-base text-slate-500 dark:text-slate-400">
          Tulisan tentang pengalaman klinis, opini, ulasan alat dan bahan, serta studi kasus nyata
          dari praktik sehari-hari. Bukan textbook — ini cerita dari lapangan.
        </p>
      </section>

      {/* ── Featured grid: 1 large + 2 small ── */}
      <section className="mb-12 grid gap-4 lg:grid-cols-3" aria-label="Artikel unggulan">
        {/* Featured large card */}
        <Link
          href={`/blog/posts/${featuredPost.slug}`}
          className="group relative overflow-hidden rounded-2xl border border-[#E2EDF2] bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900 lg:col-span-2"
        >
          {featuredPost.featured_image?.url ? (
            <div className="relative h-56 overflow-hidden sm:h-64 lg:h-72">
              <Image
                src={featuredPost.featured_image.url}
                alt={featuredPost.featured_image.alt_text ?? featuredPost.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
            </div>
          ) : (
            <div className="h-56 bg-linear-to-br from-[#E8F4F8] to-[#a9dbdc]/30 sm:h-64 lg:h-72" />
          )}
          <div className="p-5 sm:p-6">
            {featuredCategoryName && (
              <SpecialtyBadge
                specialty={featuredCategorySlug || featuredCategoryName}
                className="mb-3"
              />
            )}
            <h2 className="text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#155E88] dark:text-white dark:group-hover:text-[#a9dbdc] sm:text-2xl">
              {featuredPost.title}
            </h2>
            {featuredPost.excerpt && (
              <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                {featuredPost.excerpt}
              </p>
            )}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {formatDate(featuredPost.published_at)}
                {featuredPost.reading_time ? ` · ${featuredPost.reading_time} mnt` : ''}
              </span>
              <ArrowRight className="h-4 w-4 text-[#155E88] transition-transform group-hover:translate-x-1 dark:text-[#a9dbdc]" />
            </div>
          </div>
        </Link>

        {/* Secondary cards */}
        <div className="flex flex-col gap-4">
          {secondaryPosts.map((post) => {
            const catName =
              typeof post.category === 'object' && post.category !== null
                ? (post.category as { name?: string }).name ?? ''
                : '';
            const catSlug =
              typeof post.category === 'object' && post.category !== null
                ? (post.category as { slug?: string }).slug ?? ''
                : '';

            return (
              <Link
                key={post.slug}
                href={`/blog/posts/${post.slug}`}
                className="group flex flex-1 flex-col overflow-hidden rounded-2xl border border-[#E2EDF2] bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                {post.featured_image?.url && (
                  <div className="relative h-32 overflow-hidden">
                    <Image
                      src={post.featured_image.url}
                      alt={post.featured_image.alt_text ?? post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-4">
                  {catName && (
                    <SpecialtyBadge
                      specialty={catSlug || catName}
                      size="sm"
                      className="mb-2 self-start"
                    />
                  )}
                  <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 transition-colors group-hover:text-[#155E88] dark:text-slate-100 dark:group-hover:text-[#a9dbdc]">
                    {post.title}
                  </h3>
                  <p className="mt-auto pt-2 text-xs text-slate-400">
                    {formatDate(post.published_at)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Case Studies highlight section ── */}
      {caseStudyPosts.length > 0 && (
        <section className="mb-12">
          <CaseStudiesSection posts={caseStudyPosts} />
        </section>
      )}

      {/* ── All posts index table ── */}
      <section aria-labelledby="all-posts-heading">
        <div className="mb-4 flex items-center gap-3">
          <h2
            id="all-posts-heading"
            className="text-lg font-bold tracking-tight text-slate-900 dark:text-white"
          >
            Semua Tulisan
          </h2>
          <span className="rounded-full bg-[#E8F4F8] px-2 py-0.5 text-xs font-semibold text-[#155E88] dark:bg-slate-800 dark:text-[#a9dbdc]">
            {sortedPosts.length}
          </span>
        </div>

        {/* Specialty filter pills */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter spesialisasi">
          {SPECIALTY_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={[
                'shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all',
                activeFilter === f.value
                  ? 'bg-[#155E88] text-white shadow-sm'
                  : 'bg-[#E8F4F8] text-[#155E88] hover:bg-[#a9dbdc]/30 dark:bg-slate-800 dark:text-[#a9dbdc] dark:hover:bg-slate-700',
              ].join(' ')}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Column headers — desktop only */}
        <div className="mb-1 hidden items-center gap-4 border-b-2 border-[#155E88]/10 pb-2 sm:flex sm:gap-5">
          <span className="w-20 shrink-0 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Tanggal
          </span>
          <span className="h-12 w-12 shrink-0 sm:h-14 sm:w-14" />
          <span className="hidden w-32 shrink-0 text-xs font-semibold uppercase tracking-wider text-slate-400 md:block">
            Spesialisasi
          </span>
          <span className="flex-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Judul
          </span>
        </div>

        {indexPosts.length > 0 ? (
          <div>
            {indexPosts.map((post) => (
              <PostIndexRow key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="py-10 text-center text-sm text-slate-400">
            Tidak ada tulisan dengan filter ini.
          </p>
        )}
      </section>
    </div>
  );
}
