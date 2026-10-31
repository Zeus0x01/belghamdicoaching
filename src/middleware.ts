import { NextResponse, type NextRequest } from "next/server";

const ADMIN_COOKIE = "bc_admin";

async function tokenFor(password: string): Promise<string> {
  const data = new TextEncoder().encode(`${password}::belghamdi-admin::v1`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const password = process.env.ADMIN_PASSWORD || "belghamdi-demo";
  const expected = await tokenFor(password);
  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  const authenticated = cookie === expected;
  const isLogin = pathname === "/admin/login";

  if (!authenticated && !isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (authenticated && isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
