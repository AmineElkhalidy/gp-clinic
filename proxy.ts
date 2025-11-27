import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export default async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Public paths that don't require authentication
  const publicPaths = ["/login", "/api/auth", "/_next", "/favicon.ico"]
  
  // Check if the path is public
  const isPublicPath = publicPaths.some((p) => path.startsWith(p))
  
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Get the token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // If no token and trying to access protected route, redirect to login
  if (!token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", path)
    return NextResponse.redirect(loginUrl)
  }

  // If user is authenticated and trying to access login, redirect to dashboard
  if (token && path === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Role-based access control
  if (path.startsWith("/settings/users") && token.role !== "DOCTOR") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
