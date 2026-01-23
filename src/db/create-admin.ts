import { db } from "./index";
import { users, packages } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

config({ path: ".env.local" });

async function createAdmin() {
    console.log("🔐 Creating admin user...");

    try {
        // Get Bronze package (default for admin)
        const bronzePkg = await db.query.packages.findFirst({
            where: eq(packages.slug, "bronze")
        });

        if (!bronzePkg) {
            console.error("❌ Bronze package not found. Run seed first!");
            process.exit(1);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash("admin123", 10);

        // Create/Update admin user
        const admin = await db.insert(users).values({
            email: "admin@nikahin.app",
            password: hashedPassword,
            name: "Super Admin",
            role: "admin",
            packageId: bronzePkg.id,
            isActive: true,
        }).onConflictDoUpdate({
            target: users.email,
            set: {
                password: hashedPassword,
                role: "admin",
                isActive: true,
                packageId: bronzePkg.id
            }
        }).returning();

        console.log("✅ Admin user created successfully!");
        console.log("\n📧 Login credentials:");
        console.log("   Email: admin@nikahin.app");
        console.log("   Password: admin123");
        console.log("\n⚠️  Please change this password after first login!\n");

        process.exit(0);
    } catch (error) {
        console.error("❌ Failed to create admin:", error);
        process.exit(1);
    }
}

createAdmin();
