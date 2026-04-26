'use client';

// Reference: AGENTS.md § 3.1 — Blog index main layout
// Split into featured hero + Case Studies highlight + index table with specialty filter

import { useMemo, useState } from 'react';
import { PostIndexRow } from './post-index-row';
import { CaseStudiesSection } from './case-studies-section';
import type { BlogPostType } from './types';
import FeaturedGrid from './featured-grid/featured-grid';

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
  const secondaryPosts = sortedPosts.slice(1, 4);

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

  // const featuredCategoryName =
  //   typeof featuredPost.category === 'object' && featuredPost.category !== null
  //     ? (featuredPost.category as { name?: string }).name ?? ''
  //     : '';
  // const featuredCategorySlug =
  //   typeof featuredPost.category === 'object' && featuredPost.category !== null
  //     ? (featuredPost.category as { slug?: string }).slug ?? ''
  //     : '';

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
      {/* ── Hero section ── */}
      <section className="pt-10 pb-12" aria-labelledby="hero-heading">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#155E88]/60 dark:text-slate-300">
          Jurnal & Catatan Klinis
        </p>
        {/* <h1
          id="hero-heading"
          className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl"
          style={{ letterSpacing: '-0.02em' }}
        >
          Dari meja seorang dokter gigi.
        </h1> */}
        <p className="mt-3 max-w-2xl text-base text-slate-500 dark:text-slate-400">
          Tulisan tentang pengalaman klinis, opini, ulasan alat dan bahan, serta studi kasus nyata
          dari praktik sehari-hari. Bukan textbook — ini cerita dari lapangan.
        </p>
      </section>

      {/* ── Featured grid: 1 large + 2 small ── */}
      <FeaturedGrid primary={featuredPost} secondaries={secondaryPosts} />

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
          {/* <span className="rounded-full bg-[#E8F4F8] px-2 py-0.5 text-xs font-semibold text-[#155E88] dark:bg-slate-800 dark:text-[#a9dbdc]">
            {sortedPosts.length}
          </span> */}
        </div>

        {/* Specialty filter pills */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter kategori">
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
            Kategori
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
