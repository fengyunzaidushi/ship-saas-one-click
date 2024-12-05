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

  // 3. 处理多语言路由
  const handleI18nRouting = createMiddleware({
    ...routing,
    locales: routing.locales,
    localePrefix: "as-needed",
    defaultLocale: "en",
    localeDetection: true, // 启用语言检测
    // 添加语言持久化配置
    pathnames: {
      "/": "/",
      "/tags": "/tags",
      "/blog": "/blog",
      // 添加其他路径...
    },
  });

  const response = handleI18nRouting(request);

  // 添加语言cookie以保持状态
  if (request.nextUrl.pathname.startsWith("/zh")) {
    response.headers.set("Set-Cookie", "NEXT_LOCALE=zh; Path=/");
  }

  return response;
}

// 更新 matcher 配置，确保捕获所有需要的路径
export const config = {
  matcher: [
    // 匹配所有路径，但排除静态资源和API路由
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).+)",
    "/",
    "/(zh)/:path*",
  ],
};
