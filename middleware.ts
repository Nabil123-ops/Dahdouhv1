import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth(function middleware(req) {
  const isLoggedIn = !!req.auth;
  const protectedRoutes = ["/dashboard", "/chat", "/account"];

  const path = req.nextUrl.pathname;

  if (protectedRoutes.some((r) => path.startsWith(r))) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/chat/:path*", "/account/:path*"],
};