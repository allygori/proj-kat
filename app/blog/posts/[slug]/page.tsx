import { cache } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { db } from '@/lib/db';
import BlogPost from '@/models/blog-post';
import { extractTableOfContents } from '@/lib/blog-utils';
import { PostContent } from '@/components/blog/post-content';
import { TableOfContents } from '@/components/blog/table-of-contents';
import { ShareButtons } from '@/components/blog/share-buttons';
// import { RelatedPosts } from '@/components/blog/related-posts';
import type { BlogPostType } from "@/components/blog/types"
import { formatDate } from '@/lib/format';


type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};


// 1. Memoize the database fetch to avoid duplicate calls
const getPostBySlug = cache(async (slug: string) => {
  // connect to db
  await db.connect();

  console.log(`getPostBySlug, slug: ${slug}`)

  return await await BlogPost
    .findOne({ slug })
    .populate("author", "name")
    .populate("featured_image")
    .populate("category", "name slug parent")
    .populate("tags", "name slug")
    .lean();
});

// const getPostBySlug = async (slug: string) => {
//   const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
//   const res = await fetch(`${baseUrl}/api/posts?slug=${slug}`, { next: { revalidate: 60 } });
//   if (!res.ok) return null;
//   const data = await res.json();
//   return data.posts?.[0] || null;
// };

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post not found',
    };
  }

  const title = post.metadata?.title || post.title;
  const description = post.metadata?.description || post.excerpt;
  const image = post.metadata?.image || post.featured_image;

  return {
    title: `${title} | Katalis Dental`,
    description: description,
    openGraph: {
      title: `${title} | Katalis Dental`,
      description: description,
      images: [image],
      type: 'article',
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const dbPost: BlogPostType = await getPostBySlug(slug);

  if (!dbPost) {
    return notFound();
  }

  const post = {
    title: dbPost.title,
    slug: dbPost.slug,
    body: dbPost.content || '',
    excerpt: dbPost.excerpt || '',
    featuredImage: dbPost.featured_image || { url: '' },
    author: dbPost.author?.name || 'Unknown',
    publishedAt: dbPost.published_at || dbPost.created_at,
    readingTime: dbPost.reading_time || 5,
    category: dbPost.categories?.[0]?.name || 'Uncategorized',
    tags: dbPost.tags?.map((t: { name: string }) => t.name) || [],
  };

  const tocItems = extractTableOfContents(post.body);
  const relatedPosts: unknown[] = []; // related posts can be added easily later via API fetch

  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
      <article className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
            {post.category}
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {post.title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            By {post.author} · {formatDate(post.publishedAt)} · {post.readingTime} min read
          </p>

          <figure className="relative aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800">
            <Image
              src={post.featuredImage?.url}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </figure>

          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            {post.excerpt}
          </p>

          <ShareButtons title={post.title} url={`${process.env.NEXT_PUBLIC_SITE_URL || ''}/blog/posts/${post.slug}`} />
        </header>

        <aside className="space-y-6">
          <TableOfContents items={tocItems} />
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Quick Notes</p>
            <ul className="mt-3 space-y-1 text-sm text-slate-600 dark:text-slate-400">
              <li>✔ Designed for clinical clarity</li>
              <li>✔ Step-by-step treatment snippets</li>
              <li>✔ Research-backed recommendations</li>
            </ul>
          </div>
        </aside>

        <section className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <PostContent content={post.body} className="text-slate-700 dark:text-slate-200" />
          </div>

          <div className="mt-10">
            {/* <RelatedPosts posts={[]} /> */}
          </div>
        </section>
      </article>
    </section>
  );
}