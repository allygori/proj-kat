import { type NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/category";
import { parseQueryParams, paginatedQuery } from "@/lib/api/query-builder";
import { apiSuccess, apiError, ErrorCodes } from "@/lib/api/response";

/**
 * Dedicated search endpoint for categories.
 * Usage: /api/categories/search?search=keyword&limit=10
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const queryOptions = parseQueryParams(request, {
      allowedFilters: ["parent", "level"],
      allowedSorts: ["name", "created_at"],
    });

    const { data, meta } = await paginatedQuery(
      Category,
      { deleted_at: { $exists: false } },
      queryOptions,
      {
        searchFields: ["name", "description"],
        populate: ["parent"],
      }
    );

    return apiSuccess(data, meta);
  } catch (error) {
    console.error("GET /api/categories/search error:", error);
    return apiError(ErrorCodes.INTERNAL_ERROR, "Gagal melakukan pencarian kategori");
  }
}

