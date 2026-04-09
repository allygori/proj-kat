import { type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Tag from "@/models/tag";
import { ZodTagSchema } from "@/lib/validations";
import { apiSuccess, apiError, ErrorCodes } from "@/lib/api/response";
import { validateBody } from "@/lib/api/validator";
import { parseQueryParams, paginatedQuery } from "@/lib/api/query-builder";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const queryOptions = parseQueryParams(request, {
      allowedSorts: ["name", "created_at", "updated_at"],
      searchFields: ["name", "description"],
    });

    const { data, meta } = await paginatedQuery(
      Tag,
      { deleted_at: { $exists: false } },
      queryOptions,
      {
        searchFields: ["name", "description"],
      }
    );

    return apiSuccess(data, meta);
  } catch (error) {
    console.error("GET /api/tags error:", error);
    return apiError(ErrorCodes.INTERNAL_ERROR, "Gagal mengambil data tag");
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return apiError(ErrorCodes.UNAUTHORIZED, "Anda harus login untuk membuat tag", 401);
    }

    await dbConnect();

    const validation = await validateBody(request, ZodTagSchema);
    if (!validation.success) {
      return validation.error;
    }

    const body = validation.data;
    const tag = await Tag.create(body);

    return apiSuccess(tag, undefined, 201);
  } catch (error) {
    console.error("POST /api/tags error:", error);
    return apiError(ErrorCodes.INTERNAL_ERROR, "Gagal membuat tag");
  }
}

