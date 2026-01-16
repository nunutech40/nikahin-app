"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Heart, Mail, Lock, LogIn, ArrowRight, CheckCircle2 } from "lucide-react";

function LoginForm() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get("registered")) {
            setShowSuccess(true);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: formData.email,
                password: formData.password,
            });

            if (result?.error) {
                setError("Email atau password salah");
                setIsSubmitting(false);
            } else {
                const session = await getSession();
                const role = (session?.user as any)?.role;

                if (role === "admin") {
                    router.push("/admin");
                } else if (role === "agency") {
                    router.push("/agency");
                } else {
                    router.push("/dashboard");
                }
                router.refresh();
            }
        } catch (err) {
            setError("Terjadi kesalahan saat masuk");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Masuk ke Akun</h2>

            {showSuccess && (
                <div className="mb-6 p-4 rounded-xl bg-green-50 text-green-700 text-sm border border-green-100 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    Registrasi berhasil! Silakan masuk dengan akun baru Anda.
                </div>
            )}

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
                    <div className="flex items-center justify-between ml-1">
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <Link href="#" className="text-xs text-[#D4AF37] hover:underline">Lupa Password?</Link>
                    </div>
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
                            Masuk Sekarang
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-50 text-center">
                <p className="text-gray-500">
                    Belum punya akun?{" "}
                    <Link href="/register" className="text-[#D4AF37] font-semibold hover:underline">
                        Daftar Gratis
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <Link href="/">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm mb-4 cursor-pointer">
                            <Heart className="w-8 h-8 text-[#D4AF37] fill-current" />
                        </div>
                    </Link>
                    <h1 className="font-serif text-3xl text-[#b28f1f] font-bold">Nikahin</h1>
                    <p className="text-gray-500 mt-2">Selamat datang kembali!</p>
                </div>

                {/* Suspense Boundary for useSearchParams */}
                <Suspense fallback={
                    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center justify-center min-h-[400px]">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
                            <p className="text-gray-400 text-sm font-medium">Memuat halaman...</p>
                        </div>
                    </div>
                }>
                    <LoginForm />
                </Suspense>

                {/* Footer Links */}
                <div className="mt-8 text-center text-gray-400 text-sm">
                    &copy; 2026 Nikahin. All rights reserved.
                </div>
            </div>
        </div>
    );
}
