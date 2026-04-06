// Reference: AGENTS.md § 3.4 — Tag listing page with MongoDB fetch

import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import BlogPost from '@/models/blog-post';
import Tag from '@/models/tag';
import { PostIndexRow } from '@/components/blog/post-index-row';
import type { BlogPostType } from '@/components/blog/types';

type TagPageProps = {
  params: Promise<{ tag: string }>;
};

export async function generateMetadata({ params }: TagPageProps) {
  const { tag: slug } = await params;
  return {
    title: `#${slug} — Katalis`,
    description: `Artikel berlabel #${slug} dari Katalis.`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag: slug } = await params;
  await db.connect();

  const tagDoc = await Tag.findOne({ slug, deleted_at: null }).lean();

  if (!tagDoc) {
    notFound();
  }

  const posts = await BlogPost.find({
    tags: { $in: [tagDoc._id] },
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
  const tag = JSON.parse(JSON.stringify(tagDoc));

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
      {/* Tag header */}
      <div className="border-b border-[#E2EDF2] pb-8 pt-10 dark:border-slate-800">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#155E88]/60">
          Tag
        </p>
        <h1
          className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl"
          style={{ letterSpacing: '-0.02em' }}
        >
          #{tag.name}
        </h1>
        {tag.description && (
          <p className="mt-3 max-w-xl text-base text-slate-500 dark:text-slate-400">
            {tag.description}
          </p>
        )}
        <p className="mt-2 text-xs text-slate-400">
          {data.length} {data.length === 1 ? 'tulisan' : 'tulisan'}
        </p>
      </div>

      {/* Column headers */}
      <div className="mb-1 hidden items-center gap-4 border-b-2 border-[#155E88]/10 pb-2 pt-6 sm:flex sm:gap-5">
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
            Belum ada tulisan dengan tag ini.
          </p>
        </div>
      )}
    </div>
  );
}
