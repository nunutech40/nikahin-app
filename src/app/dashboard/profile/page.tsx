import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";
import { UserCheck } from "lucide-react";
import Link from "next/link";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");

    const userId = Number((session.user as any).id);

    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });

    if (!user) redirect("/login");

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            {/* Header Area with specific padding and background */}
            <div className="bg-white border-b border-slate-200 py-12 mb-10">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
                                    <UserCheck className="w-8 h-8 text-[#D4AF37]" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-black text-slate-900 font-serif tracking-tight">Pengaturan Profil</h1>
                                    <p className="text-slate-400 font-medium text-sm">Kelola identitas dan keamanan akun Anda dalam satu tempat.</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/dashboard"
                                className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all text-sm"
                            >
                                Kembali ke Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-6xl mx-auto px-6">
                <ProfileForm user={{
                    name: user.name,
                    email: user.email,
                    phone: user.phone
                }} />
            </div>
        </div>
    );
}
