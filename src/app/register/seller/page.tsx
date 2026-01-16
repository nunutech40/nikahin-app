"use client";

import { useState } from "react";
import { registerUser } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Store, Mail, Lock, User, ArrowRight, Phone, ShieldCheck, Eye, EyeOff } from "lucide-react";

export default function AgencyRegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "agency" as const, // Force agency role
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(false);
        setError(null);

        // We use the same registerUser but with agency role
        // I need to ensure the server action allows role injection if it's from this page
        const result = await registerUser(formData);

        if (result.success) {
            router.push("/login?registered=true&role=agency");
        } else {
            setError(result.error || "Gagal mendaftar sebagai seller");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 py-12 relative overflow-hidden">
            {/* Background Aesthetics */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-xl w-full relative z-10">
                {/* Logo/Brand */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl mb-6">
                        <Store className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h1 className="font-serif text-4xl text-white font-black tracking-tighter">Nikahin <span className="text-emerald-400">Partner</span></h1>
                    <p className="text-slate-400 mt-2 font-medium uppercase text-[10px] tracking-[0.3em]">Official Agency Portal</p>
                </div>

                {/* Card */}
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-[40px] p-10 shadow-2xl border border-slate-800 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white uppercase tracking-wider">
                                    Mitra Seller Baru
                                </h2>
                                <p className="text-slate-500 text-xs font-medium uppercase tracking-widest mt-0.5">Mulai bangun jaringan agensi Anda</p>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-8 p-4 rounded-2xl bg-rose-500/10 text-rose-400 text-sm border border-rose-500/20 text-center font-bold">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 text-slate-500">Nama Lengkap Owner</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-emerald-400 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Contoh: Budi Santoso"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all placeholder:text-slate-600 font-medium text-white"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Email Bisnis</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-emerald-400 transition-colors" />
                                        <input
                                            type="email"
                                            placeholder="agency@nikahin.com"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all placeholder:text-slate-600 font-medium text-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">WhatsApp Aktif</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-emerald-400 transition-colors" />
                                        <input
                                            type="tel"
                                            placeholder="08123456789"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all placeholder:text-slate-600 font-medium text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Atur Password Akses</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-emerald-400 transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Min. 6 karakter"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all placeholder:text-slate-600 font-medium text-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-emerald-400 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 group mt-8"
                            >
                                {isSubmitting ? (
                                    "Mempersiapkan Portal..."
                                ) : (
                                    <>
                                        Daftar Sebagai Seller
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-10 pt-8 border-t border-slate-800 text-center">
                            <p className="text-slate-500 text-sm font-medium">
                                Sudah punya akun partner?{" "}
                                <Link href="/login" className="text-emerald-400 font-black hover:underline px-2 py-1 rounded-lg hover:bg-emerald-500/5 transition-colors">
                                    Login Seller
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em]">
                    &copy; 2026 Nikahin Agency Network. All rights reserved.
                </div>
            </div>
        </div>
    );
}
