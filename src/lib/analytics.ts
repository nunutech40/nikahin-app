import { db } from "@/db";
import { visitorLogs } from "@/db/schema";
import { headers } from "next/headers";
import { createHash } from "crypto";

/**
 * Analytics Engine for Nikahin
 * Tracks invitation views with privacy & efficiency
 */

export async function trackVisit(invitationId: number) {
    try {
        const headersList = await headers();
        const userAgent = headersList.get("user-agent") || "";
        const ip = headersList.get("x-forwarded-for")?.split(',')[0] || headersList.get("x-real-ip") || "unknown";

        // 1. Create Privacy-Focused IP Hash (Salted)
        const ipHash = createHash("sha256")
            .update(`${ip}-${new Date().toISOString().slice(0, 10)}-nikahin-salt`)
            .digest("hex");

        // 2. Efficient Device Detection (No heavy library needed)
        let device = "Desktop";
        if (/mobile/i.test(userAgent)) device = "Mobile";
        if (/tablet|ipad/i.test(userAgent)) device = "Tablet";

        // 3. Efficient Browser Detection
        let browser = "Other";
        if (/chrome|crios/i.test(userAgent)) browser = "Chrome";
        else if (/safari/i.test(userAgent)) browser = "Safari";
        else if (/firefox/i.test(userAgent)) browser = "Firefox";
        else if (/edg/i.test(userAgent)) browser = "Edge";

        // 4. Efficient OS Detection
        let os = "Other";
        if (/android/i.test(userAgent)) os = "Android";
        else if (/iphone|ipad|ipod/i.test(userAgent)) os = "iOS";
        else if (/windows/i.test(userAgent)) os = "Windows";
        else if (/mac/i.test(userAgent)) os = "macOS";

        // 5. Save to Log
        await db.insert(visitorLogs).values({
            invitationId,
            device,
            browser,
            os,
            ipHash,
        });

    } catch (error) {
        console.error("❌ Analytics Error:", error);
    }
}
