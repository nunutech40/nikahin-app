import { db } from "./src/db";
import { users } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function promoteUser() {
    const email = "gadiskretek93@gmail.com";
    try {
        await db.update(users)
            .set({ role: "agency", isActive: true })
            .where(eq(users.email, email));
        console.log(`✅ User ${email} successfully promoted to AGENCY role.`);
    } catch (error) {
        console.error("❌ Error promoting user:", error);
    }
    process.exit(0);
}

promoteUser();
