// import * as dotenv from 'dotenv';
// dotenv.config({ path: '.env.local' });
import 'dotenv';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import mongoose from 'mongoose';
import dbConnect from '../lib/db';
import BlogPost from '../models/blog-post';
import Category from '../models/category';
import Tag from '../models/tag';
import User from '../models/user';
import Media from '../models/media';

import { authors } from '../constant/seed/authors';
import { categories } from '../constant/seed/categories';
import { tags } from '../constant/seed/tags';
import { seedMedia } from '../constant/seed/media';
import { mockPosts } from '../constant/seed/posts';

async function seed() {
  if (process?.env?.NODE_ENV !== "development") {
    throw new Error("NODE_ENV should be 'development' to run seed");
  }

  console.log('Connecting to database...');
  await dbConnect();

  console.log('Clearing existing data...');
  await BlogPost.deleteMany({});
  await Category.deleteMany({});
  await Tag.deleteMany({});
  await User.deleteMany({});
  await Media.deleteMany({});

  const authorMap = new Map();
  const categoryMap = new Map();
  const tagMap = new Map();
  const mediaMap = new Map();

  console.log('Inserting authors...');
  for (const author of authors) {
    const doc = await User.create({
      name: author.name,
      email: author.email,
      role: 'author',
    });
    authorMap.set(author.id, doc._id);
  }

  console.log('Inserting categories...');
  for (const cat of categories) {
    const doc = await Category.create({
      name: cat.name,
      slug: cat.slug,
      level: 1,
    });
    categoryMap.set(cat.id, doc._id);
  }

  console.log('Inserting tags...');
  for (const tag of tags) {
    const doc = await Tag.create({
      name: tag.name,
      slug: tag.slug,
    });
    tagMap.set(tag.id, doc._id);
  }

  console.log('Inserting media...');
  const mediaDoc = await Media.create({
    url: seedMedia.url,
    filename: seedMedia.filename,
    original_name: seedMedia.original_name,
    mime_type: seedMedia.mime_type,
    size: seedMedia.size,
    uploaded_by: authorMap.get(authors[0].id),
  });
  mediaMap.set(seedMedia.id, mediaDoc._id);

  console.log('Inserting blog posts...');
  for (const post of mockPosts) {
    await BlogPost.create({
      title: post.title,
      slug: post.slug,
      nid: post.nid,
      excerpt: post.excerpt,
      content: "",
      content_html: post.content,
      content_blocks: post.content_blocks,
      featured_image: mediaMap.get(post.featured_image) || post.featured_image,
      category: categoryMap.get(post.category) || post.category,
      tags: Array.isArray(post.tags) ? post.tags.map((tId: any) => tagMap.get(tId) || tId) : post.tags,
      published_status: post.published_status,
      published_at: post.published_at,
      metadata: post.metadata ? { ...post.metadata, image: mediaMap.get(post.metadata.image) ?? post.metadata.image } : post.metadata,
      author: authorMap.get(post.author) || post.author,
      reading_time: post.reading_time,
      related_posts: Array.isArray(post.related_posts) ? post.related_posts.map((rp: any) => rp) : post.related_posts,
    });
  }

  console.log('Seeding completed successfully!');
  mongoose.connection.close();
}

seed().catch((err) => {
  console.error('Error seeding database:', err);
  mongoose.connection.close();
  process.exit(1);
});
