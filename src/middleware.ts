import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  const publicRoutes = ["/login", "/register", "/api/auth"];
  const isPublic = publicRoutes.some((r) => pathname.startsWith(r));
  const isStatic =
    pathname.startsWith("/_next") || pathname === "/favicon.ico";

  if (isStatic) return NextResponse.next();

  if (isPublic) {
    if (token && pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
