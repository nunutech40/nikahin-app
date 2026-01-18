import { db } from "./src/db";
import { features, packageFeatures } from "./src/db/schema";
import { eq, sql } from "drizzle-orm";

async function consolidateFeatures() {
    console.log("🛠️  Consolidating Duplicate Features...");

    const allFeatures = await db.query.features.findMany();
    const duplicates = [
        { keep: "google_maps", remove: "google-maps" },
        { keep: "custom_theme", remove: "custom-theme" },
        { keep: "gift_registry", remove: "gift-registry" },
        { keep: "rsvp_basic", remove: "rsvp" },
        { keep: "love_story", remove: "love-story" },
        { keep: "gallery_unlimited", remove: "unlimited-gallery" },
        { keep: "background_music", remove: "music-player" },
    ];

    for (const d of duplicates) {
        const keepFeat = allFeatures.find(f => f.code === d.keep);
        const removeFeat = allFeatures.find(f => f.code === d.remove);

        if (keepFeat && removeFeat) {
            console.log(`  - Consolidating ${d.remove} -> ${d.keep}`);

            // Re-point relations from removeFeat to keepFeat (handle conflicts)
            await db.execute(sql`
                UPDATE package_features 
                SET feature_id = ${keepFeat.id} 
                WHERE feature_id = ${removeFeat.id}
                AND NOT EXISTS (
                    SELECT 1 FROM package_features pf2 
                    WHERE pf2.package_id = package_features.package_id 
                    AND pf2.feature_id = ${keepFeat.id}
                )
            `);

            // Delete old relations for removeFeat that would have been duplicates
            await db.delete(packageFeatures).where(eq(packageFeatures.featureId, removeFeat.id));

            // Delete the duplicate feature
            await db.delete(features).where(eq(features.id, removeFeat.id));
        }
    }

    console.log("✅ Consolidation Finished!");
    process.exit(0);
}

consolidateFeatures();
