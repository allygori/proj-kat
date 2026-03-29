/**
 * Blog REST API Catch-All Route — /api/blog/[...path]
 *
 * Routes all /api/blog/* requests to the appropriate handler based on
 * the URL path segments and HTTP method.
 *
 * Path pattern:
 *   /api/blog/posts                → list / create
 *   /api/blog/posts/drafts         → list drafts
 *   /api/blog/posts/:slug          → get by slug
 *   /api/blog/posts/:id            → update / delete (PUT/DELETE)
 *   /api/blog/posts/:id/publish    → publish/unpublish (PATCH)
 *   /api/blog/categories           → list / create
 *   /api/blog/categories/:slug     → get by slug
 *   /api/blog/categories/:id       → update / delete
 *   /api/blog/tags                 → list / create
 *   /api/blog/tags/:id             → update / delete
 *   /api/blog/media                → list / upload
 *   /api/blog/media/:id            → get / update / delete
 *   /api/blog/users                → list users
 *   /api/blog/users/me             → get/update profile
 *   /api/blog/users/:id            → get public profile
 *   /api/blog/users/:id/role       → change role
 */

import { type NextRequest } from "next/server";
import { apiError } from "@/modules/rest-api/lib/response";

// Handlers
import * as postH from "@/modules/rest-api/handlers/posts";
import * as catH from "@/modules/rest-api/handlers/categories";
import * as tagH from "@/modules/rest-api/handlers/tags";
import * as mediaH from "@/modules/rest-api/handlers/media";
import * as userH from "@/modules/rest-api/handlers/users";

type RouteHandler = (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) => Promise<Response>;

function notFound() {
  return apiError("NOT_FOUND", "Endpoint tidak ditemukan", 404);
}

function methodNotAllowed() {
  return apiError("METHOD_NOT_ALLOWED", "Method tidak diizinkan", 405);
}

/**
 * Route dispatcher
 */
async function routeDispatcher(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
): Promise<Response> {
  const { path } = await context.params;
  const [resource, ...rest] = path;
  const method = request.method;

  try {
    switch (resource) {
      // ─── POSTS ──────────────────────────────────────────
      case "posts": {
        if (rest.length === 0) {
          if (method === "GET") return postH.listPosts(request);
          if (method === "POST") return postH.createPost(request);
          return methodNotAllowed();
        }
        if (rest[0] === "drafts" && rest.length === 1) {
          if (method === "GET") return postH.listDrafts(request);
          return methodNotAllowed();
        }
        if (rest.length === 1) {
          const idOrSlug = rest[0];
          if (method === "GET") return postH.getPost(request, idOrSlug);
          if (method === "PUT") return postH.updatePost(request, idOrSlug);
          if (method === "DELETE") return postH.deletePost(request, idOrSlug);
          return methodNotAllowed();
        }
        if (rest.length === 2 && rest[1] === "publish") {
          if (method === "PATCH") return postH.publishPost(request, rest[0]);
          return methodNotAllowed();
        }
        return notFound();
      }

      // ─── CATEGORIES ─────────────────────────────────────
      case "categories": {
        if (rest.length === 0) {
          if (method === "GET") return catH.listCategories(request);
          if (method === "POST") return catH.createCategory(request);
          return methodNotAllowed();
        }
        if (rest.length === 1) {
          const idOrSlug = rest[0];
          if (method === "GET") return catH.getCategory(request, idOrSlug);
          if (method === "PUT") return catH.updateCategory(request, idOrSlug);
          if (method === "DELETE") return catH.deleteCategory(request, idOrSlug);
          return methodNotAllowed();
        }
        return notFound();
      }

      // ─── TAGS ───────────────────────────────────────────
      case "tags": {
        if (rest.length === 0) {
          if (method === "GET") return tagH.listTags(request);
          if (method === "POST") return tagH.createTag(request);
          return methodNotAllowed();
        }
        if (rest.length === 1) {
          const id = rest[0];
          if (method === "PUT") return tagH.updateTag(request, id);
          if (method === "DELETE") return tagH.deleteTag(request, id);
          return methodNotAllowed();
        }
        return notFound();
      }

      // ─── MEDIA ──────────────────────────────────────────
      case "media": {
        if (rest.length === 0) {
          if (method === "GET") return mediaH.listMedia(request);
          if (method === "POST") return mediaH.uploadMedia(request);
          return methodNotAllowed();
        }
        if (rest.length === 1) {
          const id = rest[0];
          if (method === "GET") return mediaH.getMedia(request, id);
          if (method === "PUT") return mediaH.updateMedia(request, id);
          if (method === "DELETE") return mediaH.deleteMedia(request, id);
          return methodNotAllowed();
        }
        return notFound();
      }

      // ─── USERS ──────────────────────────────────────────
      case "users": {
        if (rest.length === 0) {
          if (method === "GET") return userH.listUsers(request);
          return methodNotAllowed();
        }
        if (rest.length === 1) {
          if (rest[0] === "me") {
            if (method === "GET") return userH.getMe(request);
            if (method === "PUT") return userH.updateMe(request);
            return methodNotAllowed();
          }
          const id = rest[0];
          if (method === "GET") return userH.getUser(request, id);
          return methodNotAllowed();
        }
        if (rest.length === 2 && rest[1] === "role") {
          if (method === "PATCH") return userH.changeUserRole(request, rest[0]);
          return methodNotAllowed();
        }
        return notFound();
      }

      default:
        return notFound();
    }
  } catch (err) {
    console.error("[Blog API Error]", err);
    return apiError("INTERNAL_ERROR", "Terjadi kesalahan pada server", 500);
  }
}

export const GET: RouteHandler = routeDispatcher;
export const POST: RouteHandler = routeDispatcher;
export const PUT: RouteHandler = routeDispatcher;
export const DELETE: RouteHandler = routeDispatcher;
export const PATCH: RouteHandler = routeDispatcher;
