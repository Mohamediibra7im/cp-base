import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";

function resolveJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "JWT_SECRET is not set. Refusing to verify sessions with a default secret in production."
      );
    }
    return "cp-base-default-secret-change-me";
  }
  return secret;
}

const JWT_SECRET = new TextEncoder().encode(resolveJwtSecret());

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin protection
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    const cookie = request.cookies.get("admin_session")?.value;
    if (cookie === ADMIN_PASSWORD) {
      return NextResponse.next();
    }

    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Account-required areas: dashboard and contributing both need a valid session.
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/contribute")) {
    const token = request.cookies.get("cp_session")?.value;
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/contribute/:path*"],
};
