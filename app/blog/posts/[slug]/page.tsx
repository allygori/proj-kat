// Reference: AGENTS.md § 3.4 — Post detail page, redesigned layout

import { cache } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';
import { db } from '@/lib/db';
import BlogPost from '@/models/blog-post';
import { extractTableOfContents } from '@/lib/blog-utils';
import { PostContent } from '@/components/blog/post-content';
import { TableOfContents } from '@/components/blog/table-of-contents';
import { ShareButtons } from '@/components/blog/share-buttons';
import { SpecialtyBadge } from '@/components/blog/specialty-badge';
import { PostMeta } from '@/components/blog/post-meta';
import type { BlogPostType, TagType } from '@/components/blog/types';
import { formatDate } from '@/lib/format';

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

const getPostBySlug = cache(async (slug: string) => {
  await db.connect();
  return BlogPost.findOne({ slug, deleted_at: null })
    .populate('author', 'name')
    .populate('featured_image')
    .populate('category', 'name slug parent')
    .populate('tags', 'name slug')
    .lean();
});

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return { title: 'Artikel tidak ditemukan' };

  const title = post.metadata?.title || post.title;
  const description = post.metadata?.description || post.excerpt;
  const image = (post.metadata?.image as unknown as { url?: string })?.url
    || (post.featured_image as unknown as { url?: string })?.url;

  return {
    title: `${title} — Katalis`,
    description,
    openGraph: {
      title: `${title} — Katalis`,
      description,
      images: image ? [image] : [],
      type: 'article',
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const dbPost = await getPostBySlug(slug) as BlogPostType | null;

  if (!dbPost) notFound();

  const categoryName =
    typeof dbPost.category === 'object' && dbPost.category !== null
      ? (dbPost.category as { name?: string }).name ?? ''
      : '';
  const categorySlug =
    typeof dbPost.category === 'object' && dbPost.category !== null
      ? (dbPost.category as { slug?: string }).slug ?? ''
      : '';

  const authorName =
    typeof dbPost.author === 'object' && dbPost.author !== null
      ? (dbPost.author as { name?: string }).name ?? ''
      : '';

  const featuredImageUrl =
    typeof dbPost.featured_image === 'object' && dbPost.featured_image !== null
      ? (dbPost.featured_image as { url?: string }).url ?? ''
      : '';
  const featuredImageAlt =
    typeof dbPost.featured_image === 'object' && dbPost.featured_image !== null
      ? (dbPost.featured_image as { alt_text?: string }).alt_text ?? dbPost.title
      : dbPost.title;

  const tags = (dbPost.tags ?? []) as TagType[];
  const body = dbPost.content ?? '';
  const tocItems = extractTableOfContents(body);
  const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/blog/posts/${dbPost.slug}`;

  return (
    <article className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
      {/* Back link */}
      <div className="pt-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-[#155E88] dark:text-slate-400 dark:hover:text-[#a9dbdc]"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Semua Tulisan
        </Link>
      </div>

      {/* Post header */}
      <header className="pt-6 pb-8 border-b border-[#E2EDF2] dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {categoryName && (
            <SpecialtyBadge specialty={categorySlug || categoryName} size="md" />
          )}
          {tags.slice(0, 3).map((tag) => (
            <Link
              key={tag.slug}
              href={`/blog/tag/${tag.slug}`}
              className="inline-flex items-center rounded-full border border-[#E2EDF2] bg-white px-2.5 py-0.5 text-[11px] font-medium text-slate-500 transition-colors hover:border-[#a9dbdc] hover:text-[#155E88] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-[#a9dbdc]/40 dark:hover:text-[#a9dbdc]"
            >
              #{tag.name}
            </Link>
          ))}
        </div>

        <h1
          className="text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl"
          style={{ letterSpacing: '-0.02em' }}
        >
          {dbPost.title}
        </h1>

        {dbPost.excerpt && (
          <p className="mt-4 text-lg leading-relaxed text-slate-500 dark:text-slate-400">
            {dbPost.excerpt}
          </p>
        )}

        <PostMeta
          authorName={authorName}
          publishedAt={dbPost.published_at}
          readingTime={dbPost.reading_time}
          className="mt-5"
        />
      </header>

      {/* Featured image */}
      {featuredImageUrl && (
        <figure className="my-8 overflow-hidden rounded-2xl border border-[#E2EDF2] dark:border-slate-800">
          <Image
            src={featuredImageUrl}
            alt={featuredImageAlt}
            width={1200}
            height={630}
            className="w-full object-cover"
            priority
          />
        </figure>
      )}

      {/* Share buttons — top */}
      <div className="mb-8">
        <ShareButtons title={dbPost.title} url={postUrl} />
      </div>

      {/* Content + sidebar grid */}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
        {/* Main content */}
        <div>
          <div className="rounded-2xl border border-[#E2EDF2] bg-white px-6 py-8 dark:border-slate-800 dark:bg-slate-900 sm:px-8">
            <PostContent content={body} className="text-slate-700 dark:text-slate-200" />
          </div>

          {/* Author card */}
          {authorName && (
            <div className="mt-8 flex items-start gap-4 rounded-2xl border border-[#E2EDF2] bg-[#F8FAFA] p-5 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#155E88] text-sm font-bold text-white">
                {authorName[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Ditulis oleh
                </p>
                <p className="mt-0.5 font-semibold text-slate-900 dark:text-white">
                  {authorName}
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Dokter Gigi
                </p>
              </div>
            </div>
          )}

          {/* Related posts placeholder */}
          <div className="mt-10">
            {/* Related posts — to be implemented later */}
          </div>
        </div>

        {/* Sticky sidebar */}
        <aside className="space-y-6">
          {/* Table of contents */}
          {tocItems.length > 0 && (
            <div className="rounded-2xl border border-[#E2EDF2] bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Daftar Isi
              </p>
              <TableOfContents items={tocItems} />
            </div>
          )}

          {/* Tags sidebar */}
          {tags.length > 0 && (
            <div className="rounded-2xl border border-[#E2EDF2] bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Tag
              </p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link
                    key={tag.slug}
                    href={`/blog/tag/${tag.slug}`}
                    className="rounded-full border border-[#E2EDF2] bg-[#F8FAFA] px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-[#a9dbdc] hover:text-[#155E88] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-[#a9dbdc]"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Article info */}
          <div className="rounded-2xl border border-[#E2EDF2] bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Info Artikel
            </p>
            <dl className="space-y-2 text-sm">
              {dbPost.published_at && (
                <div>
                  <dt className="text-xs text-slate-400">Diterbitkan</dt>
                  <dd className="font-medium text-slate-700 dark:text-slate-300">
                    {formatDate(dbPost.published_at)}
                  </dd>
                </div>
              )}
              {dbPost.reading_time && (
                <div>
                  <dt className="text-xs text-slate-400">Estimasi baca</dt>
                  <dd className="font-medium text-slate-700 dark:text-slate-300">
                    {dbPost.reading_time} menit
                  </dd>
                </div>
              )}
              {categoryName && (
                <div>
                  <dt className="text-xs text-slate-400">Kategori</dt>
                  <dd className="font-medium">
                    <SpecialtyBadge specialty={categorySlug || categoryName} />
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </aside>
      </div>

      {/* Bottom share buttons */}
      <div className="mt-10 border-t border-[#E2EDF2] pt-8 dark:border-slate-800">
        <ShareButtons title={dbPost.title} url={postUrl} />
      </div>
    </article>
  );
}