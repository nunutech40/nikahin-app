import { db } from "./src/db";
import { packages, features, packageFeatures } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function checkDemo() {
    console.log("🔍 Checking Demo Package Setup...");

    const demoPkg = await db.query.packages.findFirst({
        where: eq(packages.slug, "demo"),
        with: {
            features: {
                with: {
                    feature: true
                }
            }
        }
    });

    if (!demoPkg) {
        console.log("❌ Demo package NOT FOUND in database!");
    } else {
        console.log(`✅ Demo package found: ${demoPkg.name} (ID: ${demoPkg.id})`);
        console.log(`✅ Features count: ${demoPkg.features.length}`);
        demoPkg.features.forEach(f => console.log(`   - ${f.feature.code}`));
    }

    process.exit(0);
}

checkDemo().catch(err => {
    console.error("error:", err);
    process.exit(1);
});
