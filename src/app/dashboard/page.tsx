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
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    const userId = Number((session.user as any).id);
    const userRole = (session.user as any).role || "user";

    // 1. Fetch User Data with Package
    let userPackageSlug = "bronze";
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        with: {
            package: true,
        },
    });

    if (user?.package) {
        userPackageSlug = user.package.slug;
    }

    // 2. Fetch User Features
    let userFeatures: string[] = [];
    try {
        userFeatures = await getUserFeatures(userId);
    } catch (error) {
        console.error("❌ Dashboard getUserFeatures Error:", error);
    }

    // 3. Fetch Invitations
    const userInvitations = await getUserInvitations(userId);

    // 4. Global Data for Forms
    const availableThemes = await db.query.themes.findMany({
        where: eq(themes.isActive, true),
    });

    const availablePackages = await db.query.packages.findMany({
        where: eq(packages.isActive, true),
    });

    // Determine initial data
    let initialData = userInvitations.length > 0 ? userInvitations[0] : null;

    // Fallback for special Demo Package static check
    if (userPackageSlug === "demo" && userInvitations.length === 0) {
        initialData = {
            id: 0,
            slug: "demo-preview",
            content: DEMO_DATA,
            isPublished: false,
        } as any;
    }

    // Prepare content with injected features for the client
    let dashboardInitialData = initialData;
    if (initialData) {
        dashboardInitialData = {
            ...initialData,
            content: {
                ...(initialData.content as any || {}),
                features: userFeatures
            }
        };
    }

    // Debug Logs
    console.log(`[Dashboard] User ${userId} (${userRole}) | Package: ${userPackageSlug} | Features: ${userFeatures.length}`);
    if (initialData) {
        console.log(`[Dashboard] Invitation Found: ${initialData.slug} (ID: ${initialData.id})`);
    } else {
        console.log(`[Dashboard] No Invitation Found for User ${userId}`);
    }

    return (
        <DashboardClient
            initialData={dashboardInitialData}
            userId={userId}
            userRole={userRole}
            userPackageSlug={userPackageSlug}
            availableThemes={availableThemes as any}
            availablePackages={availablePackages as any}
            guestMode={false}
        />
    );
}
