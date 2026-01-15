"use client";

import { useState } from "react";
import { registerUser } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, Mail, Lock, UserPlus, ArrowRight } from "lucide-react";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        email: "",
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
        <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm mb-4">
                        <Heart className="w-8 h-8 text-[#D4AF37] fill-current" />
                    </div>
                    <h1 className="font-serif text-3xl text-[#b28f1f] font-bold">Nikahin</h1>
                    <p className="text-gray-500 mt-2">Mulai perjalanan bahagiamu di sini</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Buat Akun Baru</h2>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100 text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 outline-none transition-all placeholder:text-gray-300"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 outline-none transition-all placeholder:text-gray-300"
                                />
                            </div>
                            <p className="text-[10px] text-gray-400 ml-1">Minimal 6 karakter</p>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#D4AF37] hover:bg-[#b28f1f] text-white py-4 rounded-2xl font-semibold shadow-lg shadow-[#D4AF37]/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 group mt-8"
                        >
                            {isSubmitting ? (
                                "Memproses..."
                            ) : (
                                <>
                                    Daftar Sekarang
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-50 text-center">
                        <p className="text-gray-500">
                            Sudah punya akun?{" "}
                            <Link href="/login" className="text-[#D4AF37] font-semibold hover:underline">
                                Masuk di sini
                            </Link>
                        </p>
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
