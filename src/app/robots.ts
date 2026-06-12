import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";
import { getRobotsConfig } from "@/server/services/seo.service";

export default async function robots(): Promise<MetadataRoute.Robots> {
  try {
    const config = await getRobotsConfig();
    return {
      rules: [
        {
          userAgent: "*",
          allow: config.allow,
          disallow: config.disallow,
        },
      ],
      sitemap: config.sitemap,
    };
  } catch {
    return {
      rules: [
        {
          userAgent: "*",
          allow: "/",
          disallow: [
            "/admin/",
            "/AllData",
            "/participantregistrationdatadekh",
            "/volunteerdatadekh",
            "/ngoregistrationdatadekh",
            "/abstractdatadekh",
            "/organiserdatadekh",
            "/schooldata",
            "/noticeboarddata",
            "/addkeynotespeaker",
            "/addvcdirector",
            "/addwishesreceived",
            "/api/",
          ],
        },
      ],
      sitemap: `${SITE_URL}/sitemap.xml`,
    };
  }
}
