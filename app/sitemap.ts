import { MetadataRoute } from "next";
import { allBlogs } from "contentlayer/generated";
import siteMetadata from "@/data/siteMetadata";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl;

  const blogRoutes = allBlogs
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${siteUrl}${post.path}`,
      lastModified: post.lastmod || post.date,
    }));

  const defaultRoutes = ["", "blog", "projects", "tags"].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  const localeRoutes = ["zh"].flatMap((locale) =>
    ["", "blog", "projects", "tags"].map((route) => ({
      url: `${siteUrl}/${locale}/${route}`,
      lastModified: new Date().toISOString().split("T")[0],
    }))
  );

  return [...defaultRoutes, ...localeRoutes, ...blogRoutes];
}
