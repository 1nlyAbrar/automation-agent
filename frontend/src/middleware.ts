import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("alphasys_token")?.value;

  // If the user is trying to access the dashboard without a token, redirect to login
  if (!token && request.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If the user is already logged in and tries to go to /login, send them to the dashboard
  if (token && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/overview", request.url));
  }

  return NextResponse.next();
}

// This tells Next.js which routes to protect
export const config = {
  matcher: [
    "/overview/:path*",
    "/leads/:path*",
    "/email-automation/:path*",
    "/follow-ups/:path*",
    "/ai-reports/:path*",
    "/workflows/:path*",
    "/notifications/:path*",
    "/settings/:path*",
  ],
};