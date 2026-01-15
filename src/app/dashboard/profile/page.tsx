import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Mail, Shield, Calendar, ArrowLeft, LogOut } from "lucide-react";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    const user = session.user as any;

    return (
        <div className="min-h-screen bg-[#faf8f5] p-4 md:p-8">
            <div className="max-w-2xl mx-auto">
                {/* Navigation */}
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Kembali ke Dashboard
                </Link>

                {/* Profile Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    {/* Header/Cover Placeholder */}
                    <div className="h-32 bg-gradient-to-r from-[#D4AF37] to-[#b28f1f]" />

                    <div className="px-8 pb-8">
                        {/* Avatar */}
                        <div className="relative -mt-12 mb-6">
                            <div className="w-24 h-24 rounded-2xl bg-white p-2 shadow-lg">
                                <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center text-[#D4AF37]">
                                    <User className="w-12 h-12" />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
                                <p className="text-gray-500">Kelola informasi akun dan keamanan</p>
                            </div>

                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl text-amber-700 text-sm font-medium border border-amber-100 uppercase tracking-wider">
                                <Shield className="w-4 h-4" />
                                {user.role}
                            </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-1 gap-6">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-tight">Alamat Email</p>
                                    <p className="text-slate-900 font-semibold">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 opacity-60">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-tight">Bergabung Sejak</p>
                                    <p className="text-slate-900 font-semibold">Januari 2026</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                            <button
                                disabled
                                className="flex-1 bg-slate-100 text-slate-400 py-4 rounded-2xl font-semibold cursor-not-allowed"
                            >
                                Ubah Password (Nanti)
                            </button>

                            <Link
                                href="/api/auth/signout"
                                className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 py-4 rounded-2xl font-semibold transition-all text-center flex items-center justify-center gap-2"
                            >
                                <LogOut className="w-5 h-5" />
                                Logout dari Akun
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Support Section */}
                <div className="mt-8 p-6 bg-amber-50/50 rounded-2xl border border-amber-100/50 text-center">
                    <p className="text-sm text-amber-800">
                        Butuh bantuan terkait akun Anda? <Link href="#" className="font-bold underline">Hubungi CS Nikahin</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
