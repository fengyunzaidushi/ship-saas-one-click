interface SiteMetadata {
  title: string
  author: string
  headerTitle: string
  description: string
  language: string
  theme: 'system' | 'dark' | 'light'
  siteUrl: string
  siteRepo: string
  siteLogo: string
  socialBanner: string
  email: string
  github: string
  twitter: string
  facebook: string
  youtube: string
  linkedin: string
  locale: string
  newsletter: {
    provider: string
  }
  stickyNav: boolean
}

const siteMetadata: SiteMetadata = {
  title: 'Next.js Blog Template',
  author: 'Your Name',
  headerTitle: 'Blog',
  description: 'A blog created with Next.js and Tailwind.css',
  language: 'en-us',
  theme: 'system',
  siteUrl: 'https://your-domain.com',
  siteRepo: 'https://github.com/your-repo',
  siteLogo: '/static/images/logo.png',
  socialBanner: '/static/images/twitter-card.png',
  email: 'address@yoursite.com',
  github: 'https://github.com',
  twitter: 'https://twitter.com/Twitter',
  facebook: 'https://facebook.com',
  youtube: 'https://youtube.com',
  linkedin: 'https://www.linkedin.com',
  locale: 'en-US',
  newsletter: {
    provider: 'buttondown'
  },
  stickyNav: true,
}

export default siteMetadata 