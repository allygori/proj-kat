import type { BlogPostType } from './types';
import FeaturedGrid from './featured-grid/featured-grid';
import { CaseStudiesSection } from './sections/case-studies';
import PostRows from './sections/post-rows';

type BlogIndexProps = {
  featuredPosts: BlogPostType[];
  caseStudiesPosts: BlogPostType[];
  postRowsPosts: BlogPostType[];
  activeTag: string;
};

export function BlogIndexClient({ featuredPosts, caseStudiesPosts, postRowsPosts, activeTag }: BlogIndexProps) {
  const featuredPost = featuredPosts[0];
  const secondaryPosts = featuredPosts.slice(1, 4);

  if (!featuredPost && postRowsPosts.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="text-slate-400">Belum ada tulisan yang diterbitkan.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
      {/* ── Hero section ── */}
      <section className="pt-10 pb-12" aria-labelledby="hero-heading">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#155E88]/60 dark:text-slate-300">
          Jurnal & Catatan Klinis
        </p>
        <p className="mt-3 max-w-2xl text-base text-slate-500 dark:text-slate-400">
          Tulisan tentang pengalaman klinis, opini, ulasan alat dan bahan, serta studi kasus nyata
          dari praktik sehari-hari. Bukan textbook — hanya cerita dari lapangan.
        </p>
      </section>

      {/* ── Featured grid: 1 large + 2 small ── */}
      {featuredPost && (
        <FeaturedGrid primary={featuredPost} secondaries={secondaryPosts} />
      )}

      {/* ── Case Studies highlight section ── */}
      {caseStudiesPosts.length > 0 && (
        <section className="mb-12">
          <CaseStudiesSection initialPosts={caseStudiesPosts} />
        </section>
      )}

      {/* ── All posts index table ── */}
      <PostRows initialPosts={postRowsPosts} activeTag={activeTag} />

    </div>
  );
}

