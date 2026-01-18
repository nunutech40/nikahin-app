"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/actions/auth";
import { Heart, Mail, Phone, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DemoRegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        // Generate random name for demo user
        const randomName = `Demo User ${Math.random().toString(36).substring(7)}`;
        const randomPassword = Math.random().toString(36).substring(2, 15);

        const result = await registerUser({
            name: randomName,
            email: formData.email,
            phone: formData.phone,
            password: randomPassword,
            selectedPackage: "demo", // Auto-assign Demo package
        });

        if (result.success) {
            // Auto-login with signIn from next-auth
            const { signIn } = await import("next-auth/react");

            const loginResult = await signIn("credentials", {
                email: formData.email,
                password: randomPassword,
                redirect: false,
            });

            if (loginResult?.ok) {
                // Success! Redirect to dashboard
                router.push("/dashboard");
            } else {
                setError("Registrasi berhasil, tapi gagal auto-login. Silakan login manual.");
                setIsSubmitting(false);
            }
        } else {
            setError(result.error || "Gagal mendaftar");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center p-6 py-12">
            <div className="max-w-md w-full">
                {/* Logo/Brand */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[#D4AF37] to-[#b28f1f] shadow-2xl shadow-amber-200/50 mb-6 rotate-3">
                        <Heart className="w-10 h-10 text-white fill-current" />
                    </div>
                    <h1 className="font-serif text-4xl text-[#b28f1f] font-black tracking-tighter mb-2">
                        Coba Gratis
                    </h1>
                    <p className="text-slate-600 font-medium">
                        Test semua fitur tanpa batasan. Gratis!
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-[40px] p-10 shadow-2xl shadow-slate-200/60 border border-slate-100 relative overflow-hidden">
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50/50 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />

                    <div className="relative z-10">
                        <h2 className="text-2xl font-black text-slate-800 mb-2 text-center uppercase tracking-widest">
                            Quick Start
                        </h2>
                        <p className="text-sm text-gray-500 text-center mb-8">
                            Cukup email & WhatsApp, langsung coba!
                        </p>

                        {error && (
                            <div className="mb-8 p-4 rounded-2xl bg-rose-50 text-rose-600 text-sm border border-rose-100 text-center font-bold">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email */}
                            <div>
                                <label className="text-sm font-bold text-slate-700 ml-1 mb-2 block">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="nama@email.com"
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 outline-none transition-all placeholder:text-slate-300"
                                    />
                                </div>
                            </div>

                            {/* WhatsApp */}
                            <div>
                                <label className="text-sm font-bold text-slate-700 ml-1 mb-2 block">
                                    WhatsApp
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="08123456789"
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 outline-none transition-all placeholder:text-slate-300"
                                    />
                                </div>
                            </div>

                            {/* Info Box */}
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                                <p className="text-xs text-amber-800 font-semibold mb-2 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    Yang Anda Dapatkan:
                                </p>
                                <ul className="text-xs text-amber-700 space-y-1">
                                    <li>✓ Test SEMUA fitur premium</li>
                                    <li>✓ Edit undangan tanpa batasan</li>
                                    <li>✓ Preview real-time</li>
                                    <li>✓ Upgrade kapan saja untuk publish</li>
                                </ul>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#b28f1f] text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-amber-200/50 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group"
                            >
                                {isSubmitting ? (
                                    "Memproses..."
                                ) : (
                                    <>
                                        Mulai Coba Gratis
                                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Footer Links */}
                        <div className="mt-8 text-center space-y-2">
                            <p className="text-xs text-gray-400">
                                Sudah punya akun?{" "}
                                <Link href="/login" className="text-[#D4AF37] font-bold hover:underline">
                                    Login di sini
                                </Link>
                            </p>
                            <p className="text-xs text-gray-400">
                                Mau paket berbayar langsung?{" "}
                                <Link href="/register" className="text-[#D4AF37] font-bold hover:underline">
                                    Daftar di sini
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Trust Badge */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-400">
                        🔒 Data Anda aman. Tidak ada biaya tersembunyi.
                    </p>
                </div>
            </div>
        </div>
    );
}
