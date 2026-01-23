import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";
import { UserCheck } from "lucide-react";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");

    const userId = Number((session.user as any).id);

    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });

    if (!user) redirect("/login");

    return (
        <div className="space-y-10 max-w-5xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 font-serif tracking-tight flex items-center gap-4">
                        <div className="p-3 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
                            <UserCheck className="w-8 h-8 text-[#D4AF37]" />
                        </div>
                        Pengaturan Profil
                    </h2>
                    <p className="text-slate-400 mt-2 font-medium ml-20">Kelola identitas dan keamanan akun Anda dalam satu tempat.</p>
                </div>
            </div>

            <ProfileForm user={{
                name: user.name,
                email: user.email,
                phone: user.phone
            }} />
        </div>
    );
}
