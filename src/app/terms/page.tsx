import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, ScrollText } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#1A1612] py-20">
            <div className="max-w-4xl mx-auto px-6">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#B48C5E] transition-colors mb-12 font-bold uppercase tracking-widest text-[10px]">
                    <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
                </Link>

                <div className="bg-white rounded-[40px] p-12 md:p-20 shadow-2xl relative overflow-hidden border border-slate-100">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                        <ScrollText className="w-64 h-64 -rotate-12" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black font-serif mb-4 flex items-center gap-6">
                        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center">
                            <ScrollText className="w-8 h-8 text-[#B48C5E]" />
                        </div>
                        Terms of Service
                    </h1>
                    <p className="text-slate-400 font-medium mb-12 ml-24">Terakhir Diperbarui: 23 Januari 2024</p>

                    <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed font-medium">
                        <section>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-4">1. Penerimaan Ketentuan</h2>
                            <p>Dengan mengakses and menggunakan platform Nikahin, Anda setuju untuk terikat oleh Ketentuan Layanan ini. Jika Anda tidak setuju, mohon untuk tidak menggunakan layanan kami.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-4">2. Layanan Kami</h2>
                            <p>Nikahin menyediakan platform pembuatan undangan pernikahan digital. Layanan kami mencakup penyediaan tema, manajemen tamu (RSVP), dan fitur pendukung lainnya sesuai dengan paket yang Anda pilih.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-4">3. Akun Pengguna</h2>
                            <p>Anda bertanggung jawab untuk menjaga kerahasiaan akun dan password Anda. Nikahin tidak bertanggung jawab atas kerugian yang timbul akibat penyalahgunaan akun Anda oleh pihak ketiga.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-4">4. Kebijakan Pembayaran</h2>
                            <p>Pembayaran untuk paket Premium dilakukan di muka. Semua transaksi yang sudah berhasil tidak dapat dibatalkan atau dikembalikan (Refund Policy), kecuali terdapat kesalahan sistem fatal yang tidak dapat diperbaiki oleh tim kami.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-4">5. Konten Pengguna</h2>
                            <p>Anda memegang hak cipta penuh atas konten (foto, teks) yang Anda unggah ke undangan Anda. Namun, Anda dilarang mengunggah konten yang melanggar hukum, mengandung pornografi, atau menyinggung SARA.</p>
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
