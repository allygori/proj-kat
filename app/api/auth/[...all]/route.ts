/**
 * Auth Catch-All Route — /api/auth/[...all]
 *
 * Delegates all auth requests to better-auth's handler.
 */

import { getAuth } from "@/modules/rest-api/auth";
import { apiError } from "@/modules/rest-api/lib/response";
import { toNextJsHandler } from "better-auth/next-js";

const handler = async (...args: Parameters<ReturnType<typeof toNextJsHandler>["GET"]>) => {
  const auth = await getAuth();

  if (!auth) {
    return apiError("UNAUTHORIZED", "Anda tidak memiliki akses", 401);
  }

  const nextHandler = toNextJsHandler(auth);

  // Determine method from the request
  const request = args[0];
  const method = request.method;

  if (method === "GET") {
    return nextHandler.GET(...args);
  }
  return nextHandler.POST(...args);
};

export const GET = handler;
export const POST = handler;
