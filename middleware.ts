import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_LOGIN_REDIRECT,
  authRoutes,
  apiAuthPrefix,
  protectedRoutes,
} from "@/routes";

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;

  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  const isLoggedIn = !!sessionToken;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  const isPublicAsset = /\.(png|jpg|jpeg|svg|ico|wav|mp3|webp|css|js|woff|woff2|ttf)$/.test(
    nextUrl.pathname
  );
  if (isPublicAsset || nextUrl.pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  // Cross-site state changes are rejected at the edge: browsers attach an
  // Origin header to every cross-site POST/PUT/PATCH/DELETE. Better-auth
  // re-validates origins on its cookie-bearing endpoints; this covers the
  // cookie-less first-contact cases (e.g. fresh signups) and all app APIs.
  const method = request.method.toUpperCase();
  const origin = request.headers.get("origin");
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method) && origin) {
    const allowedOrigins = new Set(
      [
        nextUrl.origin,
        process.env.NEXT_PUBLIC_APP_URL,
        process.env.BETTER_AUTH_URL,
        ...((process.env.BETTER_AUTH_TRUSTED_ORIGINS || "")
          .split(",")
          .map((o) => o.trim())
          .filter(Boolean)),
      ].filter(Boolean) as string[]
    );
    if (!allowedOrigins.has(origin)) {
      return new NextResponse("Cross-origin request rejected", { status: 403 });
    }
  }

  if (isApiAuthRoute) {
    return NextResponse.next();
  }


  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth", nextUrl));
  }

  if (isLoggedIn && nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  const response = NextResponse.next();

  if (isProtectedRoute || isAuthRoute) {
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    response.headers.set("Surrogate-Control", "no-store");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};