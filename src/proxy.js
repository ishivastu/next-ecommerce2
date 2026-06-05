import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
export function proxy(request) {
  const token = request.cookies.get("accessToken")?.value;
  const pathname = request.nextUrl.pathname;
  // Redirect logged-in users away from login/signup
  if (pathname === "/login" || pathname === "/signup") {
    if (token) {
      return NextResponse.redirect(
        new URL("/", request.url)
      );
    }
  }
  // Protected routes
  const protectedRoutes = [
    "/cart",
    "/purchase-success",
    "/purchase-cancel",
    "/"
  ];
  if (protectedRoutes.includes(pathname)) {
    if (!token) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }
  }
  // Admin route
  if (pathname === "/secret-dashboard") {
    if (!token) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }
    try {
      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET_KEY
      );
      
      if (decoded.role !== "admin") {
        return NextResponse.redirect(
          new URL("/", request.url)
        );
      }
    } catch (error) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/cart",
    "/purchase-success",
    "/purchase-cancel",
    "/secret-dashboard",
  ],
};

