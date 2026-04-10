import { type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Category from "@/models/category";
import { ZodCategorySchema } from "@/lib/validations";
import { apiSuccess, apiError, ErrorCodes } from "@/lib/api/response";
import { validateBody } from "@/lib/api/validator";
import { parseQueryParams, paginatedQuery } from "@/lib/api/query-builder";
import { headers } from "next/headers";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const queryOptions = parseQueryParams(request, {
      allowedFilters: ["parent", "level"],
      allowedSorts: ["name", "created_at", "updated_at"],
      searchFields: ["name", "description"],
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
    console.error("GET /api/categories error:", error);
    return apiError(ErrorCodes.INTERNAL_ERROR, "Gagal mengambil data kategori");
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return apiError(ErrorCodes.UNAUTHORIZED, "Anda harus login untuk membuat kategori", 401);
    }

    await dbConnect();

    const validation = await validateBody(request, ZodCategorySchema);
    if (!validation.success) {
      return validation.error;
    }

    const body = validation.data;

    // Auto-generate slug if it's missing or empty
    if (!body.slug || body.slug.trim() === "") {
      body.slug = slugify(body.name);
    }

    const category = await Category.create(body);

    return apiSuccess(category, undefined, 201);
  } catch (error) {
    console.error("POST /api/categories error:", error);
    return apiError(ErrorCodes.INTERNAL_ERROR, "Gagal membuat kategori");
  }
}

