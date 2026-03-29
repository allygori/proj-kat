/**
 * Media Upload / CRUD Handlers
 *
 * Storage: local filesystem (public/uploads/) with URL /uploads/{filename}.
 */

import { type NextRequest } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { connectDB } from "../db/connection";
import { Media } from "../db/models/media";
import { requireRole } from "../auth/middleware";
import { apiSuccess, apiError } from "../lib/response";
import { parseQueryParams, paginatedQuery } from "../lib/query-builder";
import { validateBody } from "../lib/validator";
import { updateMediaSchema } from "../schemas/media";
import { config } from "../config";
import { nanoid } from "nanoid";

/**
 * GET /media — List media (admin, author)
 */
export async function listMedia(request: NextRequest) {
  const authResult = await requireRole(request, ["admin", "author"]);
  if ("error" in authResult) return authResult.error;

  await connectDB();

  const query = parseQueryParams(request, {
    allowedFilters: ["mime_type"],
    searchFields: ["filename", "alt", "caption"],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = {};

  // Authors only see their own media
  if (authResult.session.user.role === "author") {
    filter.uploaded_by = authResult.session.user.id;
  }

  if (query.filters.mime_type) {
    filter.mime_type = { $regex: query.filters.mime_type };
  }

  const result = await paginatedQuery(Media, filter, query, {
    searchFields: ["filename", "alt", "caption"],
    populate: ["uploaded_by"],
  });

  return apiSuccess(result.data, result.meta);
}

/**
 * GET /media/:id — Get single media (admin, author)
 */
export async function getMedia(request: NextRequest, id: string) {
  const authResult = await requireRole(request, ["admin", "author"]);
  if ("error" in authResult) return authResult.error;

  await connectDB();

  const media = await Media.findById(id)
    .populate("uploaded_by", "name email")
    .lean();

  if (!media) {
    return apiError("NOT_FOUND", "Media tidak ditemukan", 404);
  }

  // Authors can only see own media
  if (
    authResult.session.user.role === "author" &&
    String(media.uploaded_by?._id) !== authResult.session.user.id
  ) {
    return apiError("FORBIDDEN", "Akses ditolak", 403);
  }

  return apiSuccess(media);
}

/**
 * POST /media — Upload media (admin, author)
 *
 * Expects multipart/form-data with a `file` field.
 */
export async function uploadMedia(request: NextRequest) {
  const authResult = await requireRole(request, ["admin", "author"]);
  if ("error" in authResult) return authResult.error;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return apiError("VALIDATION_ERROR", "File wajib diunggah", 400);
    }

    // Validate MIME type
    if (!(config.upload.allowedMimeTypes as readonly string[]).includes(file.type)) {
      return apiError(
        "VALIDATION_ERROR",
        `Tipe file tidak didukung: ${file.type}`,
        400
      );
    }

    // Validate file size
    if (file.size > config.upload.maxFileSize) {
      return apiError(
        "VALIDATION_ERROR",
        `Ukuran file melebihi batas (${config.upload.maxFileSize / 1024 / 1024}MB)`,
        400
      );
    }

    // Generate unique filename
    const ext = path.extname(file.name) || "";
    const uniqueName = `${nanoid(12)}${ext}`;
    const uploadDir = path.join(process.cwd(), config.upload.dir);
    const filePath = path.join(uploadDir, uniqueName);

    // Ensure upload directory exists
    await mkdir(uploadDir, { recursive: true });

    // Write file to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    // Build URL
    const url = `${config.upload.urlPrefix}/${uniqueName}`;

    await connectDB();

    // Create media record
    const media = await Media.create({
      filename: file.name,
      url,
      mime_type: file.type,
      file_size: file.size,
      alt: formData.get("alt") as string || "",
      caption: formData.get("caption") as string || "",
      uploaded_by: authResult.session.user.id,
    });

    return apiSuccess(media, undefined, 201);
  } catch (err) {
    console.error("[Media Upload Error]", err);
    return apiError("INTERNAL_ERROR", "Gagal mengunggah file", 500);
  }
}

/**
 * PUT /media/:id — Update media metadata (admin, author own)
 */
export async function updateMedia(request: NextRequest, id: string) {
  const authResult = await requireRole(request, ["admin", "author"]);
  if ("error" in authResult) return authResult.error;

  const validation = await validateBody(request, updateMediaSchema);
  if (!validation.success) return validation.error;

  await connectDB();

  const media = await Media.findById(id);
  if (!media) {
    return apiError("NOT_FOUND", "Media tidak ditemukan", 404);
  }

  if (
    authResult.session.user.role === "author" &&
    String(media.uploaded_by) !== authResult.session.user.id
  ) {
    return apiError("FORBIDDEN", "Anda hanya bisa mengedit media sendiri", 403);
  }

  const updated = await Media.findByIdAndUpdate(id, validation.data, {
    new: true,
  }).lean();

  return apiSuccess(updated);
}

/**
 * DELETE /media/:id — Delete media (admin, author own)
 */
export async function deleteMedia(request: NextRequest, id: string) {
  const authResult = await requireRole(request, ["admin", "author"]);
  if ("error" in authResult) return authResult.error;

  await connectDB();

  const media = await Media.findById(id);
  if (!media) {
    return apiError("NOT_FOUND", "Media tidak ditemukan", 404);
  }

  if (
    authResult.session.user.role === "author" &&
    String(media.uploaded_by) !== authResult.session.user.id
  ) {
    return apiError("FORBIDDEN", "Anda hanya bisa menghapus media sendiri", 403);
  }

  // Delete file from disk
  try {
    const filePath = path.join(process.cwd(), "public", media.url);
    await unlink(filePath);
  } catch {
    // File may already be missing — continue anyway
  }

  await Media.findByIdAndDelete(id);

  return apiSuccess({ message: "Media berhasil dihapus" });
}
