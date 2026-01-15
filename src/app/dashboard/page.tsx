import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserInvitations } from "@/lib/queries";
import { db } from "@/db";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    const userId = Number((session.user as any).id);
    const userRole = (session.user as any).role;

    // JIKA ADMIN: Langsung lempar ke Admin Panel, gak usah lewat dashboard biasa
    if (userRole === "admin") {
        redirect("/admin");
    }

    const userInvitations = await getUserInvitations(userId);

    // Fetch available themes and packages
    const availableThemes = await db.query.themes.findMany({
        where: (themes, { eq }) => eq(themes.isActive, true)
    });
    const availablePackages = await db.query.packages.findMany({
        where: (packages, { eq }) => eq(packages.isActive, true)
    });

    const initialData = userInvitations.length > 0
        ? userInvitations[0]
        : null;

    return (
        <DashboardClient
            initialData={initialData}
            userId={userId}
            userRole={userRole}
            availableThemes={availableThemes as any}
            availablePackages={availablePackages as any}
        />
    );
}
