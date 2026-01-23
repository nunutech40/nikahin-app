import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserInvitations } from "@/lib/queries";
import { db } from "@/db";
import { packages, themes, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUserFeatures } from "@/lib/featureGating";
import DashboardClient from "./DashboardClient";
import { DEMO_DATA } from "@/data/demoData";

export default async function DashboardPage() {
    console.log("[Dashboard] Server Component Start");

    let dbError: Error | null = null;

    const session = await getServerSession(authOptions);

    if (!session?.user) {
        console.log("[Dashboard] No session, redirecting to login");
        redirect("/login");
    }

    const userId = Number((session.user as any).id);
    const userRole = (session.user as any).role || "user";

    console.log(`[Dashboard] User ID: ${userId}, Role: ${userRole}`);

    // 1. Fetch User Data with Package
    let userPackageSlug = "bronze";
    try {
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
            with: {
                package: true,
            },
        });

        if (user?.package) {
            userPackageSlug = user.package.slug;
        }
    } catch (e) {
        console.error("[Dashboard] Error fetching user package:", e);
        dbError = e as Error;
    }

    // 2. Fetch User Features
    let userFeatures: string[] = [];
    try {
        userFeatures = await getUserFeatures(userId);
    } catch (error) {
        console.error("❌ Dashboard getUserFeatures Error:", error);
        if (!dbError) dbError = error as Error;
    }

    // 3. Fetch Invitations
    let userInvitations: any[] = [];
    try {
        userInvitations = await getUserInvitations(userId);
    } catch (e) {
        console.error("[Dashboard] Error fetching invitations:", e);
        if (!dbError) dbError = e as Error;
    }

    // 4. Global Data for Forms
    let availableThemes: any[] = [];
    let availablePackages: any[] = [];
    try {
        availableThemes = await db.query.themes.findMany({
            where: eq(themes.isActive, true),
        });

        availablePackages = await db.query.packages.findMany({
            where: eq(packages.isActive, true),
        });
    } catch (e) {
        console.error("[Dashboard] Error fetching global data:", e);
        if (!dbError) dbError = e as Error;
    }

    // Determine initial data
    let initialData = userInvitations.length > 0 ? userInvitations[0] : null;

    // REMOVED: Fallback for special Demo Package static check
    // We want demo users to Create Invitation first so they have a real slug and DB record.
    // This ensures the Preview Link works correctly for them.

    // Prepare content with injected features for the client
    let dashboardInitialData = initialData;
    if (initialData) {
        try {
            dashboardInitialData = {
                ...initialData,
                content: {
                    ...(initialData.content as any || {}),
                    features: userFeatures
                }
            };
        } catch (e) {
            console.error("[Dashboard] Error preparing initialData content:", e);
        }
    }

    // Debug Logs
    console.log(`[Dashboard] Final state: Package=${userPackageSlug}, Features=${userFeatures.length}, InitialData=${!!initialData}, HasError=${!!dbError}`);

    return (
        <DashboardClient
            initialData={dashboardInitialData}
            userId={userId}
            userRole={userRole}
            userPackageSlug={userPackageSlug}
            availableThemes={availableThemes as any}
            availablePackages={availablePackages as any}
            guestMode={false}
            serverError={dbError ? {
                message: dbError.message,
                name: dbError.name,
                stack: dbError.stack
            } : null}
        />
    );
}
