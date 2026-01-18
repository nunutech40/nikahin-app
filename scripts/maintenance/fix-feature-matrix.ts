import { db } from "./src/db";
import { packages, features, packageFeatures } from "./src/db/schema";
import { eq, inArray } from "drizzle-orm";

async function fixFeatureMatrix() {
    console.log("🛠️  Fixing Feature Matrix and Packages (v2)...");

    try {
        // 1. Core / Basic Features (Bronze level) - Now Includes Basic Theme settings
        const coreFeatureCodes = [
            "basic_info", "countdown", "google_maps", "guestbook",
            "rsvp_basic", "single_event", "cover_image"
        ];

        console.log("  - Setting basic features as Global/Core...");
        await db.update(features)
            .set({ isCore: true })
            .where(inArray(features.code, coreFeatureCodes));

        // 2. Ensure Packages exist
        const packageUpdates = [
            { slug: "bronze", name: "Bronze", price: 0, description: "Paket Dasar (Gratis)" },
            { slug: "silver", name: "Silver", price: 150000, description: "Paket Best Value" },
            { slug: "gold", name: "Gold", price: 300000, description: "Paket Premium Eksklusif" },
            { slug: "platinum", name: "Platinum", price: 500000, description: "Paket Ultra Lengkap" },
            { slug: "demo", name: "Demo", price: 0, description: "Coba Semua Fitur" },
        ];

        for (const p of packageUpdates) {
            await db.insert(packages).values(p).onConflictDoUpdate({
                target: packages.slug,
                set: { name: p.name, price: p.price, description: p.description }
            });
        }

        // 3. Re-map Features with better hierarchy
        const allPkgs = await db.query.packages.findMany();
        const allFeats = await db.query.features.findMany();
        const pkgMap = new Map(allPkgs.map(p => [p.slug, p.id]));
        const featMap = new Map(allFeats.map(f => [f.code, f.id]));

        // SILVER: Now includes Gallery AND Love Story (as requested)
        const silverFeatures = ["rsvp_export", "unlimited_events", "gallery_10", "background_music", "quotes", "love_story"];

        // GOLD: All Silver + advanced customizations
        const goldFeatures = [...silverFeatures, "gift_registry", "custom_theme", "gallery_unlimited", "remove_branding", "no_watermark", "analytics_advanced"];

        // PLATINUM: Everything
        const platinumFeatures = [...goldFeatures, "custom_domain", "video_background", "live_streaming", "guest_filter", "whatsapp_blast", "priority_support"];

        const mapping = [
            { slug: "silver", codes: silverFeatures },
            { slug: "gold", codes: goldFeatures },
            { slug: "platinum", codes: platinumFeatures },
            { slug: "demo", codes: platinumFeatures },
        ];

        for (const m of mapping) {
            const pkgId = pkgMap.get(m.slug);
            if (!pkgId) continue;

            await db.delete(packageFeatures).where(eq(packageFeatures.packageId, pkgId));

            for (const code of m.codes) {
                const featId = featMap.get(code);
                if (featId) {
                    await db.insert(packageFeatures).values({
                        packageId: pkgId,
                        featureId: featId
                    });
                }
            }
        }

        console.log("✅ Feature Matrix Fixed Successfully (v2)!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error fixing feature matrix:", error);
        process.exit(1);
    }
}

fixFeatureMatrix();
