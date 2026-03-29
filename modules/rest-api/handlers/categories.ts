/**
 * Category CRUD Handlers
 */

import { type NextRequest } from "next/server";
import { connectDB } from "../db/connection";
import { Category } from "../db/models/category";
import { requireRole } from "../auth/middleware";
import { apiSuccess, apiError } from "../lib/response";
import { parseQueryParams, paginatedQuery } from "../lib/query-builder";
import { uniqueSlug } from "../lib/slugify";
import { validateBody } from "../lib/validator";
import { createCategorySchema, updateCategorySchema } from "../schemas/category";

/**
 * GET /categories — List all categories (public)
 */
export async function listCategories(request: NextRequest) {
  await connectDB();

  const query = parseQueryParams(request, {
    allowedFilters: [],
    searchFields: ["name"],
  });

  const result = await paginatedQuery(Category, {}, query, {
    searchFields: ["name"],
    populate: ["parent"],
  });

  return apiSuccess(result.data, result.meta);
}

/**
 * GET /categories/:slug — Get category by slug (public)
 */
export async function getCategory(_request: NextRequest, slug: string) {
  await connectDB();

  const category = await Category.findOne({ slug })
    .populate("parent")
    .lean();

  if (!category) {
    return apiError("NOT_FOUND", "Kategori tidak ditemukan", 404);
  }

  return apiSuccess(category);
}

/**
 * POST /categories — Create category (admin only)
 */
export async function createCategory(request: NextRequest) {
  const authResult = await requireRole(request, ["admin"]);
  if ("error" in authResult) return authResult.error;

  const validation = await validateBody(request, createCategorySchema);
  if (!validation.success) return validation.error;

  await connectDB();

  const { name, ...rest } = validation.data;
  const slug = await uniqueSlug(Category, name);

  const category = await Category.create({ ...rest, name, slug });

  return apiSuccess(category, undefined, 201);
}

/**
 * PUT /categories/:id — Update category (admin only)
 */
export async function updateCategory(request: NextRequest, id: string) {
  const authResult = await requireRole(request, ["admin"]);
  if ("error" in authResult) return authResult.error;

  const validation = await validateBody(request, updateCategorySchema);
  if (!validation.success) return validation.error;

  await connectDB();

  const existing = await Category.findById(id);
  if (!existing) {
    return apiError("NOT_FOUND", "Kategori tidak ditemukan", 404);
  }

  const updateData = { ...validation.data };

  if (updateData.name && updateData.name !== existing.name) {
    (updateData as Record<string, unknown>).slug = await uniqueSlug(Category, updateData.name, id);
  }

  const updated = await Category.findByIdAndUpdate(id, updateData, {
    new: true,
  })
    .populate("parent")
    .lean();

  return apiSuccess(updated);
}

/**
 * DELETE /categories/:id — Delete category (admin only)
 */
export async function deleteCategory(request: NextRequest, id: string) {
  const authResult = await requireRole(request, ["admin"]);
  if ("error" in authResult) return authResult.error;

  await connectDB();

  const category = await Category.findById(id);
  if (!category) {
    return apiError("NOT_FOUND", "Kategori tidak ditemukan", 404);
  }

  // Check if any children reference this category
  const children = await Category.countDocuments({ parent: id });
  if (children > 0) {
    return apiError(
      "CONFLICT",
      "Kategori ini memiliki sub-kategori. Hapus sub-kategori terlebih dahulu.",
      409
    );
  }

  await Category.findByIdAndDelete(id);

  return apiSuccess({ message: "Kategori berhasil dihapus" });
}
