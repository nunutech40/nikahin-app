import { db } from "./src/db";
import { users, invitations } from "./src/db/schema";
import { desc } from "drizzle-orm";

async function checkData() {
    console.log("--- LATEST USERS ---");
    const latestUsers = await db.query.users.findMany({
        orderBy: [desc(users.id)],
        limit: 5,
        with: { package: true }
    });

    latestUsers.forEach(u => {
        console.log(`ID: ${u.id}, Email: ${u.email}, Package: ${u.package?.slug}, IsActive: ${u.isActive}`);
    });

    console.log("\n--- LATEST INVITATIONS ---");
    const latestInvs = await db.query.invitations.findMany({
        orderBy: [desc(invitations.id)],
        limit: 5
    });

    latestInvs.forEach(i => {
        console.log(`ID: ${i.id}, UserID: ${i.userId}, Slug: ${i.slug}, ContentNull: ${!i.content}`);
        if (i.content) {
            console.log(`- Content Keys: ${Object.keys(i.content as object).join(', ')}`);
        }
    });
}

checkData().catch(console.error);
