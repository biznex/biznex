// middleware.js at root
import { NextResponse } from "next/server";

export function middleware(req) {
  const { cookies, url } = req;
  const token = cookies.get("utoken");

  // Protect /subdomain pages
  if (url.includes("/subdomain") && !token) {
    return NextResponse.redirect(new URL("/subdomain-login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/subdomain/:path*"],
};
