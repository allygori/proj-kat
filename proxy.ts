// Reference: AGENTS.md § 3.2 - Proxy for protected routes and role-based access
import { NextRequest, NextResponse } from 'next/server';

const protectedPaths = ['/dashboard'];
const authPaths = ['/login', '/signup', '/forgot-password'];

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if user is authenticated via better-auth session
  const sessionToken = request.cookies.get('better-auth.session_token')?.value;

  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  // If accessing protected path without session, redirect to login
  if (isProtectedPath && !sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If accessing auth path with session, redirect to dashboard
  if (isAuthPath && sessionToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};