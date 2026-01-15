import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserInvitations } from "@/lib/queries";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    const userId = Number((session.user as any).id);
    const userInvitations = await getUserInvitations(userId);

    // For now, if the user has no invitations, we could show a "Create" UI
    // or just pass an empty state. If they have one, we load it.
    const initialData = userInvitations.length > 0
        ? userInvitations[0]
        : null;

    return (
        <DashboardClient
            initialData={initialData}
            userId={userId}
        />
    );
}
