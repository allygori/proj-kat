/**
 * modules/rest — Re-export all modules
 */

// Database
export { connectDB } from "./db/connection";
export { User } from "./db/models/user";
export { Session } from "./db/models/session";
export { Account } from "./db/models/account";
export { Verification } from "./db/models/verification";
export { Post } from "./db/models/post";
export { Category } from "./db/models/category";
export { Tag } from "./db/models/tag";
export { Media } from "./db/models/media";

// Auth
export { getAuth } from "./auth/index";
export { requireAuth, requireRole, optionalAuth } from "./auth/middleware";

// Lib
export { apiSuccess, apiError, ErrorCodes } from "./lib/response";
export { parseQueryParams, paginatedQuery } from "./lib/query-builder";
export { slugify, uniqueSlug } from "./lib/slugify";
export { validateBody } from "./lib/validator";

// Handlers
export * as postHandlers from "./handlers/posts";
export * as categoryHandlers from "./handlers/categories";
export * as tagHandlers from "./handlers/tags";
export * as mediaHandlers from "./handlers/media";
export * as userHandlers from "./handlers/users";

// Config
export { config } from "./config";
