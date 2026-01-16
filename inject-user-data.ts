import { db } from "./src/db";
import { users, invitations } from "./src/db/schema";
import { eq, isNull, sql } from "drizzle-orm";

async function injectMissingData() {
    console.log("🚀 Starting data injection for existing users...");

    try {
        // 1. Get all users where name or phone is null
        const existingUsers = await db.query.users.findMany({
            with: {
                invitations: true
            }
        });

        for (const user of existingUsers) {
            const updates: any = {};

            // Inject Name if missing (use part of email)
            if (!user.name) {
                const emailPrefix = user.email.split('@')[0];
                updates.name = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1).replace(/[^a-zA-Z]/g, ' ');
            }

            // Inject Phone if missing (dummy)
            if (!user.phone) {
                updates.phone = "0812" + Math.floor(10000000 + Math.random() * 90000000);
            }

            // Try to find wedding date from invitations if available
            if (!user.weddingDate && user.invitations.length > 0) {
                const content = user.invitations[0].content as any;
                if (content && content.eventDate) {
                    updates.weddingDate = new Date(content.eventDate);
                }
            }

            if (Object.keys(updates).length > 0) {
                await db.update(users).set(updates).where(eq(users.id, user.id));
                console.log(`✅ Updated user: ${user.email}`);
            }
        }

        console.log("✨ Data injection complete.");
    } catch (error) {
        console.error("❌ Error injecting data:", error);
    }
    process.exit(0);
}

injectMissingData();
