import { NextResponse } from "next/server";

const protectedUserRoutes = ["/account", "/orders", "/reviews"];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;

  const isUserRoute = protectedUserRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  if ((isUserRoute || isAdminRoute) && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/orders/:path*", "/reviews/:path*", "/admin/:path*"],
};
