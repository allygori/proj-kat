import { type NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth";
import dbConnect from "@/lib/db";
import User from "@/models/user";
import { headers } from "next/headers";
import { z } from "zod";
import { apiSuccess, apiError, ErrorCodes } from "@/lib/api/response";
import { validateBody } from "@/lib/api/validator";
import { parseQueryParams, paginatedQuery } from "@/lib/api/query-builder";

const userUpdateSchema = z.object({
  id: z.string(), // require id in body for PATCH
  role: z.enum(["admin", "editor", "author"]).optional(),
  name: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return apiError(ErrorCodes.UNAUTHORIZED, "Anda harus login untuk melihat data pengguna", 401);
    }

    // Role check: usually only admin can see all users
    const userRole = (session.user as { role?: string }).role;
    if (userRole !== "admin") {
      return apiError(ErrorCodes.FORBIDDEN, "Hanya admin yang dapat melihat daftar pengguna", 403);
    }

    await dbConnect();

    const queryOptions = parseQueryParams(request, {
      allowedFilters: ["role"],
      allowedSorts: ["name", "email", "created_at"],
      searchFields: ["name", "email"],
    });

    const { data, meta } = await paginatedQuery(
      User,
      { deleted_at: { $exists: false } },
      queryOptions,
      {
        searchFields: ["name", "email"],
        select: "-password", // Exclude sensitive fields
      }
    );

    return apiSuccess(data, meta);
  } catch (error) {
    console.error("GET /api/users error:", error);
    return apiError(ErrorCodes.INTERNAL_ERROR, "Gagal mengambil data pengguna");
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return apiError(ErrorCodes.UNAUTHORIZED, "Anda harus login untuk mengubah data pengguna", 401);
    }

    // Only admin can update roles/other users
    const userRole = (session.user as { role?: string }).role;
    if (userRole !== "admin") {
      return apiError(ErrorCodes.FORBIDDEN, "Hanya admin yang dapat mengubah data pengguna", 403);
    }

    await dbConnect();

    const validation = await validateBody(request, userUpdateSchema);
    if (!validation.success) {
      return validation.error;
    }

    const { id, ...updateData } = validation.data;

    const user = await User.findOneAndUpdate(
      { _id: id, deleted_at: { $exists: false } },
      { $set: updateData },
      { new: true }
    ).select("-password");

    if (!user) {
      return apiError(ErrorCodes.NOT_FOUND, "Pengguna tidak ditemukan", 404);
    }

    return apiSuccess(user);
  } catch (error) {
    console.error("PATCH /api/users error:", error);
    return apiError(ErrorCodes.INTERNAL_ERROR, "Gagal memperbarui data pengguna");
  }
}

