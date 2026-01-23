import { MetadataRoute } from "next";

/**
 * ============================================
 * ROBOTS.TXT GENERATOR
 * ============================================
 * Controls search engine crawling behavior.
 * - Allows indexing of public pages
 * - Blocks admin and dashboard areas
 * - Points to sitemap for efficient crawling
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://nikahin.app";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: [
                    "/",
                    "/pricing",
                    "/demo",
                    "/login",
                    "/register",
                ],
                disallow: [
                    "/dashboard/",
                    "/admin/",
                    "/agency/",
                    "/api/",
                ],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
