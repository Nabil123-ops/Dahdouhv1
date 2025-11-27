import { auth } from "@/auth";
import { NextResponse, type NextRequest } from "next/server"; // Import NextRequest

// ⭐ Use NextRequest from next/server to ensure req.nextUrl exists
interface AuthRequest extends NextRequest {
  auth?: any; 
}

export default auth((req: AuthRequest) => {
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
