import { db } from "./index";
import * as schema from "./schema";
import { eq } from "drizzle-orm";
import { MOCK_DATA } from "../data/mockData";

async function seed() {
    console.log("🌱 Seeding database...");

    try {
        // 1. Seed Features
        console.log("  - Seeding features...");
        const featureList = [
            { code: "rsvp_system", name: "RSVP System", description: "Tamu dapat melakukan konfirmasi kehadiran", isCore: false },
            { code: "gallery_unlimited", name: "Unlimited Gallery", description: "Unggah foto tanpa batasan", isCore: false },
            { code: "background_music", name: "Custom Background Music", description: "Pilih musik latar sendiri", isCore: false },
            { code: "google_maps", name: "Google Maps Integration", description: "Integrasi lokasi dengan Google Maps", isCore: true },
            { code: "countdown", name: "Countdown Timer", description: "Hitung mundur hari pernikahan", isCore: true },
            { code: "guestbook", name: "Digital Guestbook", description: "Ucapan dan doa dari tamu", isCore: true },
        ];

        for (const f of featureList) {
            await db.insert(schema.features).values(f).onConflictDoUpdate({
                target: schema.features.code,
                set: { name: f.name, description: f.description, isCore: f.isCore }
            });
        }

        // 2. Seed Packages
        console.log("  - Seeding packages...");
        const packageList = [
            { slug: "bronze", name: "Bronze Package", description: "Paket dasar hemat", price: 50000 },
            { slug: "gold", name: "Gold Package", description: "Paket paling populer", price: 150000 },
            { slug: "platinum", name: "Platinum Package", description: "Paket lengkap eksklusif", price: 300000 },
        ];

        for (const p of packageList) {
            await db.insert(schema.packages).values(p).onConflictDoUpdate({
                target: schema.packages.slug,
                set: { name: p.name, description: p.description, price: p.price }
            });
        }

        // 3. Link Features to Packages (Simplified)
        console.log("  - Linking features to packages...");
        const goldPkg = await db.query.packages.findFirst({ where: eq(schema.packages.slug, "gold") });
        const rsvpFeature = await db.query.features.findFirst({ where: eq(schema.features.code, "rsvp_system") });

        if (goldPkg && rsvpFeature) {
            await db.insert(schema.packageFeatures).values({
                packageId: goldPkg.id,
                featureId: rsvpFeature.id
            }).onConflictDoNothing();
        }

        // 4. Seed Themes
        console.log("  - Seeding themes...");
        const themeList = [
            { slug: "basic", name: "Basic Theme", description: "Theme bawaan yang elegan", category: "elegant", isFree: true },
            { slug: "modern", name: "Modern Dark", description: "Nuansa gelap yang mewah", category: "modern", isFree: false },
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
        const pkg = await db.query.packages.findFirst({ where: eq(schema.packages.slug, "gold") });

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
