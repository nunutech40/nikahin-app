import { db } from "./src/db";
import { features, packageFeatures } from "./src/db/schema";
import { eq, sql } from "drizzle-orm";

async function consolidateFeatures() {
    console.log("🛠️  Consolidating Duplicate Features (v2)...");

    const allFeatures = await db.query.features.findMany();

    // List of new features to ENSURE exist
    const newFeatures = [
        { code: "custom_domain", name: "Custom Domain", description: "Gunakan domain sendiri" },
        { code: "video_background", name: "Video Background", description: "Background video di undangan" },
        { code: "live_streaming", name: "Live Streaming", description: "Integrasi live streaming" },
        { code: "guest_filter", name: "Filter Tamu", description: "Filter grup tamu" },
        { code: "analytics_advanced", name: "Advanced Analytics", description: "Laporan tamu lengkap" },
        { code: "whatsapp_blast", name: "WhatsApp Blast", description: "Kirim massal via WA" },
        { code: "priority_support", name: "Priority Support", description: "Dukungan prioritas" },
        { code: "analytics_basic", name: "Basic Analytics", description: "Statistik pengunjung dasar" },
        { code: "cover_image", name: "Foto Sampul", description: "Upload foto sampul depan", isCore: true },
    ];

    for (const nf of newFeatures) {
        await db.insert(features).values({
            code: nf.code,
            name: nf.name,
            description: nf.description,
            isCore: nf.isCore || false
        }).onConflictDoUpdate({
            target: features.code,
            set: { name: nf.name, description: nf.description, isCore: nf.isCore || false }
        });
    }

    const allFeaturesUpdated = await db.query.features.findMany();

    const duplicates = [
        { keep: "custom_domain", remove: "custom-domain" },
        { keep: "video_background", remove: "video-background" },
        { keep: "live_streaming", remove: "live-streaming" },
        { keep: "gift_registry", remove: "digital-envelope" },
        { keep: "guest_filter", remove: "guest-filter" },
        { keep: "analytics_advanced", remove: "analytics-advanced" },
        { keep: "whatsapp_blast", remove: "whatsapp-blast" },
        { keep: "priority_support", remove: "priority-support" },
        { keep: "analytics_basic", remove: "analytics-basic" },
        { keep: "gallery_10", remove: "gallery-basic" },
        { keep: "basic_info", remove: "basic-invitation" },
    ];

    for (const d of duplicates) {
        const keepFeat = allFeaturesUpdated.find(f => f.code === d.keep);
        const removeFeat = allFeaturesUpdated.find(f => f.code === d.remove);

        if (keepFeat && removeFeat) {
            console.log(`  - Consolidating ${d.remove} -> ${d.keep}`);

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

            await db.delete(packageFeatures).where(eq(packageFeatures.featureId, removeFeat.id));
            await db.delete(features).where(eq(features.id, removeFeat.id));
        }
    }

    console.log("✅ Consolidation Finished!");
    process.exit(0);
}

consolidateFeatures();
