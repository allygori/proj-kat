import { notFound } from 'next/navigation';
import { PostCard } from '@/components/blog/post-card';
import { SearchFilter } from '@/components/blog/search-filter';
import { categories, mockPosts } from '@/lib/mock-posts';

type TagPageProps = {
  params: { tag: string };
};

export function generateMetadata({ params }: TagPageProps) {
  const tag = decodeURIComponent(params.tag);
  return {
    title: `#${tag} Articles | Katalis Dental`,
    description: `Explore articles tagged with ${tag}.`,
  };
}

export default function TagPage({ params }: TagPageProps) {
  const tagName = decodeURIComponent(params.tag);

  const filtered = mockPosts.filter((post) => post.tags.includes(tagName));

  if (filtered.length === 0) {
    return notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
      <section className="space-y-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
          Tag
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          #{tagName}
        </h1>
        <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
          Explore tagged articles for related concepts and treatments.
        </p>
      </section>

      <div className="mt-12 grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <SearchFilter
            posts={mockPosts.map((post) => ({
              slug: post.slug,
              title: post.title,
              category: post.category,
              tags: post.tags,
            }))}
            categories={categories}
            onFiltered={() => {
              // no-op in tag context
            }}
          />
        </aside>

        <main className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            {filtered.map((post) => (
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

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing {filtered.length} article(s) with #{tagName}.
          </p>
        </main>
      </div>
    </div>
  );
}
