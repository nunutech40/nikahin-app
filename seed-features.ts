import { db } from "./src/db";
import { features, packages, packageFeatures } from "./src/db/schema";
import { eq, inArray } from "drizzle-orm";

async function seedFeaturesAndPackages() {
    console.log("🌱 Seeding/Resetting features and packages...");

    // 1. Define Features
    const featuresList = [
        // Core Features
        { code: "basic-invitation", name: "Undangan Digital Basic", description: "Undangan digital dengan desain template standar", isCore: true },
        { code: "rsvp", name: "RSVP Tamu", description: "Fitur konfirmasi kehadiran tamu", isCore: true },
        { code: "guestbook", name: "Buku Tamu Digital", description: "Tamu dapat meninggalkan ucapan", isCore: true },
        { code: "countdown", name: "Countdown Timer", description: "Hitung mundur menuju hari H", isCore: true },
        { code: "gallery-basic", name: "Galeri Foto (Max 5)", description: "Upload maksimal 5 foto", isCore: true },
        { code: "google-maps", name: "Google Maps Integration", description: "Lokasi acara con peta interaktif", isCore: true },

        // Premium Features
        { code: "custom-domain", name: "Custom Domain", description: "Gunakan domain sendiri (e.g., andi-rina.com)", isCore: false },
        { code: "unlimited-gallery", name: "Galeri Foto Unlimited", description: "Upload foto tanpa batas", isCore: false },
        { code: "video-background", name: "Video Background", description: "Background video di undangan", isCore: false },
        { code: "music-player", name: "Music Player", description: "Musik latar yang bisa dipilih", isCore: false },
        { code: "live-streaming", name: "Live Streaming Integration", description: "Integrasi dengan YouTube/Zoom untuk live streaming", isCore: false },
        { code: "gift-registry", name: "Gift Registry", description: "Daftar hadiah yang diinginkan", isCore: false },
        { code: "digital-envelope", name: "Amplop Digital", description: "Terima transfer langsung dengan QR Code", isCore: false },
        { code: "guest-filter", name: "Filter Tamu", description: "Buat undangan berbeda untuk grup tamu berbeda", isCore: false },
        { code: "analytics-basic", name: "Analytics Basic", description: "Lihat jumlah pengunjung dan RSVP", isCore: false },
        { code: "analytics-advanced", name: "Analytics Advanced", description: "Analytics lengkap: device, browser, waktu kunjungan", isCore: false },
        { code: "whatsapp-blast", name: "WhatsApp Blast", description: "Kirim undangan massal via WhatsApp", isCore: false },
        { code: "custom-theme", name: "Custom Theme", description: "Request desain tema khusus sesuai keinginan", isCore: false },
        { code: "no-watermark", name: "Tanpa Watermark", description: "Undangan tanpa logo Nikahin", isCore: false },
        { code: "priority-support", name: "Priority Support", description: "Dukungan prioritas via WhatsApp", isCore: false },
    ];

    // Upsert Features
    for (const feature of featuresList) {
        await db.insert(features)
            .values(feature)
            .onConflictDoUpdate({
                target: features.code,
                set: {
                    name: feature.name,
                    description: feature.description,
                    isCore: feature.isCore
                }
            });
    }

    const allFeatures = await db.select().from(features);
    console.log(`✅ Synced ${allFeatures.length} features`);

    // 2. Define Packages
    const packagesList = [
        { slug: "bronze", name: "Bronze Package", description: "Dasar & Elegan", price: 50000 },
        { slug: "silver", name: "Silver Package", description: "Populer & Lengkap", price: 150000 },
        { slug: "gold", name: "Gold Package", description: "Premium & Eksklusif", price: 300000 },
    ];

    for (const pkg of packagesList) {
        await db.insert(packages)
            .values(pkg)
            .onConflictDoUpdate({
                target: packages.slug,
                set: {
                    name: pkg.name,
                    description: pkg.description,
                    price: pkg.price
                }
            });
    }

    const allPackages = await db.select().from(packages);
    console.log(`✅ Synced ${allPackages.length} packages`);

    // 3. Reset Mapping and Apply Recommendations
    await db.delete(packageFeatures);

    const getFeatureId = (code: string) => allFeatures.find(f => f.code === code)?.id;
    const coreFeatureIds = allFeatures.filter(f => f.isCore).map(f => f.id);

    for (const pkg of allPackages) {
        let featureIdsToAdd: number[] = [...coreFeatureIds]; // Everyone gets core

        if (pkg.slug === "bronze") {
            // Bronze gets extra: basic analytics
            const extra = ["analytics-basic"].map(getFeatureId).filter(id => id) as number[];
            featureIdsToAdd = [...featureIdsToAdd, ...extra];
        }
        else if (pkg.slug === "silver") {
            // Silver gets bronze + many premium
            const extra = [
                "analytics-basic", "analytics-advanced", "music-player",
                "no-watermark", "digital-envelope", "unlimited-gallery"
            ].map(getFeatureId).filter(id => id) as number[];
            featureIdsToAdd = [...featureIdsToAdd, ...extra];
        }
        else if (pkg.slug === "gold") {
            // Gold gets everything
            featureIdsToAdd = allFeatures.map(f => f.id);
        }

        if (featureIdsToAdd.length > 0) {
            await db.insert(packageFeatures).values(
                featureIdsToAdd.map(featureId => ({
                    packageId: pkg.id,
                    featureId
                }))
            );
        }
        console.log(`   Mapped ${featureIdsToAdd.length} features to ${pkg.name}`);
    }

    console.log("\n🎉 Seeding completed successfully!");
}

seedFeaturesAndPackages()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error("❌ Seeding failed:", err);
        process.exit(1);
    });
