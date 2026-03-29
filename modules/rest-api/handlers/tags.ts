/**
 * Tag CRUD Handlers
 */

import { type NextRequest } from "next/server";
import { connectDB } from "../db/connection";
import { Tag } from "../db/models/tag";
import { requireRole } from "../auth/middleware";
import { apiSuccess, apiError } from "../lib/response";
import { parseQueryParams, paginatedQuery } from "../lib/query-builder";
import { uniqueSlug } from "../lib/slugify";
import { validateBody } from "../lib/validator";
import { createTagSchema, updateTagSchema } from "../schemas/tag";

/**
 * GET /tags — List all tags (public)
 */
export async function listTags(request: NextRequest) {
  await connectDB();

  const query = parseQueryParams(request, {
    allowedFilters: [],
    searchFields: ["name"],
  });

  const result = await paginatedQuery(Tag, {}, query, {
    searchFields: ["name"],
  });

  return apiSuccess(result.data, result.meta);
}

/**
 * POST /tags — Create tag (admin, author)
 */
export async function createTag(request: NextRequest) {
  const authResult = await requireRole(request, ["admin", "author"]);
  if ("error" in authResult) return authResult.error;

  const validation = await validateBody(request, createTagSchema);
  if (!validation.success) return validation.error;

  await connectDB();

  const { name } = validation.data;
  const slug = await uniqueSlug(Tag, name);

  // Check if tag with same name already exists
  const existing = await Tag.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
  if (existing) {
    return apiError("CONFLICT", "Tag dengan nama tersebut sudah ada", 409);
  }

  const tag = await Tag.create({ name, slug });

  return apiSuccess(tag, undefined, 201);
}

/**
 * PUT /tags/:id — Update tag (admin only)
 */
export async function updateTag(request: NextRequest, id: string) {
  const authResult = await requireRole(request, ["admin"]);
  if ("error" in authResult) return authResult.error;

  const validation = await validateBody(request, updateTagSchema);
  if (!validation.success) return validation.error;

  await connectDB();

  const existing = await Tag.findById(id);
  if (!existing) {
    return apiError("NOT_FOUND", "Tag tidak ditemukan", 404);
  }

  const updateData = { ...validation.data };

  if (updateData.name && updateData.name !== existing.name) {
    (updateData as Record<string, unknown>).slug = await uniqueSlug(Tag, updateData.name, id);
  }

  const updated = await Tag.findByIdAndUpdate(id, updateData, {
    new: true,
  }).lean();

  return apiSuccess(updated);
}

/**
 * DELETE /tags/:id — Delete tag (admin only)
 */
export async function deleteTag(request: NextRequest, id: string) {
  const authResult = await requireRole(request, ["admin"]);
  if ("error" in authResult) return authResult.error;

  await connectDB();

  const tag = await Tag.findById(id);
  if (!tag) {
    return apiError("NOT_FOUND", "Tag tidak ditemukan", 404);
  }

  await Tag.findByIdAndDelete(id);

  return apiSuccess({ message: "Tag berhasil dihapus" });
}
