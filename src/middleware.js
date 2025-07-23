// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isAuth = !!token;

  // Routes that require authentication
  const protectedPaths = ["/admin", "/recruiter"];
  const isProtected = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  // If accessing protected route without authentication
  if (isProtected && !isAuth) {
    // Redirect to login page
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Apply middleware only to admin and dashboard routes
export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*","/recruiter/:path*"],
};
