import { db } from "./src/db";
import { packages, features, packageFeatures } from "./src/db/schema";
import { eq, inArray } from "drizzle-orm";

async function fixFeatureMatrix() {
    console.log("🛠️  Fixing Feature Matrix and Packages...");

    try {
        // 1. Core / Basic Features (Bronze level)
        const bronzeFeatureCodes = [
            "basic_info", "countdown", "google_maps", "guestbook",
            "rsvp_basic", "single_event", "basic-invitation", "rsvp",
            "countdown", "gallery-basic", "google-maps", "analytics-basic"
        ];

        console.log("  - Setting basic features as Global/Core...");
        await db.update(features)
            .set({ isCore: true })
            .where(inArray(features.code, bronzeFeatureCodes));

        // 2. Ensure Packages exist with correct structure
        console.log("  - Updating package list...");
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

        // 3. Re-map Features
        console.log("  - Re-mapping features to packages...");
        const allPkgs = await db.query.packages.findMany();
        const allFeats = await db.query.features.findMany();

        const pkgMap = new Map(allPkgs.map(p => [p.slug, p.id]));
        const featMap = new Map(allFeats.map(f => [f.code, f.id]));

        // Clear existing mappings to avoid duplicates/mess (OPTIONAL but recommended for a clean state)
        // await db.delete(packageFeatures);

        const silverFeatures = ["rsvp_export", "unlimited_events", "gallery_10", "background_music", "quotes", "music-player", "digital-envelope"];
        const goldFeatures = [...silverFeatures, "love_story", "gift_registry", "custom_theme", "gallery_unlimited", "remove_branding", "no-watermark", "analytics-advanced"];
        const platinumFeatures = [...goldFeatures, "custom-domain", "video-background", "live-streaming", "guest-filter", "whatsapp-blast", "priority-support"];

        const mapping = [
            { slug: "silver", codes: silverFeatures },
            { slug: "gold", codes: goldFeatures },
            { slug: "platinum", codes: platinumFeatures },
            { slug: "demo", codes: platinumFeatures }, // Demo has everything
        ];

        for (const m of mapping) {
            const pkgId = pkgMap.get(m.slug);
            if (!pkgId) continue;

            // Delete existing for this package to prevent duplicates
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

        console.log("✅ Feature Matrix Fixed Successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error fixing feature matrix:", error);
        process.exit(1);
    }
}

fixFeatureMatrix();
