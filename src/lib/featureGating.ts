import { db } from "@/db";
import { users, packageFeatures, features } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Check if a user has access to a specific feature based on their package
 * @param userId - The user's ID
 * @param featureCode - The feature code to check (e.g., "custom_domain", "unlimited_gallery")
 * @returns Promise<boolean> - true if user has access, false otherwise
 */
export async function hasFeatureAccess(
    userId: number,
    featureCode: string
): Promise<boolean> {
    try {
        // Get user with their package
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
            with: {
                package: {
                    with: {
                        features: {
                            with: {
                                feature: true,
                            },
                        },
                    },
                },
            },
        });

        if (!user || !user.package) {
            return false;
        }

        // 1. Get feature metadata to check if it's core
        const featureData = await db.query.features.findFirst({
            where: eq(features.code, featureCode),
        });

        if (featureData?.isCore) {
            return true;
        }

        // 2. Check if the feature is in the user's package
        const hasFeature = user.package.features.some(
            (pf) => pf.feature.code === featureCode
        );

        return hasFeature;
    } catch (error) {
        console.error("Error checking feature access:", error);
        return false;
    }
}

/**
 * Get all features available to a user based on their package
 * @param userId - The user's ID
 * @returns Promise<string[]> - Array of feature codes the user has access to
 */
export async function getUserFeatures(userId: number): Promise<string[]> {
    try {
        const allCoreFeatures = await db.query.features.findMany({
            where: eq(features.isCore, true),
        });

        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
            with: {
                package: {
                    with: {
                        features: {
                            with: {
                                feature: true,
                            },
                        },
                    },
                },
            },
        });

        const coreCodes = allCoreFeatures.map(f => f.code);

        if (!user || !user.package) {
            return coreCodes;
        }

        const packageCodes = user.package.features.map((pf) => pf.feature.code);

        // Return unique codes from both core and package
        return Array.from(new Set([...coreCodes, ...packageCodes]));
    } catch (error) {
        console.error("Error getting user features:", error);
        return [];
    }
}

/**
 * Get user's package information with all features
 * @param userId - The user's ID
 * @returns Promise with package info and features
 */
export async function getUserPackageInfo(userId: number) {
    try {
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
            with: {
                package: {
                    with: {
                        features: {
                            with: {
                                feature: true,
                            },
                        },
                    },
                },
            },
        });

        if (!user || !user.package) {
            return null;
        }

        return {
            package: {
                id: user.package.id,
                name: user.package.name,
                slug: user.package.slug,
                price: user.package.price,
            },
            features: user.package.features.map((pf) => ({
                code: pf.feature.code,
                name: pf.feature.name,
                description: pf.feature.description,
                isCore: pf.feature.isCore,
            })),
        };
    } catch (error) {
        console.error("Error getting user package info:", error);
        return null;
    }
}

/**
 * Check if user has a specific package tier
 * @param userId - The user's ID
 * @param packageSlug - Package slug to check (e.g., "bronze", "silver", "gold")
 * @returns Promise<boolean>
 */
export async function hasPackage(
    userId: number,
    packageSlug: string
): Promise<boolean> {
    try {
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
            with: {
                package: true,
            },
        });

        return user?.package?.slug === packageSlug;
    } catch (error) {
        console.error("Error checking package:", error);
        return false;
    }
}
