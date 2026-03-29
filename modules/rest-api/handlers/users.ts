/**
 * User Profile Handlers
 */

import { type NextRequest } from "next/server";
import { connectDB } from "../db/connection";
import { User } from "../db/models/user";
import { requireAuth, requireRole } from "../auth/middleware";
import { apiSuccess, apiError } from "../lib/response";
import { parseQueryParams, paginatedQuery } from "../lib/query-builder";

/**
 * GET /users/me — Get current user profile
 */
export async function getMe(request: NextRequest) {
  const authResult = await requireAuth(request);
  if ("error" in authResult) return authResult.error;

  await connectDB();

  const user = await User.findById(authResult.session.user.id)
    .select("-__v")
    .lean();

  if (!user) {
    return apiError("NOT_FOUND", "User tidak ditemukan", 404);
  }

  return apiSuccess(user);
}

/**
 * PUT /users/me — Update current user profile
 */
export async function updateMe(request: NextRequest) {
  const authResult = await requireAuth(request);
  if ("error" in authResult) return authResult.error;

  const body = await request.json();

  // Only allow certain fields to be updated
  const allowed: Record<string, unknown> = {};
  if (body.name) allowed.name = body.name;
  if (body.bio !== undefined) allowed.bio = body.bio;
  if (body.image) allowed.image = body.image;

  await connectDB();

  const updated = await User.findByIdAndUpdate(
    authResult.session.user.id,
    allowed,
    { new: true }
  )
    .select("-__v")
    .lean();

  return apiSuccess(updated);
}

/**
 * GET /users — List all users (admin only)
 */
export async function listUsers(request: NextRequest) {
  const authResult = await requireRole(request, ["admin"]);
  if ("error" in authResult) return authResult.error;

  await connectDB();

  const query = parseQueryParams(request, {
    allowedFilters: ["role"],
    searchFields: ["name", "email"],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = {};
  if (query.filters.role) {
    filter.role = query.filters.role;
  }

  const result = await paginatedQuery(User, filter, query, {
    searchFields: ["name", "email"],
  });

  return apiSuccess(result.data, result.meta);
}

/**
 * GET /users/:id — Get public author info
 */
export async function getUser(_request: NextRequest, id: string) {
  await connectDB();

  const user = await User.findById(id)
    .select("name image bio createdAt")
    .lean();

  if (!user) {
    return apiError("NOT_FOUND", "User tidak ditemukan", 404);
  }

  return apiSuccess(user);
}

/**
 * PATCH /users/:id/role — Change user role (admin only)
 */
export async function changeUserRole(request: NextRequest, id: string) {
  const authResult = await requireRole(request, ["admin"]);
  if ("error" in authResult) return authResult.error;

  const body = await request.json();

  if (!body.role || !["admin", "author", "reader"].includes(body.role)) {
    return apiError(
      "VALIDATION_ERROR",
      "Role harus salah satu dari: admin, author, reader",
      400
    );
  }

  await connectDB();

  const user = await User.findById(id);
  if (!user) {
    return apiError("NOT_FOUND", "User tidak ditemukan", 404);
  }

  const updated = await User.findByIdAndUpdate(
    id,
    { role: body.role },
    { new: true }
  )
    .select("-__v")
    .lean();

  return apiSuccess(updated);
}
