import { NextRequest, NextResponse } from "next/server";

export const middleware = async (request: Readonly<NextRequest>) => {
  const origin = request.nextUrl.origin;
  const requestHeaders = new Headers(request.headers);

  try {
    const userAgent = requestHeaders.get("user-agent");
    if (userAgent?.includes("KAKAOTALK")) {
      return NextResponse.redirect(`kakaotalk://web/openExternal?url=${encodeURIComponent(request.url)}`);
    }

    const pathname = request.nextUrl.pathname;

    const no_auth = ["/auth"]; // 로그인이 되어 있지 않은 상태에서만 접근 가능한 페이지
    const need_auth = ["/only_login"]; // 로그인이 되어 있어야 접근 가능한 페이지

    const check_no_auth = no_auth.some((path) => pathname.includes(path));
    const check_need_auth = need_auth.some((path) => pathname.includes(path));
    if(!check_no_auth && !check_need_auth) return NextResponse.next();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: request.cookies.get("refresh_token")?.value ?? "",
      }),
    });
    const data = await response.json();

    if (check_need_auth) {
      if (data.success) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL("/auth/login", origin));
      }
    }

    if (check_no_auth) {
      if (data.success) {
        return NextResponse.redirect(new URL("/", origin));
      } else {
        return NextResponse.next();
      }
    }

  } catch {
    return NextResponse.redirect(new URL("/auth/login", origin));
  }
};

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico|public|manifest.json).*)",
};
