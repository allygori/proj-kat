import { notFound } from 'next/navigation';
import { PostCard } from '@/components/blog/post-card';
import { SearchFilter } from '@/components/blog/search-filter';
// import { mockPosts, categories } from '@/constant/seed/categories';

type CategoryPageProps = {
  params: { category: string };
};

export function generateMetadata({ params }: CategoryPageProps) {
  // const categoryName = decodeURIComponent(params.category);
  // return {
  //   title: `${categoryName} Articles | Katalis Dental`,
  //   description: `Explore articles and real-world case studies in ${categoryName}.`,
  // };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  // const categoryName = decodeURIComponent(params.category);

  // if (!categories.includes(categoryName)) {
  //   return notFound();
  // }

  // const filtered = mockPosts.filter((post) => post.category === categoryName);

  // return (
  //   <div className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
  //     <section className="space-y-6 text-center">
  //       <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
  //         Category
  //       </p>
  //       <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
  //         {categoryName}
  //       </h1>
  //       <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
  //         Explore deeply-researched articles in {categoryName}. Updated frequently with actionable clinical insights.
  //       </p>
  //     </section>

  //     <div className="mt-12 grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
  //       <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
  //         <SearchFilter
  //           posts={mockPosts.map((post) => ({
  //             slug: post.slug,
  //             title: post.title,
  //             category: post.category,
  //             tags: post.tags,
  //           }))}
  //           categories={categories}
  //           onFiltered={() => {
  //             // no-op for now in this category page
  //           }}
  //         />
  //       </aside>

  //       <main className="space-y-8">
  //         <div className="grid gap-6 md:grid-cols-2">
  //           {filtered.map((post) => (
  //             <PostCard
  //               key={post.slug}
  //               slug={post.slug}
  //               title={post.title}
  //               excerpt={post.excerpt}
  //               featuredImage={post.featuredImage}
  //               author={post.author}
  //               publishedAt={post.publishedAt}
  //               readingTime={post.readingTime}
  //               category={post.category}
  //               tags={post.tags}
  //             />
  //           ))}
  //         </div>

  //         <p className="text-sm text-slate-500 dark:text-slate-400">
  //           Showing {filtered.length} article(s) in {categoryName}.
  //         </p>
  //       </main>
  //     </div>
  //   </div>
  // );

  return (
    <div>Empty</div>
  )
}
