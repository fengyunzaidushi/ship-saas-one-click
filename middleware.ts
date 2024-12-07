import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// API 路径前缀常量
const API_PREFIX = "/api";
// API 路径白名单
const API_WHITELIST = [
  `${API_PREFIX}/webhook/stripe`,
  `${API_PREFIX}/auth/check-session`,
  `${API_PREFIX}/create-checkout-session`,
  `${API_PREFIX}/profile`,
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 添加调试日志
  console.log("Middleware processing path:", pathname);

  // 1. API 路由处理
  if (pathname.startsWith(API_PREFIX)) {
    // 为 webhook 路由添加特殊处理
    if (pathname.startsWith(`${API_PREFIX}/webhook/stripe`)) {
      console.log("Webhook request detected:", pathname);
      return; // 直接放行 webhook 请求
    }

    // 检查是否在白名单中
    if (API_WHITELIST.some((path) => pathname.startsWith(path))) {
      console.log("Whitelisted API path:", pathname);
      return; // 白名单 API 直接放行
    }

    // 其他 API 请求需要进行会话验证
    return await updateSession(request);
  }

  // 2. 认证路由处理
  if (pathname === "/auth/callback" || pathname.startsWith("/auth")) {
    return await updateSession(request);
  }

  // 3. 多语言路由处理
  const handleI18nRouting = createMiddleware({
    ...routing,
    locales: routing.locales,
    localePrefix: "as-needed",
    defaultLocale: "en",
    localeDetection: true,
    pathnames: {
      "/": "/",
      "/tags": "/tags",
      "/blog": "/blog",
      "/payment/success": "/payment/success",
      "/payment/cancel": "/payment/cancel",
    },
  });

  const response = handleI18nRouting(request);

  // 设置中文本地化 cookie
  if (pathname.startsWith("/zh")) {
    response.headers.set("Set-Cookie", "NEXT_LOCALE=zh; Path=/");
  }

  return response;
}

// 更新 matcher 配置
export const config = {
  matcher: [
    // 包含需要处理的 API 路径，但排除静态资源
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
    "/",
    "/(zh)/:path*",
    "/payment/:path*",
    "/api/:path*", // 添加 API 路径匹配
  ],
};
