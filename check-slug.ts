import { db } from "./src/db";
import { invitations, packages } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function checkInvitation() {
    const result = await db.query.invitations.findFirst({
        where: eq(invitations.slug, "rizka-ayu"),
        with: {
            package: true
        }
    });

    if (!result) {
        console.log("❌ Invitation rizka-ayu not found");
        return;
    }

    console.log(`✅ Invitation Found:`);
    console.log(`- Slug: ${result.slug}`);
    console.log(`- Package: ${result.package.name} (${result.package.slug})`);
    process.exit(0);
}

checkInvitation();
