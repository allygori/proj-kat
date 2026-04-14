// Reference: AGENTS.md § 3.4 — Category listing page with MongoDB fetch
// Pattern: same as blog/page.tsx — direct Mongoose query

import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import BlogPost from '@/models/blog-post';
import Category from '@/models/category';
import { PostIndexRow } from '@/components/blog/post-index-row';
import { CategoryHero } from '@/components/blog/category-hero';
import type { BlogPostType } from '@/components/blog/types';

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const name = decodeURIComponent(slug)
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');

  return {
    title: `${name} — Katalis`,
    description: `Kumpulan artikel tentang ${name} dari dokter gigi praktisi.`,
    openGraph: {
      title: `${name} — Katalis`,
      description: `Kumpulan artikel tentang ${name} dari dokter gigi praktisi.`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  await db.connect();

  // Find the category document by slug
  const categoryDoc = await Category.findOne({ slug, deleted_at: null }).lean();

  if (!categoryDoc) {
    notFound();
  }

  const posts = await BlogPost.find({
    category: categoryDoc._id,
    published_status: 'published',
    deleted_at: null,
  })
    .sort({ published_at: -1 })
    .limit(50)
    .populate('author', 'name')
    .populate('featured_image')
    .populate('category', 'name slug parent')
    .populate('tags', 'name slug')
    .lean();

  const data: BlogPostType[] = JSON.parse(JSON.stringify(posts ?? []));
  const category = JSON.parse(JSON.stringify(categoryDoc));

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
      {/* Category hero block */}
      <CategoryHero category={category} postCount={data.length} />

      {/* Column headers */}
      <div className="mb-1 hidden items-center gap-4 border-b-2 border-[#155E88]/10 pb-2 sm:flex sm:gap-5">
        <span className="w-20 shrink-0 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Tanggal
        </span>
        <span className="h-14 w-14 shrink-0" />
        <span className="hidden w-32 shrink-0 text-xs font-semibold uppercase tracking-wider text-slate-400 md:block">
          Spesialisasi
        </span>
        <span className="flex-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Judul
        </span>
      </div>

      {/* Post list */}
      {data.length > 0 ? (
        <div>
          {data.map((post) => (
            <PostIndexRow key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-sm text-slate-400">
            Belum ada tulisan dalam kategori ini.
          </p>
        </div>
      )}
    </div>
  );
}
