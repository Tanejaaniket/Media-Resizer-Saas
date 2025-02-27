import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

//* Client side
const isPublicRoute = createRouteMatcher(["/signup", "/signin", "/", "/home"]);

const isPublicApiRoute = createRouteMatcher(["/api/video"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const currentUrl = new URL(req.url);
  const isAccessingHomePage = currentUrl.pathname === "/home";
  const isApiRequest = currentUrl.pathname.startsWith("/api");

  //* If user is signed in and trying to access a public route, redirect to home
  if (userId && isPublicRoute(req) && !isAccessingHomePage) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  if (!userId) {
    if (!isPublicRoute(req) && !isPublicApiRoute(req)) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    if (isApiRequest && isPublicApiRoute(req)) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
