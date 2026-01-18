"use server";

import { db } from "@/db";
import { themes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { DynamicThemeConfig } from "@/types/invitation";
import { revalidatePath } from "next/cache";

export async function saveThemeConfig(slug: string, config: DynamicThemeConfig) {
    try {
        // 1. Check if theme exists
        const existingTheme = await db.query.themes.findFirst({
            where: eq(themes.slug, slug),
        });

        if (existingTheme) {
            // Update existing
            await db.update(themes)
                .set({
                    config: config,
                    updatedAt: new Date()
                })
                .where(eq(themes.slug, slug));
        } else {
            // Create new theme if not found
            await db.insert(themes).values({
                slug: slug,
                name: slug.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                config: config,
                category: "dynamic",
                isFree: false
            });
        }

        revalidatePath("/admin/themes");
        revalidatePath(`/admin/themes/builder/${slug}`);

        return { success: true };
    } catch (error) {
        console.error("Failed to save theme config:", error);
        return { success: false, error: "Failed to save configuration" };
    }
}

export async function getThemeConfig(slug: string) {
    try {
        const theme = await db.query.themes.findFirst({
            where: eq(themes.slug, slug),
        });

        if (!theme) {
            return { success: false, error: "Theme not found" };
        }

        return { success: true, config: theme.config as DynamicThemeConfig };
    } catch (error) {
        console.error("Failed to fetch theme config:", error);
        return { success: false, error: "Failed to fetch configuration" };
    }
}
