import { type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Category from "@/models/category";
import { ZodCategorySchema } from "@/lib/validations";
import { apiSuccess, apiError, ErrorCodes } from "@/lib/api/response";
import { validateBody } from "@/lib/api/validator";
import { headers } from "next/headers";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const category = await Category.findOne({ _id: id, deleted_at: { $exists: false } }).populate("parent");

    if (!category) {
      return apiError(ErrorCodes.NOT_FOUND, "Kategori tidak ditemukan", 404);
    }

    return apiSuccess(category);
  } catch (error) {
    console.error("GET /api/categories/[id] error:", error);
    return apiError(ErrorCodes.INTERNAL_ERROR, "Gagal mengambil data kategori");
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return apiError(ErrorCodes.UNAUTHORIZED, "Anda harus login untuk mengubah kategori", 401);
    }

    await dbConnect();
    const { id } = await params;

    const validation = await validateBody(request, ZodCategorySchema.partial());
    if (!validation.success) {
      return validation.error;
    }

    const validatedData = validation.data;

    // Auto-generate slug if it's empty but name is provided
    if (validatedData.name && (!validatedData.slug || validatedData.slug.trim() === "")) {
      validatedData.slug = slugify(validatedData.name);
    }

    const category = await Category.findOneAndUpdate(
      { _id: id, deleted_at: { $exists: false } },
      { $set: validatedData },
      { new: true }
    ).populate("parent");

    if (!category) {
      return apiError(ErrorCodes.NOT_FOUND, "Kategori tidak ditemukan", 404);
    }

    return apiSuccess(category);
  } catch (error) {
    console.error("PATCH /api/categories/[id] error:", error);
    return apiError(ErrorCodes.INTERNAL_ERROR, "Gagal memperbarui kategori");
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return apiError(ErrorCodes.UNAUTHORIZED, "Anda harus login untuk menghapus kategori", 401);
    }

    await dbConnect();
    const { id } = await params;

    const category = await Category.findOneAndUpdate(
      { _id: id },
      { $set: { deleted_at: new Date() } },
      { new: true }
    );

    if (!category) {
      return apiError(ErrorCodes.NOT_FOUND, "Kategori tidak ditemukan", 404);
    }

    return apiSuccess({ success: true });
  } catch (error) {
    console.error("DELETE /api/categories/[id] error:", error);
    return apiError(ErrorCodes.INTERNAL_ERROR, "Gagal menghapus kategori");
  }
}

