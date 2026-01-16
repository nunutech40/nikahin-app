"use client";

import { useState } from "react";
import { registerUser } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, Mail, Lock, User, ArrowRight, Phone, Calendar } from "lucide-react";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const result = await registerUser(formData);

        if (result.success) {
            router.push("/login?registered=true");
        } else {
            setError(result.error || "Gagal mendaftar");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-6 py-12">
            <div className="max-w-xl w-full">
                {/* Logo/Brand */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white shadow-xl shadow-amber-200/20 mb-6 rotate-3">
                        <Heart className="w-10 h-10 text-[#D4AF37] fill-current" />
                    </div>
                    <h1 className="font-serif text-4xl text-[#b28f1f] font-black tracking-tighter">Nikahin</h1>
                    <p className="text-slate-400 mt-2 font-medium">Langkah pertama menuju hari bahagia Anda.</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-[40px] p-10 shadow-2xl shadow-slate-200/60 border border-slate-100 relative overflow-hidden">
                    {/* Decorative Background Element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50/50 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />

                    <div className="relative z-10">
                        <h2 className="text-2xl font-black text-slate-800 mb-8 text-center uppercase tracking-widest">
                            Create Account
                        </h2>

                        {error && (
                            <div className="mb-8 p-4 rounded-2xl bg-rose-50 text-rose-600 text-sm border border-rose-100 text-center font-bold">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#D4AF37] transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Nama Anda"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/5 outline-none transition-all placeholder:text-gray-300 font-medium text-slate-700"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Email */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#D4AF37] transition-colors" />
                                        <input
                                            type="email"
                                            placeholder="email@anda.com"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/5 outline-none transition-all placeholder:text-gray-300 font-medium text-slate-700"
                                        />
                                    </div>
                                </div>

                                {/* Nomor WhatsApp */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp (HP)</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#D4AF37] transition-colors" />
                                        <input
                                            type="tel"
                                            placeholder="0812xxxx"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/5 outline-none transition-all placeholder:text-gray-300 font-medium text-slate-700"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Buat Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#D4AF37] transition-colors" />
                                    <input
                                        type="password"
                                        placeholder="Min. 6 karakter"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/5 outline-none transition-all placeholder:text-gray-300 font-medium text-slate-700"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#D4AF37] hover:bg-[#b28f1f] text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-amber-200/40 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 group mt-8"
                            >
                                {isSubmitting ? (
                                    "Mempersiapkan Tahta..."
                                ) : (
                                    <>
                                        Daftar Sekarang
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-10 pt-8 border-t border-slate-50 text-center">
                            <p className="text-slate-400 text-sm font-medium">
                                Sudah punya akun?{" "}
                                <Link href="/login" className="text-[#D4AF37] font-black hover:underline px-2 py-1 rounded-lg hover:bg-amber-50 transition-colors">
                                    Masuk di sini
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="mt-8 text-center text-gray-400 text-sm">
                    &copy; 2026 Nikahin. All rights reserved.
                </div>
            </div>
        </div>
    );
}
