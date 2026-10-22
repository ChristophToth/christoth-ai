import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/marketplace-practice", "/marketplace-practice.html"],
    },
    sitemap: "https://christoth.work/sitemap.xml",
  };
}
