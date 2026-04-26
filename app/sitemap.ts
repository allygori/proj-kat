import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import BlogPost from '@/models/blog-post';
import Category from '@/models/category';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || process.env.BETTER_AUTH_URL || 'https://www.katalisdental.com';

  await db.connect();

  // Fetch all published posts
  const posts = await BlogPost.find({
    published_status: 'published',
    deleted_at: null,
  })
    .select('slug updated_at')
    .lean();

  const postUrls: MetadataRoute.Sitemap = posts.map((post: any) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updated_at || new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Fetch all categories
  const categories = await Category.find({
    deleted_at: null,
  })
    .select('slug updated_at')
    .lean();

  const categoryUrls: MetadataRoute.Sitemap = categories.map((category: any) => ({
    url: `${baseUrl}/blog/category/${category.slug}`,
    lastModified: category.updated_at || new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  // Static routes
  const routes: MetadataRoute.Sitemap = ['', '/blog'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.9,
  }));

  return [...routes, ...categoryUrls, ...postUrls];
}
