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

  console.log('Inserting authors...');
  for (const author of authors) {
    await User.create({
      _id: author.id,
      name: author.name,
      email: author.email,
      role: 'author',
    });
  }

  console.log('Inserting categories...');
  for (const cat of categories) {
    await Category.create({
      _id: cat.id,
      name: cat.name,
      slug: cat.slug,
      level: 1,
    });
  }

  console.log('Inserting tags...');
  for (const tag of tags) {
    await Tag.create({
      _id: tag.id,
      name: tag.name,
      slug: tag.slug,
    });
  }

  console.log('Inserting media...');
  await Media.create({
    _id: seedMedia.id,
    url: seedMedia.url,
    filename: seedMedia.filename,
    original_name: seedMedia.original_name,
    mime_type: seedMedia.mime_type,
    size: seedMedia.size,
    uploaded_by: authors[0].id,
  });

  console.log('Inserting blog posts...');
  for (const post of mockPosts) {
    await BlogPost.create({
      title: post.title,
      slug: post.slug,
      nid: post.nid,
      excerpt: post.excerpt,
      content: post.content,
      content_blocks: post.content_blocks,
      featured_image: post.featured_image,
      category: post.category,
      tags: post.tags,
      published_status: post.published_status,
      published_at: post.published_at,
      metadata: post.metadata,
      author: post.author,
      reading_time: post.reading_time,
      related_posts: post.related_posts,
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
