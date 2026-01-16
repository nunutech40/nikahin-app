import { db } from "./src/db";
import { users } from "./src/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

async function createOrUpdateAdmin() {
    console.log("🔧 Creating/Updating Super Admin...");

    const email = "nunutech4.0@gmail.com";
    const password = "12345678a";
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Check if user exists
        const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if (existingUser.length > 0) {
            // Update existing user
            await db
                .update(users)
                .set({
                    password: hashedPassword,
                    role: "admin",
                    isActive: true,
                    name: "Super Admin",
                })
                .where(eq(users.email, email));

            console.log(`✅ Updated admin user: ${email}`);
        } else {
            // Create new user
            await db.insert(users).values({
                email,
                password: hashedPassword,
                role: "admin",
                isActive: true,
                name: "Super Admin",
                phone: "081234567890",
            });

            console.log(`✅ Created new admin user: ${email}`);
        }

        console.log("\n🎉 Super Admin ready!");
        console.log(`   Email: ${email}`);
        console.log(`   Password: ${password}`);
    } catch (error) {
        console.error("❌ Error:", error);
    }

    process.exit(0);
}

createOrUpdateAdmin();
