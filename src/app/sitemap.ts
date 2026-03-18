import type { MetadataRoute } from "next";
import { getAllCityPages, getAllStatePages } from "@/lib/cityData";

const SITE_URL = "https://bulkctc.com";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const cityPages = getAllCityPages();
  const statePages = getAllStatePages();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/available-locations`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  const stateRoutes: MetadataRoute.Sitemap = statePages.map(({ state }) => ({
    url: `${SITE_URL}/${state}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const cityRoutes: MetadataRoute.Sitemap = cityPages.map(({ state, city }) => ({
    url: `${SITE_URL}/${state}/${city}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...stateRoutes, ...cityRoutes];
}
