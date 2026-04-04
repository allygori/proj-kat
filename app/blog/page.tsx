
import { BlogIndexClient } from '@/components/blog/blog-index';
import { ZodPostSchema } from '@/lib/validations';
import { infer as zodInfer } from 'zod';
import { db } from '@/lib/db';
import BlogPost from '@/models/blog-post';

type Post = zodInfer<typeof ZodPostSchema>;

type MinimumBlogPost = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  featuredImage: string;
  author: string;
  publishedAt: string;
  readingTime: number;
  category: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
};

export const metadata = {
  title: 'Katalis Dental Blog — Evidence-Based Dentistry',
  description:
    'Clinical insights, case studies, and product reviews for modern dental professionals.',
};

export default async function BlogPage() {

  // connect to db
  await db.connect();

  const posts = await BlogPost
    .find({})
    .limit(10)
    .populate("author", "name")
    .populate("featured_image")
    .populate("category", "name slug parent")
    .populate("tags", "name slug")
    .lean();


  if (!posts || posts?.length === 0) {
    return (
      <div>Empty</div>
    )
  }

  // console.log("posts", posts);

  const data = JSON.parse(JSON.stringify(posts));
  // const data = (posts || []).map((item) => item.toObject());


  // return (
  //   <pre>{JSON.stringify(posts, null, 2)}</pre>
  // )


  //   const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  //   const [postsRes, categoriesRes] = await Promise.all([
  //     fetch(`${baseUrl}/api/posts?status=published`, { next: { revalidate: 60 } }),
  //     fetch(`${baseUrl}/api/categories`, { next: { revalidate: 60 } }),
  //   ]);

  //   const { posts: dbPosts } = postsRes.ok ? await postsRes.json() : { posts: [] };
  //   const { categories: dbCategories } = categoriesRes.ok ? await categoriesRes.json() : { categories: [] };

  //   const mappedPosts: MinimumBlogPost[] = dbPosts.map((post: any) => ({
  //     title: post.title,
  //     slug: post.slug,
  //     body: post.content || '',
  //     excerpt: post.excerpt || '',
  //     featuredImage: post.featured_image || '',
  //     author: post.author?.name || 'Unknown',
  //     publishedAt: post.published_at || post.createdAt,
  //     readingTime: post.reading_time || 5,
  //     category: post.categories?.[0]?.name || 'Uncategorized',
  //     tags: post.tags?.map((t: { name: string }) => t.name) || [],
  //     metaTitle: post.metadata?.title || post.title,
  //     metaDescription: post.metadata?.description || post.excerpt || '',
  //     ogImage: post.metadata?.image || post.featured_image || '',
  //   }));

  //   const categoryNames = dbCategories.map((c: { name: string }) => c.name);



  return <BlogIndexClient posts={data} categories={[]} />;
}

