/**
 * Auth Middleware Helpers
 *
 * Provides requireAuth, requireRole, and optionalAuth helpers
 * that extract the session from the request via better-auth
 * and attach it for downstream handlers.
 */

import { type NextRequest } from "next/server";
import { getAuth } from "./index";
import { apiError } from "../lib/response";
import { headers as nextHeaders } from "next/headers";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "author" | "reader";
  image?: string;
}

export interface AuthSession {
  user: AuthUser;
  session: {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
  };
}

/**
 * Get session from the current request using better-auth.
 * Returns null if no valid session.
 */
async function getSessionFromRequest(
  request: NextRequest
): Promise<AuthSession | null> {
  try {
    const auth = await getAuth();
    const headersList = await nextHeaders();

    const session = await auth?.api?.getSession({
      headers: headersList,
    });

    if (!session?.user) return null;

    return {
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: (session.user as Record<string, unknown>).role as AuthUser["role"] || "reader",
        image: session.user.image ?? undefined,
      },
      session: {
        id: session.session.id,
        userId: session.session.userId,
        token: session.session.token,
        expiresAt: session.session.expiresAt,
      },
    };
  } catch {
    return null;
  }
}

/**
 * Requires authentication. Returns error response if not authenticated.
 */
export async function requireAuth(
  request: NextRequest
): Promise<{ session: AuthSession } | { error: Response }> {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return { error: apiError("UNAUTHORIZED", "Autentikasi diperlukan", 401) };
  }

  return { session };
}

/**
 * Requires a specific role (or one of multiple roles).
 */
export async function requireRole(
  request: NextRequest,
  roles: AuthUser["role"][]
): Promise<{ session: AuthSession } | { error: Response }> {
  const result = await requireAuth(request);

  if ("error" in result) return result;

  if (!roles.includes(result.session.user.role)) {
    return {
      error: apiError(
        "FORBIDDEN",
        "Anda tidak memiliki akses untuk melakukan aksi ini",
        403
      ),
    };
  }

  return result;
}

/**
 * Optional auth — returns session if present, null otherwise.
 * Never returns an error.
 */
export async function optionalAuth(
  request: NextRequest
): Promise<AuthSession | null> {
  return getSessionFromRequest(request);
}
