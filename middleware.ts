import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function getLocaleFromPath(url: URL) {
  const pathSegments = url.pathname.split("/");
  const localeSegmentIndex = pathSegments.indexOf("ja"); // Change to your locale identifier
  if (localeSegmentIndex === 1) {
    return "ja";
  }
  return "en";
}

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "None";
  const isCrawler = /bot|crawler|spider/i.test(userAgent);
  if (isCrawler) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get("ageConfirmed");
  const locale = getLocaleFromPath(new URL(request.url));
  if (!cookie) {
    let ageConfirmationUrl = "";
    if (locale === "en") {
      ageConfirmationUrl = "/age-confirmation";
    } else {
      ageConfirmationUrl = `/${locale}/age-confirmation`;
    }

    const url = new URL(ageConfirmationUrl, request.url);
    url.searchParams.set("from", request.url);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/categories/:path*",
    "/search/:path*",
    "/videos/:path*",
    "/",

    "/ja/categories/:path*",
    "/ja/search/:path*",
    "/ja/videos/:path*",
    "/ja/",
  ],
};
