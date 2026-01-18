import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserInvitations } from "@/lib/queries";
import { db } from "@/db";
import DashboardClient from "./DashboardClient";
import { DEMO_DATA } from "@/data/demoData";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    // ============================================
    // GUEST MODE: User not logged in
    // ============================================
    if (!session?.user) {
        // Guest can access dashboard for testing
        // But with limited functionality (no save, no publish)
        return (
            <DashboardClient
                initialData={null}
                userId={0}
                userRole="guest"
                userPackageSlug="demo"
                availableThemes={[]}
                availablePackages={[]}
                guestMode={true}
            />
        );
    }

    // ============================================
    // LOGGED IN MODE: Normal flow
    // ============================================
    const userId = Number((session.user as any).id);
    const userRole = (session.user as any).role;

    // JIKA ADMIN & AGENCY: Lempar ke portal masing-masing
    if (userRole === "admin") {
        redirect("/admin");
    }
    if (userRole === "agency") {
        redirect("/agency");
    }

    let userPackageSlug = "bronze";
    let availableThemes: any[] = [];
    let availablePackages: any[] = [];
    let userInvitations: any[] = [];
    let userFeatures: string[] = [];

    try {
        // Get user with package info
        const user = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, userId),
            with: {
                package: true
            }
        });

        if (user?.package) {
            userPackageSlug = user.package.slug;
        }

        userInvitations = await getUserInvitations(userId);

        const { getUserFeatures } = await import("@/lib/featureGating");
        userFeatures = await getUserFeatures(userId);

        // Fetch available themes and packages
        availableThemes = await db.query.themes.findMany({
            where: (themes, { eq }) => eq(themes.isActive, true)
        });
        availablePackages = await db.query.packages.findMany({
            where: (packages, { eq }) => eq(packages.isActive, true)
        });
    } catch (error) {
        console.error("Dashboard Data Fetch Error:", error);
        // Fallback to defaults to prevent crash
    }

    let initialData = userInvitations.length > 0
        ? userInvitations[0]
        : null;

    // ============================================
    // DEMO PACKAGE: Load demo data for preview
    // ============================================
    if (userPackageSlug === "demo") {
        // Demo users see full preview with DEMO_DATA
        initialData = {
            id: 0,
            slug: "demo-preview",
            content: DEMO_DATA,
            isPublished: false,
        } as any;
    }

    // Inject features into content safely (Avoid mutation)
    let dashboardInitialData = initialData;
    if (initialData?.content) {
        dashboardInitialData = {
            ...initialData,
            content: {
                ...(initialData.content as any),
                features: userFeatures
            }
        };
    }

    console.log(`[Dashboard] Loading for User ${userId} (${userRole}) with package ${userPackageSlug}`);
    console.log(`[Dashboard] InitialData status: ${initialData ? 'FOUND' : 'NOT FOUND'}`);
    if (initialData) console.log(`[Dashboard] InitialData Slug: ${initialData.slug}`);

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

