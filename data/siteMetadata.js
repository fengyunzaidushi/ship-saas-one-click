/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: "SAAS ONE CLICK",
  author: "name generator",
  headerTitle: "SAAS ONE CLICK",
  description: "a saas character name generator",
  language: "en-us",
  theme: "system", // system, dark or light
  siteUrl: process.env.NODE_ENV === 'production' 
    ? 'https://your-production-domain.com'  // 生产环境URL
    : 'http://localhost:3000',              // 开发环境URL
  siteRepo: "https://github.com/timlrx/tailwind-nextjs-starter-blog",
  siteLogo: `${process.env.BASE_PATH || ""}/static/images/logo.png`,
  socialBanner: `${process.env.BASE_PATH || ""}/static/images/twitter-card.png`,
  mastodon: "https://mastodon.social/@mastodonuser",
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
  stickyNav: false,
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
