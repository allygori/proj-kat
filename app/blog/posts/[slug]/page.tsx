import { notFound } from 'next/navigation';
import Image from 'next/image';
import { mockPosts } from '@/lib/mock-posts';
import { findRelatedPosts, extractTableOfContents, formatDate } from '@/lib/blog-utils';
import { PostContent } from '@/components/blog/post-content';
import { TableOfContents } from '@/components/blog/table-of-contents';
import { ShareButtons } from '@/components/blog/share-buttons';
import { RelatedPosts } from '@/components/blog/related-posts';

type PostPageProps = {
  params: {
    slug: string;
  };
};

const getPostBySlug = (slug: string) => mockPosts.find((p) => p.slug === slug);

export async function generateMetadata({ params }: PostPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post not found',
    };
  }

  return {
    title: `${post.title} | Katalis Dental`,
    description: post.metaDescription,
    openGraph: {
      title: `${post.title} | Katalis Dental`,
      description: post.metaDescription,
      images: [post.ogImage],
      type: 'article',
    },
  };
}

export default function PostPage({ params }: PostPageProps) {
  const post = mockPosts.find((p) => p.slug === params.slug);

  if (!post) {
    return notFound();
  }

  const tocItems = extractTableOfContents(post.body);
  const relatedPosts = findRelatedPosts(post, mockPosts, 3);

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
              src={post.featuredImage}
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
            <RelatedPosts posts={relatedPosts} />
          </div>
        </section>
      </article>
    </section>
  );
}