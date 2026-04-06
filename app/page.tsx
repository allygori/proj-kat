// Reference: AGENTS.md § 3.1 — Homepage = Blog index
// Wraps its own BlogHeader + BlogFooter (outside app/blog/layout.tsx)

import { db } from '@/lib/db';
import BlogPost from '@/models/blog-post';
import { BlogIndexClient } from '@/components/blog/blog-index';
import { BlogHeader } from '@/components/blog/blog-header';
import { BlogFooter } from '@/components/blog/blog-footer';

export const metadata = {
  title: 'Katalis — Jurnal & Catatan Klinis Dokter Gigi',
  description:
    'Tulisan tentang pengalaman klinis, opini, ulasan alat dan bahan, serta studi kasus nyata dari praktik sehari-hari seorang dokter gigi.',
};

export default async function HomePage() {
  await db.connect();

  const posts = await BlogPost.find({ published_status: 'published', deleted_at: null })
    .sort({ published_at: -1 })
    .limit(30)
    .populate('author', 'name')
    .populate('featured_image')
    .populate('category', 'name slug parent')
    .populate('tags', 'name slug')
    .lean();

  const data = JSON.parse(JSON.stringify(posts ?? []));

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-slate-950">
      <BlogHeader />
      <main className="flex-1">
        <BlogIndexClient posts={data} caseStudySlug="studi-kasus" />
      </main>
      <BlogFooter />
    </div>
  );
}