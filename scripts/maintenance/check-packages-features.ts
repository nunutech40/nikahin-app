import { db } from "./src/db";
import { packages, features, packageFeatures } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function checkPackages() {
    console.log("🔍 Checking Packages and Features...");

    const allPackages = await db.query.packages.findMany({
        with: {
            features: {
                with: {
                    feature: true
                }
            }
        }
    });

    for (const pkg of allPackages) {
        console.log(`\n📦 Package: ${pkg.name} (${pkg.slug}) - ID: ${pkg.id}`);
        console.log(`   Price: ${pkg.price}`);
        console.log(`   Features (${pkg.features.length}):`);
        pkg.features.forEach(f => console.log(`   - [${f.feature.code}] ${f.feature.name}`));
    }

    process.exit(0);
}

checkPackages().catch(err => {
    console.error(err);
    process.exit(1);
});
