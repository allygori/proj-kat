// Reference: AGENTS.md § 3.4 - Blog Post API with filtering, sorting, and pagination
import { type NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth";
import dbConnect from "@/lib/db";
import BlogPost from "@/models/blog-post";
import { ZodPostSchema } from "@/lib/validations";
import { apiSuccess, apiError, ErrorCodes } from "@/lib/api/response";
import { validateBody } from "@/lib/api/validator";
import { parseQueryParams, paginatedQuery } from "@/lib/api/query-builder";
import { headers } from "next/headers";
import { generateSlug, calculateReadingTime } from "@/lib/blog-utils";
import { genPostNid } from "@/lib/nano-id";

// Derived schema for creating posts (omit auto-generated fields)
const ZodCreatePostSchema = ZodPostSchema.omit({
  nid: true,
  slug: true,
  author: true,
  reading_time: true
}).extend({
  slug: ZodPostSchema.shape.slug.optional(),
  published_at: ZodPostSchema.shape.published_at.optional(),
});

/**
 * GET /api/posts — List all blog posts with filters, search, and pagination
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Parse query params for pagination, sorting, and predefined filters
    const queryOptions = parseQueryParams(request, {
      allowedFilters: ["category", "tags", "published_status", "author", "nid", "categorySlugs", "tagSlugs"],
      allowedSorts: ["created_at", "updated_at", "published_at", "title"],
      searchFields: ["title", "excerpt"],
    });

    // For "tags" filter, we need to handle it properly in Mongoose if it's an array
    const baseFilter: Record<string, unknown> = {
      deleted_at: { $exists: false },
    };

    // If query has tags, we use $in or similar if needed. 
    // queryOptions.filters already has values from searchParams.
    // However, for MongoDB ObjectId filtering, we might need to convert them.

    // category id
    if (queryOptions.filters.category) {
      baseFilter.category = queryOptions.filters.category;
    }

    // category slugs
    if (queryOptions.filters.categorySlugs) {
      const _categorySlugs = typeof queryOptions.filters.categorySlugs === "string"
        ? queryOptions.filters.categorySlugs.split(",")
        : queryOptions.filters.categorySlugs;
      const Category = (await import("@/models/category")).default;
      const categoryIds = await Category.find({ slug: { $in: _categorySlugs }, deleted_at: null }).lean();
      if (categoryIds) {
        baseFilter.category = { $in: categoryIds };
      } else {
        // Return empty if category not found
        baseFilter.category = null;
      }
    }

    // tag IDs
    if (queryOptions.filters.tags) {
      // If it's a comma-separated string, convert to array
      const tags = typeof queryOptions.filters.tags === "string"
        ? queryOptions.filters.tags.split(",")
        : queryOptions.filters.tags;
      baseFilter.tags = { $in: tags };
    }

    // tag slugs
    if (queryOptions.filters.tagSlugs) {
      const _tagSlugs = typeof queryOptions.filters.tagSlugs === "string"
        ? queryOptions.filters.tagSlugs.split(",")
        : queryOptions.filters.tagSlugs;

      const Tag = (await import("@/models/tag")).default;
      const tagIds = await Tag.find({ slug: { $in: _tagSlugs }, deleted_at: null }, { _id: 1 }).lean();
      if (tagIds && tagIds?.length > 0) {
        baseFilter.tags = { $in: tagIds };
      } else {
        // Return empty if category not found
        baseFilter.tags = null;
      }
    }

    if (queryOptions.filters.author) {
      baseFilter.author = queryOptions.filters.author;
    }
    if (queryOptions.filters.published_status) {
      baseFilter.published_status = queryOptions.filters.published_status;
    }
    if (queryOptions.filters.nid) {
      baseFilter.nid = queryOptions.filters.nid;
    }

    const { data, meta } = await paginatedQuery(BlogPost, baseFilter, queryOptions, {
      searchFields: ["title", "excerpt"],
      populate: ["category", "tags", "author", "featured_image"],
    });

    return apiSuccess(data, meta);
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return apiError(ErrorCodes.INTERNAL_ERROR, "Gagal mengambil data artikel");
  }
}

/**
 * POST /api/posts — Create a new blog post
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return apiError(ErrorCodes.UNAUTHORIZED, "Anda harus login untuk membuat artikel", 401);
    }

    // Role check: admin, editor, author
    const userRole = (session.user as { role?: string }).role;
    if (!userRole || !["admin", "editor", "author"].includes(userRole)) {
      return apiError(ErrorCodes.FORBIDDEN, "Anda tidak memiliki izin untuk membuat artikel", 403);
    }

    await dbConnect();

    // Validate body using the derived schema
    const validation = await validateBody(request, ZodCreatePostSchema);
    if (!validation.success) {
      return validation.error;
    }

    const body = validation.data;

    // Auto-generate fields
    const nid = genPostNid();
    const slug = body.slug || generateSlug(body.title);
    const reading_time = calculateReadingTime(body.content || "");
    const author = session.user.id;

    // Check if slug exists
    const existingSlug = await BlogPost.findOne({ slug });
    if (existingSlug) {
      return apiError(ErrorCodes.CONFLICT, "Slug sudah digunakan, silakan gunakan judul lain atau slug manual", 409);
    }

    const newPost = await BlogPost.create({
      ...body,
      nid,
      slug,
      author,
      reading_time,
      published_at: body.published_status === "published" ? new Date() : body.published_at,
    });

    // Populate relations for the response
    const populatedPost = await BlogPost.findById(newPost._id)
      .populate("category")
      .populate("tags")
      .populate("author")
      .populate("featured_image");

    return apiSuccess(populatedPost, undefined, 201);
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return apiError(ErrorCodes.INTERNAL_ERROR, "Gagal membuat artikel");
  }
}
