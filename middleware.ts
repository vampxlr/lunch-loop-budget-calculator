import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Only protect /dashboard routes (except /dashboard/login)
  if (pathname.startsWith("/dashboard") && pathname !== "/dashboard/login") {
    // Check if auth is enabled
    const authEnabled = process.env.ADMIN_AUTH_ENABLED === "true";

    // If auth is disabled, allow all access
    if (!authEnabled) {
      return NextResponse.next();
    }

    // If auth is enabled, check for admin_auth cookie
    const adminAuthCookie = request.cookies.get("admin_auth");

    if (adminAuthCookie?.value === "1") {
      // User is authenticated
      return NextResponse.next();
    }

    // Not authenticated - redirect to login with next parameter
    const loginUrl = new URL("/dashboard/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Match /dashboard/* routes
export const config = {
  matcher: ["/dashboard/:path*"],
};
