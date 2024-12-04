import { withContentlayer } from "next-contentlayer2";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  images: {
    domains: ["picsum.photos"],
    dangerouslyAllowSVG: true,
    unoptimized: true,
  },
  reactStrictMode: true,
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  eslint: {
    dirs: ["app", "components", "layouts", "scripts"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
  typescript: {
    // ignoreBuildErrors: true,
  },
  productionBrowserSourceMaps: false,
  experimental: {
    serverSourceMaps: false,
  },
  webpack: (config, { dev, isServer }) => {
    config.cache = false; 
    if (!dev) {
      config.cache = {
        type: "memory",
        maxGenerations: 1,
      };
    }

    return config;
  },
};

export default withNextIntl(withContentlayer(nextConfig));
