import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/auth/login";

  if (!isAdminRoute && !isLoginRoute) {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAdmin = user?.app_metadata?.role === "admin";

  if (!user && isAdminRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (user && isAdminRoute && !isAdmin) {
    return NextResponse.redirect(
      new URL("/auth/login?error=unauthorized", req.url),
    );
  }

  if (user && isAdmin && isLoginRoute) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/auth/login"],
};
