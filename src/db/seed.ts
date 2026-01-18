import { db } from "./index";
import * as schema from "./schema";
import { eq } from "drizzle-orm";
import { MOCK_DATA } from "../data/mockData";
import { MASTER_THEME_CONFIG } from "@/components/themes/masterConfig";

async function seed() {
    console.log("🌱 Seeding database...");

    try {
        // 1. Seed Features (Comprehensive)
        console.log("  - Seeding features...");
        const featureList = [
            // Core Features (Available to all packages)
            { code: "basic_info", name: "Info Mempelai & Orang Tua", description: "Informasi dasar pengantin", isCore: true },
            { code: "countdown", name: "Countdown Timer", description: "Hitung mundur hari pernikahan", isCore: true },
            { code: "google_maps", name: "Google Maps Integration", description: "Integrasi lokasi dengan Google Maps", isCore: true },
            { code: "guestbook", name: "Digital Guestbook", description: "Ucapan dan doa dari tamu", isCore: true },

            // Bronze+ Features
            { code: "rsvp_basic", name: "RSVP Basic", description: "Konfirmasi kehadiran tanpa export", isCore: false },
            { code: "single_event", name: "Single Event", description: "1 detail acara (Akad saja)", isCore: false },

            // Silver+ Features
            { code: "rsvp_export", name: "RSVP Export CSV", description: "Export data tamu ke CSV", isCore: false },
            { code: "unlimited_events", name: "Unlimited Events", description: "Akad + Resepsi + acara lainnya", isCore: false },
            { code: "gallery_10", name: "Gallery 10 Photos", description: "Upload hingga 10 foto", isCore: false },
            { code: "background_music", name: "Background Music", description: "Musik latar dari library", isCore: false },
            { code: "quotes", name: "Quote & Doa", description: "Ayat suci dan doa", isCore: false },

            // Gold+ Features
            { code: "love_story", name: "Love Story Timeline", description: "Timeline perjalanan cinta", isCore: false },
            { code: "gift_registry", name: "Gift Registry", description: "Amplop digital", isCore: false },
            { code: "custom_theme", name: "Custom Colors & Fonts", description: "Kustomisasi tema", isCore: false },
            { code: "gallery_unlimited", name: "Gallery Unlimited", description: "Upload hingga 30 foto", isCore: false },
            { code: "remove_branding", name: "Remove Branding", description: "Hapus 'Powered by Nikahin'", isCore: false },
        ];

        for (const f of featureList) {
            await db.insert(schema.features).values(f).onConflictDoUpdate({
                target: schema.features.code,
                set: { name: f.name, description: f.description, isCore: f.isCore }
            });
        }

        // 2. Seed Packages (Updated Pricing)
        console.log("  - Seeding packages...");
        const packageList = [
            { slug: "demo", name: "Demo", description: "Try all features - No save, no publish", price: 0 },
            { slug: "bronze", name: "Bronze", description: "Paket Free Trial - Coba dulu sebelum bayar", price: 0 },
            { slug: "silver", name: "Silver", description: "Paket Best Value - Paling populer", price: 150000 },
            { slug: "gold", name: "Gold", description: "Paket Premium - Fitur lengkap eksklusif", price: 300000 },
        ];

        for (const p of packageList) {
            await db.insert(schema.packages).values(p).onConflictDoUpdate({
                target: schema.packages.slug,
                set: { name: p.name, description: p.description, price: p.price }
            });
        }

        // 3. Link Features to Packages (Comprehensive Mapping)
        console.log("  - Linking features to packages...");

        // Get all packages
        const demoPkg = await db.query.packages.findFirst({ where: eq(schema.packages.slug, "demo") });
        const bronzePkg = await db.query.packages.findFirst({ where: eq(schema.packages.slug, "bronze") });
        const silverPkg = await db.query.packages.findFirst({ where: eq(schema.packages.slug, "silver") });
        const goldPkg = await db.query.packages.findFirst({ where: eq(schema.packages.slug, "gold") });

        // Get all features
        const allFeatures = await db.query.features.findMany();
        const featureMap = new Map(allFeatures.map(f => [f.code, f.id]));

        // Demo Package Features (ALL FEATURES for testing)
        if (demoPkg) {
            const demoFeatures = [
                "rsvp_basic", "single_event", // Bronze
                "rsvp_export", "unlimited_events", "gallery_10", "background_music", "quotes", // Silver
                "love_story", "gift_registry", "custom_theme", "gallery_unlimited", "remove_branding" // Gold
            ];
            for (const code of demoFeatures) {
                const featureId = featureMap.get(code);
                if (featureId) {
                    await db.insert(schema.packageFeatures).values({
                        packageId: demoPkg.id,
                        featureId: featureId
                    }).onConflictDoNothing();
                }
            }
        }

        // Bronze Package Features
        if (bronzePkg) {
            const bronzeFeatures = ["rsvp_basic", "single_event"];
            for (const code of bronzeFeatures) {
                const featureId = featureMap.get(code);
                if (featureId) {
                    await db.insert(schema.packageFeatures).values({
                        packageId: bronzePkg.id,
                        featureId: featureId
                    }).onConflictDoNothing();
                }
            }
        }

        // Silver Package Features (Bronze + Silver features)
        if (silverPkg) {
            const silverFeatures = [
                "rsvp_basic", "single_event", // Bronze features
                "rsvp_export", "unlimited_events", "gallery_10", "background_music", "quotes" // Silver features
            ];
            for (const code of silverFeatures) {
                const featureId = featureMap.get(code);
                if (featureId) {
                    await db.insert(schema.packageFeatures).values({
                        packageId: silverPkg.id,
                        featureId: featureId
                    }).onConflictDoNothing();
                }
            }
        }

        // Gold Package Features (Bronze + Silver + Gold features)
        if (goldPkg) {
            const goldFeatures = [
                "rsvp_basic", "single_event", // Bronze features
                "rsvp_export", "unlimited_events", "gallery_10", "background_music", "quotes", // Silver features
                "love_story", "gift_registry", "custom_theme", "gallery_unlimited", "remove_branding" // Gold features
            ];
            for (const code of goldFeatures) {
                const featureId = featureMap.get(code);
                if (featureId) {
                    await db.insert(schema.packageFeatures).values({
                        packageId: goldPkg.id,
                        featureId: featureId
                    }).onConflictDoNothing();
                }
            }
        }

        // 4. Seed Themes
        console.log("  - Seeding themes...");
        const themeList = [
            { slug: "basic", name: "Basic Theme", description: "Theme bawaan yang elegan", category: "elegant", isFree: true },
            { slug: "modern", name: "Modern Dark", description: "Nuansa gelap yang mewah", category: "modern", isFree: false },
            {
                slug: "custom_default",
                name: "Custom Theme (Builder)",
                description: "Tema dinamis yang dibuat dengan No-Code Builder",
                category: "dynamic",
                isFree: false,
                config: MASTER_THEME_CONFIG
            },
        ];

        for (const t of themeList) {
            await db.insert(schema.themes).values(t).onConflictDoUpdate({
                target: schema.themes.slug,
                set: { name: t.name, description: t.description, category: t.category, isFree: t.isFree }
            });
        }

        // 5. Seed Users
        console.log("  - Seeding users...");
        const user = await db.insert(schema.users).values({
            email: "nunu@example.com",
            password: "hashed_password_here", // Should be hashed in real app
            role: "admin",
            isActive: true,
        }).onConflictDoUpdate({
            target: schema.users.email,
            set: { role: "admin", isActive: true }
        }).returning();

        // 6. Seed Invitation
        console.log("  - Seeding sample invitation...");
        const theme = await db.query.themes.findFirst({ where: eq(schema.themes.slug, "basic") });
        const pkg = await db.query.packages.findFirst({ where: eq(schema.packages.slug, "silver") });

        if (user[0] && theme && pkg) {
            await db.insert(schema.invitations).values({
                userId: user[0].id,
                themeId: theme.id,
                packageId: pkg.id,
                slug: "rizka-ayu",
                content: MOCK_DATA,
                isPublished: true,
            }).onConflictDoUpdate({
                target: schema.invitations.slug,
                set: {
                    themeId: theme.id,
                    packageId: pkg.id,
                    content: MOCK_DATA,
                    isPublished: true
                }
            });
        }

        console.log("✅ Seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
}

seed();
