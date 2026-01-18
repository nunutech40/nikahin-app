import { db } from "./src/db";
import { packages, packageFeatures, features } from "./src/db/schema";
import { eq, inArray } from "drizzle-orm";

async function syncDemoWithSilver() {
    console.log("🚀 Syncing Demo package features with Silver package...");

    // 1. Get Silver Package ID
    const silverPackage = await db.query.packages.findFirst({
        where: eq(packages.slug, "silver"),
    });

    if (!silverPackage) {
        console.error("❌ Silver package not found!");
        return;
    }

    // 2. Get Demo Package ID
    const demoPackage = await db.query.packages.findFirst({
        where: eq(packages.slug, "demo"),
    });

    if (!demoPackage) {
        console.error("❌ Demo package not found!");
        return;
    }

    // 3. Get all features assigned to Silver
    const silverFeatures = await db.query.packageFeatures.findMany({
        where: eq(packageFeatures.packageId, silverPackage.id),
    });

    const silverFeatureIds = silverFeatures.map(sf => sf.featureId);

    console.log(`✅ Found ${silverFeatureIds.length} features in Silver package.`);

    // 4. Remove all features from Demo package first
    await db.delete(packageFeatures).where(eq(packageFeatures.packageId, demoPackage.id));
    console.log("🧹 Cleared existing Demo package features.");

    // 5. Re-add features from Silver to Demo
    if (silverFeatureIds.length > 0) {
        for (const featureId of silverFeatureIds) {
            await db.insert(packageFeatures).values({
                packageId: demoPackage.id,
                featureId: featureId,
            });
        }
        console.log(`✨ Successfully synced ${silverFeatureIds.length} features to Demo package.`);
    } else {
        console.log("⚠️ No features found in Silver package to sync.");
    }

    process.exit(0);
}

syncDemoWithSilver().catch(err => {
    console.error("❌ Sync Error:", err);
    process.exit(1);
});
