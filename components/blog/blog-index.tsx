'use client';

import { useMemo, useState } from 'react';
import { PostCard } from './post-card';
import { SearchFilter } from './search-filter';
import { BlogPost } from '@/lib/mock-posts';

type BlogIndexClientProps = {
  posts: BlogPost[];
  categories: string[];
};

export function BlogIndexClient({ posts, categories }: BlogIndexClientProps) {
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(posts);

  const featuredPost = posts[0];

  const latestPosts = useMemo(() => {
    return filteredPosts
      .slice()
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }, [filteredPosts]);

  const handleFiltered = (filtered: Array<{ slug: string; title: string; category: string; tags: string[] }>) => {
    // const fullFilteredPosts = filtered.map(filteredPost =>
    //   posts.find(post => post.slug === filteredPost.slug)
    // ).filter(Boolean) as BlogPost[];
    // setFilteredPosts(fullFilteredPosts);
    return [];
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-5xl space-y-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
          Dental Knowledge Hub
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          Evidence-based dentistry writing for clinicians and patients
        </h1>
        <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
          Explore clinical case studies, product reviews, and practical patient care guidance crafted for professional dental audiences.
        </p>
      </section>

      <div className="mt-12 grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <SearchFilter
            posts={posts.map((post) => ({
              slug: post.slug,
              title: post.title,
              category: post.category,
              tags: post.tags,
            }))}
            categories={categories}
            onFiltered={handleFiltered}
          />
        </aside>

        <main className="space-y-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <article className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
                Featured
              </p>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {featuredPost.title}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {featuredPost.publishedAt.toLocaleDateString()} · {featuredPost.readingTime} min read · {featuredPost.category}
              </p>
              <p className="text-slate-600 dark:text-slate-300">{featuredPost.excerpt}</p>
              <a
                href={`/blog/posts/${featuredPost.slug}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Read the full article
              </a>
            </article>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {latestPosts.map((post) => (
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
                featured={false}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
