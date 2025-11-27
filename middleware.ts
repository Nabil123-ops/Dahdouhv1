import { auth } from "@/auth";
import { NextResponse } from "next/server";
// Import NextRequest from next/server
import type { NextRequest } from "next/server"; 

// ⭐ FIX: Change AuthRequest to extend NextRequest instead of the generic Request
// NextRequest already includes the 'nextUrl' property.
interface AuthRequest extends NextRequest {
  auth?: any; // The property added by NextAuth/Auth.js middleware
}

export default auth((req: AuthRequest) => {
  // Line 13 will now correctly access req.nextUrl
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
