import { BlogHeader } from '@/components/blog/blog-header';
import { BlogFooter } from '@/components/blog/blog-footer';
import { BlogIndexClient } from '@/components/blog/blog-index';
import type { BlogPostType } from '@/components/blog/types';
import { fetchAPI } from '@/lib/fetch';

type SearchParams = Promise<{ tag?: string }>;

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const { tag } = await searchParams;

  // Parallelize API calls for better performance
  const [featuredData, caseStudiesPosts] = await Promise.all([
    fetchAPI<BlogPostType[]>('/api/posts', {
      params: { limit: tag ? 4 : 9, published_status: 'published' },
      revalidate: 3600,
    }),
    fetchAPI<BlogPostType[]>('/api/posts', {
      params: { limit: 5, published_status: 'published', categorySlugs: 'studi-kasus' },
      revalidate: 3600,
    }),
  ]);

  let featuredPosts = [];
  let postRowsPosts = [];

  if (tag) {
    // If tag is present, featuredData only contains 4 posts
    featuredPosts = featuredData || [];
    // Fetch posts for the specific tag
    postRowsPosts = (await fetchAPI<BlogPostType[]>('/api/posts', {
      params: { limit: 5, published_status: 'published', tagSlugs: tag },
      revalidate: 3600,
    })) || [];
  } else {
    // If no tag, featuredData contains 9 posts (4 featured + 5 rows)
    const allPosts = featuredData || [];
    featuredPosts = allPosts.slice(0, 4);
    postRowsPosts = allPosts.slice(4, 9);
  }

  return (
    <div className="flex min-h-screen relative w-full flex-col bg-white dark:bg-slate-950">
      <div
        className="fixed inset-0 z-0 bg-[radial-gradient(125%_125%_at_50%_90%,#fff_40%,#c9e8e9_100%)] dark:bg-transparent dark:relative dark:hidden"
      />

      <BlogHeader />
      <main className="flex-1 z-10">
        <BlogIndexClient
          featuredPosts={featuredPosts}
          caseStudiesPosts={caseStudiesPosts}
          postRowsPosts={postRowsPosts}
          activeTag={tag || ''}
        />
      </main>
      <BlogFooter className="z-10" />
    </div>
  );
}
