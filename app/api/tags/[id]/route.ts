import { type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Tag from "@/models/tag";
import { ZodTagSchema } from "@/lib/validations";
import { apiSuccess, apiError, ErrorCodes } from "@/lib/api/response";
import { validateBody } from "@/lib/api/validator";
import { headers } from "next/headers";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const tag = await Tag.findOne({ _id: id, deleted_at: { $exists: false } });

    if (!tag) {
      return apiError(ErrorCodes.NOT_FOUND, "Tag tidak ditemukan", 404);
    }

    return apiSuccess(tag);
  } catch (error) {
    console.error("GET /api/tags/[id] error:", error);
    return apiError(ErrorCodes.INTERNAL_ERROR, "Gagal mengambil data tag");
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return apiError(ErrorCodes.UNAUTHORIZED, "Anda harus login untuk mengubah tag", 401);
    }

    await dbConnect();
    const { id } = await params;

    const validation = await validateBody(request, ZodTagSchema.partial());
    if (!validation.success) {
      return validation.error;
    }

    const validatedData = validation.data;

    const tag = await Tag.findOneAndUpdate(
      { _id: id, deleted_at: { $exists: false } },
      { $set: validatedData },
      { new: true }
    );

    if (!tag) {
      return apiError(ErrorCodes.NOT_FOUND, "Tag tidak ditemukan", 404);
    }

    return apiSuccess(tag);
  } catch (error) {
    console.error("PATCH /api/tags/[id] error:", error);
    return apiError(ErrorCodes.INTERNAL_ERROR, "Gagal memperbarui tag");
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return apiError(ErrorCodes.UNAUTHORIZED, "Anda harus login untuk menghapus tag", 401);
    }

    await dbConnect();
    const { id } = await params;

    const tag = await Tag.findOneAndUpdate(
      { _id: id },
      { $set: { deleted_at: new Date() } },
      { new: true }
    );

    if (!tag) {
      return apiError(ErrorCodes.NOT_FOUND, "Tag tidak ditemukan", 404);
    }

    return apiSuccess({ success: true });
  } catch (error) {
    console.error("DELETE /api/tags/[id] error:", error);
    return apiError(ErrorCodes.INTERNAL_ERROR, "Gagal menghapus tag");
  }
}

