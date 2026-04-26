import { BlogHeader } from '@/components/blog/blog-header';
import { BlogFooter } from '@/components/blog/blog-footer';
import { BlogIndexClient } from '@/components/blog/blog-index';
import { db } from '@/lib/db';
import BlogPost from '@/models/blog-post';
import Category from '@/models/category';
import Tag from '@/models/tag';
import type { BlogPostType } from '@/components/blog/types';

type SearchParams = Promise<{ tag?: string }>;

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  await db.connect();
  const { tag } = await searchParams;
  const now = new Date();

  // 1. Fetch Featured Posts (Top 4 overall)
  const featuredDocs = await BlogPost.find({
    published_status: 'published',
    published_at: { $lte: now },
    deleted_at: null,
  })
    .sort({ created_at: -1 })
    .limit(4)
    // .populate('author', 'name')
    .populate('featured_image')
    .populate('category', 'name slug parent')
    // .populate('tags', 'name slug')
    .lean();

  const featuredPosts = JSON.parse(JSON.stringify(featuredDocs ?? []));

  // 2. Fetch PostRows Data
  let postRowsDocs: BlogPostType[] = [];
  if (tag) {
    const tagDoc = await Tag.findOne({ slug: tag, deleted_at: null }).lean();
    if (tagDoc) {
      postRowsDocs = await BlogPost.find({
        tags: tagDoc._id,
        published_status: 'published',
        published_at: { $lte: now },
        deleted_at: null,
      })
        .sort({ created_at: -1 })
        .limit(5)
        // .populate('author', 'name')
        .populate('featured_image')
        .populate('category', 'name slug parent')
        .populate('tags', 'name slug')
        .lean();
    }
  } else {
    // If no tag selected, get posts 5 to 9
    postRowsDocs = await BlogPost.find({
      published_status: 'published',
      published_at: { $lte: now },
      deleted_at: null,
    })
      .sort({ created_at: -1 })
      .skip(4)
      .limit(5)
      // .populate('author', 'name')
      .populate('featured_image')
      .populate('category', 'name slug parent')
      .populate('tags', 'name slug')
      .lean();
  }

  const postRowsPosts = JSON.parse(JSON.stringify(postRowsDocs ?? []));

  // 3. Fetch Case Studies
  let caseStudiesPosts = [];
  const caseStudyCategory = await Category.findOne({ slug: 'studi-kasus', deleted_at: null }).lean();
  if (caseStudyCategory) {
    const csDocs = await BlogPost.find({
      category: caseStudyCategory._id,
      published_status: 'published',
      published_at: { $lte: now },
      deleted_at: null,
    })
      .sort({ created_at: -1 })
      .limit(5)
      .populate('featured_image')
      .populate('category', 'name slug')
      .lean();
    caseStudiesPosts = JSON.parse(JSON.stringify(csDocs ?? []));
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
