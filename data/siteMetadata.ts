interface SiteMetadata {
  title: string;
  author: string;
  headerTitle: string;
  description: string;
  keywords: string;
  language: string;
  theme: "system" | "dark" | "light";
  siteUrl: string;
  siteRepo: string;
  siteLogo: string;

  socialBanner: string;
  email: string;
  github: string;
  x: string;
  facebook: string;
  youtube: string;
  linkedin: string;
  threads: string;
  instagram: string;
  medium: string;
  bluesky: string;
  locale: string;
  stickyNav: boolean;
  analytics: {
    umamiAnalytics: {
      umamiWebsiteId: string;
    };
  };
  newsletter: {
    provider: string;
  };
  search: {
    provider: string;
    kbarConfig: {
      searchDocumentsPath: string;
    };
  };
}

const siteMetadata: SiteMetadata = {
  title: "一键启动你的AI SaaS",
  author: "Atalas",
  headerTitle: "一键启动你的AI SaaS",
  description:
    "一站式AI SaaS启动模板，基于Next.js和Supabase构建。集成用户认证、Stripe支付和多语言支持，助力开发者快速将AI创意转化为产品。一键部署，立即开始你的SaaS创业之旅。",
  keywords:
    "AI SaaS模板, 一键启动SaaS, 一键部署SaaS, SaaS快速启动模板, AI创业模板, SaaS网站生成器, 快速搭建SaaS, AI SaaS脚手架, Next.js SaaS模板, Supabase SaaS模板, 开发者工具, Stripe支付集成, 用户认证系统, 多语言SaaS, 技术创业工具, 独立开发者模板, 现代SaaS技术栈, AI产品开发, 国际化SaaS模板, Vercel一键部署",
  language: "zh-CN",
  theme: "system", // system, dark or light

  siteUrl:
    process.env.NODE_ENV === "production"
      ? "https://shipsaas1click.com" // 生产环境URL
      : "http://localhost:3000", // 开发环境URL
  siteRepo: "https://github.com/fengyunzaidushi/ship-saas-one-click.git",
  siteLogo: `${process.env.BASE_PATH || ""}/static/images/logo.png`,
  socialBanner: `${process.env.BASE_PATH || ""}/static/images/twitter-card.png`,
  email: "address@yoursite.com",
  github: "https://github.com",
  x: "https://twitter.com/x",
  facebook: "https://facebook.com",
  youtube: "https://youtube.com",
  linkedin: "https://www.linkedin.com",
  threads: "https://www.threads.net",
  instagram: "https://www.instagram.com",
  medium: "https://medium.com",
  bluesky: "https://bsky.app/",
  locale: "en-US",
  stickyNav: true,
  analytics: {
    umamiAnalytics: {
      umamiWebsiteId: process.env.NEXT_UMAMI_ID,
    },
  },
  newsletter: {
    provider: "buttondown",
  },

  search: {
    provider: "kbar",
    kbarConfig: {
      searchDocumentsPath: `${process.env.BASE_PATH || ""}/search.json`,
    },
  },
};

export default siteMetadata;
