import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserInvitations } from "@/lib/queries";
import { db } from "@/db";
import DashboardClient from "./DashboardClient";
import { MOCK_DATA } from "@/data/mockData";

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

    const userInvitations = await getUserInvitations(userId);
    const { getUserFeatures } = await import("@/lib/featureGating");
    const userFeatures = await getUserFeatures(userId);

    // Fetch available themes and packages
    const availableThemes = await db.query.themes.findMany({
        where: (themes, { eq }) => eq(themes.isActive, true)
    });
    const availablePackages = await db.query.packages.findMany({
        where: (packages, { eq }) => eq(packages.isActive, true)
    });

    let initialData = userInvitations.length > 0
        ? userInvitations[0]
        : null;

    // Inject features into content
    if (initialData?.content) {
        (initialData.content as any).features = userFeatures;
    }

    return (
        <DashboardClient
            initialData={initialData}
            userId={userId}
            userRole={userRole}
            availableThemes={availableThemes as any}
            availablePackages={availablePackages as any}
            guestMode={false}
        />
    );
}
