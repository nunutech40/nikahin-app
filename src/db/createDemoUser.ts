import { db } from "./index";
import * as schema from "./schema";
import bcrypt from "bcrypt";

async function createDemoUser() {
    console.log("🧪 Creating demo test user...");

    // 1. Find Demo package
    const demoPackage = await db.query.packages.findFirst({
        where: (packages, { eq }) => eq(packages.slug, "demo")
    });

    if (!demoPackage) {
        console.error("❌ Demo package not found! Run seed first.");
        process.exit(1);
    }

    console.log("✅ Demo package found:", demoPackage.name);

    // 2. Create test user
    const hashedPassword = await bcrypt.hash("demo123", 10);

    const [user] = await db.insert(schema.users).values({
        name: "Demo User",
        email: "demo@test.com",
        phone: "08123456789",
        password: hashedPassword,
        packageId: demoPackage.id,
        isActive: false, // Demo users are not active
        role: "customer"
    }).returning();

    console.log("✅ Demo user created:", user.email);
    console.log("\n📋 Login credentials:");
    console.log("   Email: demo@test.com");
    console.log("   Password: demo123");
    console.log("\n🎉 You can now login with this demo account!");

    process.exit(0);
}

createDemoUser().catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
});
