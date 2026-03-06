import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

const authRoutes = ["/login"];

export default function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const session = getSessionCookie(request);

  const isPublic = path === "/" || path.startsWith("/post/");
  const isAuthPage = authRoutes.includes(path);

  // 1. Public routes → always allowed
  if (isPublic) {
    return NextResponse.next();
  }

  // 2. If NOT logged in → block protected routes
  if (!(session || isAuthPage)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. If LOGGED IN → prevent accessing auth routes
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (session && isPublic) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next|api/auth).*)", "/", "/trpc(.*)"],
};
