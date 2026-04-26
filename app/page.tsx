import { ReactNode } from 'react';
import { BlogHeader } from '@/components/blog/blog-header';
import { BlogFooter } from '@/components/blog/blog-footer';
import { BlogIndexClient } from '@/components/blog/blog-index';
import { db } from '@/lib/db';
import BlogPost from '@/models/blog-post';



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
    <div className="flex min-h-screen relative w-full flex-col bg-white dark:bg-slate-950">
      <div
        className="fixed inset-0 z-0 bg-[radial-gradient(125%_125%_at_50%_90%,#fff_40%,#c9e8e9_100%)] dark:bg-transparent dark:relative dark:hidden"
      />

      <BlogHeader />
      <main className="flex-1 z-10">
        <BlogIndexClient posts={data} caseStudySlug="studi-kasus" />
      </main>
      <BlogFooter className="z-10" />
    </div>
  );
}
