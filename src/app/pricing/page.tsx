"use client";

import Link from "next/link";
import { ArrowLeft, Check, Sparkles, Heart } from "lucide-react";
import { PricingCard } from "@/components/PricingCard";

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-[#FFFBF5]">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-white transition-all">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-gray-500">Beranda</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <Heart className="w-6 h-6 text-[#D4AF37] fill-current" />
                        <span className="font-serif text-2xl font-black text-[#D4AF37]">Nikahin</span>
                    </div>

                    <div className="w-20" /> {/* Spacer */}
                </div>
            </header>

            <main className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-[#D4AF37] font-black uppercase tracking-[0.3em] text-sm mb-4">Pricing & Packages</p>
                        <h1 className="font-serif text-5xl md:text-6xl font-black text-gray-900 mb-6">
                            Pilih Paket <span className="text-[#D4AF37]">Kebahagiaanmu</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Tentukan paket yang paling sesuai dengan kebutuhan acaramu.
                            Semua paket bisa dicoba gratis terlebih dahulu!
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <PricingCard
                            name="Silver"
                            price={150000}
                            description="Sangat pas untuk acara keluarga"
                            features={[
                                "Fitur Bronze +",
                                "Love Story Timeline",
                                "Galeri Foto (10)",
                                "Musik Latar Premium",
                                "Hingga 2 Acara",
                                "Quotes & Doa"
                            ]}
                            packageSlug="silver"
                            popular={false}
                        />

                        <PricingCard
                            name="Gold"
                            price={300000}
                            description="Pilihan favorit pasangan bahagia"
                            features={[
                                "Fitur Silver +",
                                "Unlimited Galeri Foto",
                                "Hadiah Digital (Angpao)",
                                "Kustom Warna & Font",
                                "Hapus Branding Nikahin",
                                "Support Prioritas"
                            ]}
                            packageSlug="gold"
                            popular={true}
                        />

                        <PricingCard
                            name="Platinum"
                            price={500000}
                            description="Undangan eksklusif tanpa batas"
                            features={[
                                "Fitur Gold +",
                                "Custom Domain (.com)",
                                "Video Background",
                                "Live Streaming Integration",
                                "WhatsApp Blast RSVP",
                                "VIP Dedicated Support"
                            ]}
                            packageSlug="platinum"
                            popular={false}
                        />
                    </div>

                    {/* FAQ Mini */}
                    <div className="mt-24 max-w-3xl mx-auto bg-white rounded-[40px] p-12 border border-amber-100 shadow-xl shadow-amber-900/5">
                        <h2 className="text-3xl font-black text-gray-800 mb-8 text-center italic">Pertanyaan Populer</h2>
                        <div className="space-y-8">
                            <div className="flex gap-6">
                                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center shrink-0 text-[#D4AF37] font-black">?</div>
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-2 underline decoration-amber-200 decoration-4">Kapan saya harus membayar?</h4>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Anda bisa mendaftar dan mencoba membuat undangan secara GRATIS. Pembayaran hanya diperlukan saat Anda ingin mengaktifkan link undangan agar bisa disebar ke tamu.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center shrink-0 text-[#D4AF37] font-black">?</div>
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-2 underline decoration-amber-200 decoration-4">Berapa lama undangan saya aktif?</h4>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Undangan Anda akan tetap aktif selamanya (Life-time Access) setelah satu kali pembayaran. Tidak ada biaya langganan bulanan.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
