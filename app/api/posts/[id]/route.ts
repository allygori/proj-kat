// Reference: AGENTS.md § 3.4 - Blog Post Detail API (GET, PATCH, DELETE)
import { type NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import BlogPost from "@/models/blog-post";
import { ZodPostSchema } from "@/lib/validations";
import { apiSuccess, apiError, ErrorCodes } from "@/lib/api/response";
import { validateBody } from "@/lib/api/validator";
import { headers } from "next/headers";
import { calculateReadingTime } from "@/lib/blog-utils";
import { isValidObjectId } from "mongoose";

// Derived schema for updating posts (partial)
const ZodUpdatePostSchema = ZodPostSchema.omit({
  nid: true,
  author: true,
  reading_time: true
}).partial();

/**
 * GET /api/posts/[id] — Get a single blog post by ID or NID or Slug
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();

    // Try finding by ObjectId, NID, or Slug
    let query;
    if (isValidObjectId(id)) {
      query = BlogPost.findById(id);
    } else {
      query = BlogPost.findOne({ $or: [{ nid: id }, { slug: id }] });
    }

    const post = await query
      .populate("category")
      .populate("tags")
      .populate("author")
      .populate("featured_image")
      .populate("metadata.image")
      .lean()
      .exec();

    if (!post || post.deleted_at) {
      return apiError(ErrorCodes.NOT_FOUND, "Artikel tidak ditemukan", 404);
    }

    return apiSuccess(post);
  } catch (error) {
    console.error("GET /api/posts/[id] error:", error);
    return apiError(ErrorCodes.INTERNAL_ERROR, "Gagal mengambil detail artikel");
  }
}

/**
 * PATCH /api/posts/[id] — Update an existing blog post
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return apiError(ErrorCodes.UNAUTHORIZED, "Anda harus login untuk mengedit artikel", 401);
    }

    await dbConnect();

    // Find the post first
    let post;
    if (isValidObjectId(id)) {
      post = await BlogPost.findById(id);
    } else {
      post = await BlogPost.findOne({ nid: id });
    }

    if (!post || post.deleted_at) {
      return apiError(ErrorCodes.NOT_FOUND, "Artikel tidak ditemukan", 404);
    }

    // Role and ownership check
    const userRole = (session.user as { role?: string }).role;
    const isOwner = post.author?.toString() === session.user.id;
    const canEdit = ["admin", "editor"].includes(userRole || "") || (userRole === "author" && isOwner);

    if (!canEdit) {
      return apiError(ErrorCodes.FORBIDDEN, "Anda tidak memiliki izin untuk mengedit artikel ini", 403);
    }

    // Validate update body
    const validation = await validateBody(request, ZodUpdatePostSchema);
    if (!validation.success) {
      return validation.error;
    }

    const updates: Partial<z.infer<typeof ZodPostSchema>> = validation.data;

    // Recalculate reading time if content changed
    if (updates.content) {
      updates.reading_time = calculateReadingTime(updates.content);
    }

    // Handle slug uniqueness if slug changed
    if (updates.slug && updates.slug !== post.slug) {
      const existingSlug = await BlogPost.findOne({ slug: updates.slug, _id: { $ne: post._id } });
      if (existingSlug) {
        return apiError(ErrorCodes.CONFLICT, "Slug sudah digunakan oleh artikel lain", 409);
      }
    }

    // Apply updates
    const updatedPost = await BlogPost.findByIdAndUpdate(
      post._id,
      { $set: updates },
      { new: true }
    )
      .populate("category")
      .populate("tags")
      .populate("author")
      .populate("featured_image");

    return apiSuccess(updatedPost);
  } catch (error) {
    console.error("PATCH /api/posts/[id] error:", error);
    return apiError(ErrorCodes.INTERNAL_ERROR, "Gagal mengupdate artikel");
  }
}

/**
 * DELETE /api/posts/[id] — Soft-delete a blog post
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return apiError(ErrorCodes.UNAUTHORIZED, "Anda harus login untuk menghapus artikel", 401);
    }

    await dbConnect();

    // Find the post
    let post;
    if (isValidObjectId(id)) {
      post = await BlogPost.findById(id);
    } else {
      post = await BlogPost.findOne({ nid: id });
    }

    if (!post || post.deleted_at) {
      return apiError(ErrorCodes.NOT_FOUND, "Artikel tidak ditemukan", 404);
    }

    // Role check: Admin or Editor can delete anything, Author can delete their own
    const userRole = (session.user as { role?: string }).role;
    const isOwner = post.author?.toString() === session.user.id;
    const canDelete = ["admin", "editor"].includes(userRole || "") || (userRole === "author" && isOwner);

    if (!canDelete) {
      return apiError(ErrorCodes.FORBIDDEN, "Anda tidak memiliki izin untuk menghapus artikel ini", 403);
    }

    // Soft delete
    await BlogPost.findByIdAndUpdate(post._id, { deleted_at: new Date() });

    return apiSuccess({ message: "Artikel berhasil dihapus" });
  } catch (error) {
    console.error("DELETE /api/posts/[id] error:", error);
    return apiError(ErrorCodes.INTERNAL_ERROR, "Gagal menghapus artikel");
  }
}
