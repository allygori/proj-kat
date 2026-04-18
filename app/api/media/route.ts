import { type NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import dbConnect from "@/lib/db";
import Media from "@/models/media";
import { put, del } from "@vercel/blob";
import { apiSuccess, apiError, ErrorCodes } from "@/lib/api/response";
import { parseQueryParams, paginatedQuery } from "@/lib/api/query-builder";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return apiError(ErrorCodes.UNAUTHORIZED, "Anda harus login untuk mengakses galeri media", 401);
    }

    const queryOptions = parseQueryParams(request, {
      allowedFilters: ["folder", "mime_type", "uploaded_by"],
      allowedSorts: ["created_at", "updated_at", "size", "filename"],
      searchFields: ["original_name", "alt_text", "caption"],
    });

    const { data, meta } = await paginatedQuery(
      Media,
      { deleted_at: { $exists: false } },
      queryOptions,
      {
        searchFields: ["original_name", "alt_text", "caption"],
        populate: [{ path: "uploaded_by", select: "name email image" }],
      }
    );

    return apiSuccess(data, meta);
  } catch (error) {
    console.error("GET /api/media error:", error);
    return apiError(ErrorCodes.INTERNAL_ERROR, "Gagal mengambil data media");
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return apiError(ErrorCodes.UNAUTHORIZED, "Anda harus login untuk mengunggah media", 401);
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const alt_text = formData.get("alt_text") as string || "";
    const caption = formData.get("caption") as string || "";
    const folder = formData.get("folder") as string || "general";

    if (!file) {
      return apiError(ErrorCodes.BAD_REQUEST, "File tidak ditemukan", 400);
    }

    // Upload to Vercel Blob
    const filename = folder ? `${folder}/${file.name}` : file.name;

    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: true
    });

    await dbConnect();

    // Create database record
    const media = await Media.create({
      filename: blob.pathname,
      original_name: file.name,
      mime_type: file.type || "application/octet-stream",
      size: file.size,
      url: blob.url,
      alt_text,
      caption,
      folder,
      uploaded_by: session.user.id
    });

    return apiSuccess(media, undefined, 201);
  } catch (error) {
    console.error("POST /api/media error:", error);
    return apiError(ErrorCodes.INTERNAL_ERROR, "Gagal mengunggah media");
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return apiError(ErrorCodes.UNAUTHORIZED, "Anda harus login untuk menghapus media", 401);
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return apiError(ErrorCodes.BAD_REQUEST, "ID media diperlukan", 400);
    }

    await dbConnect();

    const media = await Media.findById(id);
    if (!media) {
      return apiError(ErrorCodes.NOT_FOUND, "Media tidak ditemukan", 404);
    }

    // Delete from Vercel Blob
    if (media.url) {
      await del(media.url);
    }

    // Soft delete in database
    media.deleted_at = new Date();
    await media.save();

    return apiSuccess({ success: true, message: "Media berhasil dihapus" });
  } catch (error) {
    console.error("DELETE /api/media error:", error);
    return apiError(ErrorCodes.INTERNAL_ERROR, "Gagal menghapus media");
  }
}

