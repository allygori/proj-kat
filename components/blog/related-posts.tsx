'use client';

import { PostCard } from './post-card';

/**
 * Related Posts Component
 * Displays 3-4 related posts from the same category or matching tags.
 * 
 * See AGENTS.md § 3.4 for blog post features.
 */

export type RelatedPost = {
  slug: string;
  title: string;
  excerpt: string;
  featuredImage?: string;
  author: string;
  publishedAt: Date;
  readingTime: number;
  category: string;
  tags?: string[];
};

type RelatedPostsProps = {
  posts: RelatedPost[];
  title?: string;
};

export function RelatedPosts({
  posts,
  title = 'Related Articles',
}: RelatedPostsProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {title}
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Continue exploring related topics and insights.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {posts.slice(0, 4).map((post) => (
          <PostCard
            key={post.slug}
            slug={post.slug}
            title={post.title}
            excerpt={post.excerpt}
            featuredImage={post.featuredImage}
            author={post.author}
            publishedAt={post.publishedAt}
            readingTime={post.readingTime}
            category={post.category}
            tags={post.tags}
          />
        ))}
      </div>
    </section>
  );
}
