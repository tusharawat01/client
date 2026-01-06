import { NextResponse } from "next/server";

export function middleware(request) {
  //   console.log('Middleware executed:', request);

  if (!request) {
    console.error("Request object is undefined!");
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value || "";

  if (!token) {
    return NextResponse.redirect(new URL("/clientLogin", request.url));
  }

  return NextResponse.next();
}
// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/clientDashboard/:path*", "/clientSpecial/:path*"],
};
