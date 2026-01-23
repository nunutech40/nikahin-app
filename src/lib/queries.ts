import { db } from "@/db";
import { invitations, guests, users, visitorLogs } from "@/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import type { InvitationData } from "@/types/invitation";

/**
 * Fetch invitation data by slug including theme information and guests
 */
export async function getInvitationBySlug(slug: string) {
    try {
        const result = await db.query.invitations.findFirst({
            where: eq(invitations.slug, slug),
            with: {
                theme: true,
                user: {
                    columns: {
                        isActive: true
                    }
                },
                package: {
                    with: {
                        features: {
                            with: {
                                feature: true,
                            },
                        },
                    },
                },
                guests: {
                    orderBy: [desc(guests.createdAt)],
                    limit: 50,
                }
            },
        });

        if (!result) return null;

        // Calculate total visits from visitorLogs (already tracked)
        const visitCount = await db.select({
            count: sql<number>`count(${visitorLogs.id})`
        }).from(visitorLogs).where(eq(visitorLogs.invitationId, result.id));
        const totalViews = Number(visitCount[0]?.count || 0);

        return {
            invitationId: result.id,
            themeId: result.theme?.slug || "basic",
            themeConfig: result.theme?.config as any,
            packageSlug: result.package?.slug || "bronze",
            data: result.content as InvitationData,
            features: result.package.features.map(pf => pf.feature.code),
            guests: result.guests,
            isOwnerActive: result.user?.isActive || false,
            totalViews: totalViews,
        };
    } catch (error) {
        console.error("❌ Error fetching invitation:", error);
        return null;
    }
}
/**
 * Fetch all invitations belonging to a specific user
 */
export async function getUserInvitations(userId: number) {
    try {
        const results = await db.query.invitations.findMany({
            where: eq(invitations.userId, userId),
            orderBy: [desc(invitations.createdAt)],
            with: {
                theme: true,
            }
        });

        // Fetch visit counts for each invitation
        const invitationsWithViews = await Promise.all(results.map(async (inv) => {
            const countResult = await db.select({
                count: sql<number>`count(${visitorLogs.id})`
            }).from(visitorLogs).where(eq(visitorLogs.invitationId, inv.id));

            return {
                ...inv,
                totalViews: Number(countResult[0]?.count || 0)
            };
        }));

        return invitationsWithViews;
    } catch (error) {
        console.error("❌ Error fetching user invitations:", error);
        return [];
    }
}

/**
 * Fetch a specific invitation for editing, with ownership check
 */
export async function getInvitationForEdit(invitationId: number, userId: number) {
    try {
        const result = await db.query.invitations.findFirst({
            where: and(
                eq(invitations.id, invitationId),
                eq(invitations.userId, userId)
            ),
            with: {
                theme: true,
                package: {
                    with: {
                        features: {
                            with: {
                                feature: true
                            }
                        }
                    }
                }
            }
        });

        if (!result) return null;

        return {
            invitationId: result.id,
            themeId: result.theme?.slug || "basic",
            data: result.content as InvitationData,
            features: result.package.features.map(pf => pf.feature.code),
        };
    } catch (error) {
        console.error("❌ Error fetching invitation for edit:", error);
        return null;
    }
}
