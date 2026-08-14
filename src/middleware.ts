import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role
  const pathname = req.nextUrl.pathname
  const isAuthPage = pathname.startsWith("/auth")
  const isAdminPage = pathname.startsWith("/admin")
  const isTeacherPage = pathname.startsWith("/teacher") && !pathname.startsWith("/teacher/apply")
  const isProtectedPage = pathname.startsWith("/dashboard") ||
    isTeacherPage ||
    pathname.startsWith("/classroom") ||
    isAdminPage

  // Redirect logged-in users away from auth pages
  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
    }
    return NextResponse.next()
  }

  // Redirect unauthenticated users to login
  if (isProtectedPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/login", req.nextUrl))
  }

  // Role-based access control
  if (isAdminPage && userRole !== "ADMIN") {
    const redirectPath = userRole === "TEACHER" ? "/teacher" : "/dashboard"
    return NextResponse.redirect(new URL(redirectPath, req.nextUrl))
  }

  if (isTeacherPage && userRole !== "TEACHER" && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
