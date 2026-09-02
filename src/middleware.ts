import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isStatic = pathname.startsWith("/_next") || pathname === "/favicon.ico";

  if (isStatic) return NextResponse.next();

  const ip = getClientIp(req);

  if (pathname === "/api/auth/callback/credentials" && req.method === "POST") {
    const result = checkRateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
    if (!result.allowed) {
      return NextResponse.json(
        { error: "Muitas tentativas. Tente novamente mais tarde." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)),
          },
        },
      );
    }
  }

  if (pathname === "/api/register" && req.method === "POST") {
    const result = checkRateLimit(`register:${ip}`, 3, 60 * 60 * 1000);
    if (!result.allowed) {
      return NextResponse.json(
        { error: "Muitas tentativas. Tente novamente mais tarde." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)),
          },
        },
      );
    }
  }

  const token = await getToken({ req });

  const publicRoutes = ["/login", "/register", "/api/auth", "/api/register"];
  const isPublic = publicRoutes.some((r) => pathname.startsWith(r));

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
