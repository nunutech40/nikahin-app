import { db } from "./index";
import { users } from "./schema";
import { eq } from "drizzle-orm";

async function promoteToAdmin() {
    const email = "nunutech4.0@gmail.com";
    console.log(`🚀 Promoting ${email} to admin...`);

    try {
        const result = await db
            .update(users)
            .set({ role: "admin", isActive: true })
            .where(eq(users.email, email))
            .returning();

        if (result.length > 0) {
            console.log("✅ Successfully promoted to admin!");
            console.log(result[0]);
        } else {
            console.log("❌ User not found. Please register first with this email.");
        }
    } catch (error) {
        console.error("❌ Error promoting user:", error);
    } finally {
        process.exit(0);
    }
}

promoteToAdmin();
