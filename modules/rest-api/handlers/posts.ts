/**
 * Post CRUD Handlers
 */

import { type NextRequest } from "next/server";
import { connectDB } from "../db/connection";
import { Post } from "../db/models/post";
import { Category } from "../db/models/category";
import { Tag } from "../db/models/tag";
import { requireAuth, requireRole, optionalAuth } from "../auth/middleware";
import { apiSuccess, apiError } from "../lib/response";
import { parseQueryParams, paginatedQuery } from "../lib/query-builder";
import { uniqueSlug } from "../lib/slugify";
import { validateBody } from "../lib/validator";
import {
  createPostSchema,
  updatePostSchema,
  publishPostSchema,
} from "../schemas/post";

/**
 * GET /posts — List published posts (public)
 */
export async function listPosts(request: NextRequest) {
  await connectDB();

  const query = parseQueryParams(request, {
    allowedFilters: ["category", "tag", "author", "status"],
    searchFields: ["title", "excerpt"],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = {
    deleted_at: null,
    status: "published",
  };

  // Category filter by slug
  if (query.filters.category) {
    const cat = await Category.findOne({
      slug: query.filters.category,
    }).lean();
    if (cat) filter.categories = cat._id;
  }

  // Tag filter by slug
  if (query.filters.tag) {
    const tag = await Tag.findOne({ slug: query.filters.tag }).lean();
    if (tag) filter.tags = tag._id;
  }

  // Author filter
  if (query.filters.author) {
    filter.author = query.filters.author;
  }

  const result = await paginatedQuery(Post, filter, query, {
    searchFields: ["title", "excerpt"],
    populate: ["author", "categories", "tags", "featured_image"],
  });

  return apiSuccess(result.data, result.meta);
}

/**
 * GET /posts/drafts — List draft/all posts (auth required)
 */
export async function listDrafts(request: NextRequest) {
  const authResult = await requireRole(request, ["admin", "author"]);
  if ("error" in authResult) return authResult.error;

  await connectDB();

  const query = parseQueryParams(request, {
    allowedFilters: ["status", "author"],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = { deleted_at: null };

  // Authors can only see their own drafts
  if (authResult.session.user.role === "author") {
    filter.author = authResult.session.user.id;
  }

  if (query.filters.status) {
    filter.status = query.filters.status;
  }

  if (query.filters.author && authResult.session.user.role === "admin") {
    filter.author = query.filters.author;
  }

  const result = await paginatedQuery(Post, filter, query, {
    searchFields: ["title", "excerpt"],
    populate: ["author", "categories", "tags"],
  });

  return apiSuccess(result.data, result.meta);
}

/**
 * GET /posts/:slug — Get post by slug (public)
 */
export async function getPost(request: NextRequest, slug: string) {
  await connectDB();

  const post = await Post.findOne({ slug, deleted_at: null })
    .populate("author", "name email image")
    .populate("categories")
    .populate("tags")
    .populate("featured_image")
    .lean();

  if (!post) {
    return apiError("NOT_FOUND", "Artikel tidak ditemukan", 404);
  }

  // Only allow published posts for unauthenticated users
  if (post.status !== "published") {
    const session = await optionalAuth(request);
    if (
      !session ||
      (session.user.role !== "admin" &&
        session.user.id !== String(post.author?._id))
    ) {
      return apiError("NOT_FOUND", "Artikel tidak ditemukan", 404);
    }
  }

  return apiSuccess(post);
}

/**
 * POST /posts — Create post (admin, author)
 */
export async function createPost(request: NextRequest) {
  const authResult = await requireRole(request, ["admin", "author"]);
  if ("error" in authResult) return authResult.error;

  const validation = await validateBody(request, createPostSchema);
  if (!validation.success) return validation.error;

  await connectDB();

  const { title, ...rest } = validation.data;
  const slug = await uniqueSlug(Post, title);

  const post = await Post.create({
    ...rest,
    title,
    slug,
    author: authResult.session.user.id,
    published_at:
      rest.status === "published" ? new Date() : undefined,
  });

  const populated = await Post.findById(post._id)
    .populate("author", "name email image")
    .populate("categories")
    .populate("tags")
    .lean();

  return apiSuccess(populated, undefined, 201);
}

/**
 * PUT /posts/:id — Update post (admin, author own)
 */
export async function updatePost(
  request: NextRequest,
  id: string
) {
  const authResult = await requireRole(request, ["admin", "author"]);
  if ("error" in authResult) return authResult.error;

  const validation = await validateBody(request, updatePostSchema);
  if (!validation.success) return validation.error;

  await connectDB();

  const post = await Post.findOne({ _id: id, deleted_at: null });
  if (!post) {
    return apiError("NOT_FOUND", "Artikel tidak ditemukan", 404);
  }

  // Authors can only edit their own posts
  if (
    authResult.session.user.role === "author" &&
    String(post.author) !== authResult.session.user.id
  ) {
    return apiError("FORBIDDEN", "Anda hanya bisa mengedit artikel sendiri", 403);
  }

  const updateData = { ...validation.data };

  // Re-generate slug if title changed
  if (updateData.title && updateData.title !== post.title) {
    (updateData as Record<string, unknown>).slug = await uniqueSlug(
      Post,
      updateData.title,
      id
    );
  }

  const updated = await Post.findByIdAndUpdate(id, updateData, {
    new: true,
  })
    .populate("author", "name email image")
    .populate("categories")
    .populate("tags")
    .lean();

  return apiSuccess(updated);
}

/**
 * DELETE /posts/:id — Soft delete post (admin, author own)
 */
export async function deletePost(
  request: NextRequest,
  id: string
) {
  const authResult = await requireRole(request, ["admin", "author"]);
  if ("error" in authResult) return authResult.error;

  await connectDB();

  const post = await Post.findOne({ _id: id, deleted_at: null });
  if (!post) {
    return apiError("NOT_FOUND", "Artikel tidak ditemukan", 404);
  }

  if (
    authResult.session.user.role === "author" &&
    String(post.author) !== authResult.session.user.id
  ) {
    return apiError("FORBIDDEN", "Anda hanya bisa menghapus artikel sendiri", 403);
  }

  await Post.findByIdAndUpdate(id, { deleted_at: new Date() });

  return apiSuccess({ message: "Artikel berhasil dihapus" });
}

/**
 * PATCH /posts/:id/publish — Publish/unpublish (admin only)
 */
export async function publishPost(
  request: NextRequest,
  id: string
) {
  const authResult = await requireRole(request, ["admin"]);
  if ("error" in authResult) return authResult.error;

  const validation = await validateBody(request, publishPostSchema);
  if (!validation.success) return validation.error;

  await connectDB();

  const post = await Post.findOne({ _id: id, deleted_at: null });
  if (!post) {
    return apiError("NOT_FOUND", "Artikel tidak ditemukan", 404);
  }

  const updateData: Record<string, unknown> = {
    status: validation.data.status,
  };
  if (validation.data.status === "published" && !post.published_at) {
    updateData.published_at = new Date();
  }

  const updated = await Post.findByIdAndUpdate(id, updateData, {
    new: true,
  }).lean();

  return apiSuccess(updated);
}
