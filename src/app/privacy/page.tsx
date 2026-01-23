import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#1A1612] py-20">
            <div className="max-w-4xl mx-auto px-6">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#B48C5E] transition-colors mb-12 font-bold uppercase tracking-widest text-[10px]">
                    <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
                </Link>

                <div className="bg-white rounded-[40px] p-12 md:p-20 shadow-2xl relative overflow-hidden border border-slate-100">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                        <ShieldCheck className="w-64 h-64 -rotate-12" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black font-serif mb-4 flex items-center gap-6">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                            <ShieldCheck className="w-8 h-8 text-blue-500" />
                        </div>
                        Privacy Policy
                    </h1>
                    <p className="text-slate-400 font-medium mb-12 ml-24">Terakhir Diperbarui: 23 Januari 2024</p>

                    <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed font-medium">
                        <section>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-4">1. Informasi yang Kami Kumpulkan</h2>
                            <p>Kami mengumpulkan informasi yang Anda berikan saat mendaftar, seperti nama, email, dan nomor telepon. Kami juga mengumpulkan data undangan yang Anda buat untuk tujuan fungsionalitas aplikasi.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-4">2. Keamanan Data Tamu</h2>
                            <p>Nikahin sangat menjaga privasi data tamu Anda. Data nama dan nomor telepon tamu hanya digunakan untuk pengiriman undangan via WA Blast sesuai perintah Anda dan tidak akan pernah dijual atau dibagikan ke pihak ketiga mana pun.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-4">3. Penggunaan Cookies</h2>
                            <p>Kami menggunakan cookies untuk meningkatkan pengalaman pengguna and menganalisis trafik situs. Anda dapat mengatur browser Anda untuk menolak cookies jika diinginkan.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-4">4. Hak Pengguna</h2>
                            <p>Anda berhak untuk mengakses, mengoreksi, atau meminta penghapusan data pribadi Anda dari sistem kami kapan pun melalui menu Pengaturan Profil atau menghubungi dukungan pelanggan.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-4">5. Perubahan Kebijakan</h2>
                            <p>Kebijakan ini dapat berubah sewaktu-waktu. Perubahan akan diinformasikan melalui situs kami atau email terdaftar Anda.</p>
                        </section>
                    </div>
                </div>

                <div className="mt-12 text-center text-slate-400 text-xs font-medium">
                    &copy; 2024 Nikahin. All rights reserved.
                </div>
            </div>
        </div>
    );
}
