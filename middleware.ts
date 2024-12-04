import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export async function middleware(request: NextRequest) {
  // 1. 处理认证回调路径
  if (request.nextUrl.pathname === "/auth/callback") {
    return await updateSession(request);
  }

  // 2. 处理其他认证路径
  if (request.nextUrl.pathname.startsWith("/auth")) {
    return await updateSession(request);
  }

  // 3. 处理根路径重定向
  if (request.nextUrl.pathname === "/") {
    const defaultLocale = routing.defaultLocale;
    return Response.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  // 4. 处理多语言路由
  const handleI18nRouting = createMiddleware({
    ...routing,
    defaultLocale: routing.defaultLocale,
    locales: routing.locales,
    localePrefix: "always",
  });

  const i18nResponse = handleI18nRouting(request);
  return i18nResponse;
}

// 更新 matcher 配置
export const config = {
  matcher: [
    "/",
    "/(en|zh)/:path*",
    "/((?!_next|_vercel|api|.*\\..*).*)",
    "/auth/callback",
    "/auth/:path*",
  ],
};
