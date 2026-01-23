import { db } from "@/db";
import { invitations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { MetadataRoute } from "next";

/**
 * ============================================
 * DYNAMIC SITEMAP GENERATOR
 * ============================================
 * Generates sitemap.xml for SEO indexing.
 * Includes:
 * - Landing page
 * - Pricing page
 * - All published invitations
 * - Demo pages
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://nikahin.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/pricing`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/login`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/register`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/demo`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
    ];

    // Dynamic pages: Published invitations
    let invitationPages: MetadataRoute.Sitemap = [];
    
    try {
        const publishedInvitations = await db.query.invitations.findMany({
            where: eq(invitations.isPublished, true),
            columns: {
                slug: true,
                updatedAt: true,
            },
        });

        invitationPages = publishedInvitations.map((inv) => ({
            url: `${BASE_URL}/${inv.slug}`,
            lastModified: inv.updatedAt,
            changeFrequency: "weekly" as const,
            priority: 0.6,
        }));
    } catch (error) {
        console.error("❌ Error generating sitemap:", error);
    }

    return [...staticPages, ...invitationPages];
}
