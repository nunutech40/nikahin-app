import React from "react";
import RoyalCard from "@/components/ui/RoyalCard";
import {
    Settings,
    Globe,
    ShieldCheck,
    Smartphone,
    Mail,
    CreditCard,
    Save,
    Search,
    Layout
} from "lucide-react";
import RoyalBadge from "@/components/ui/RoyalBadge";

export default function AdminSettingsPage() {
    return (
        <div className="space-y-10 max-w-5xl">
            {/* Header */}
            <div>
                <h2 className="text-4xl font-black text-slate-900 font-serif tracking-tight">Pengaturan Sistem</h2>
                <p className="text-slate-400 mt-2 font-medium">Konfigurasi global platform Nikahin.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Navigation Links (Quick Scroll) */}
                <div className="lg:col-span-1 space-y-2">
                    <div className="sticky top-10 space-y-2">
                        {[
                            { id: 'umum', label: 'Informasi Umum', icon: Layout },
                            { id: 'seo', label: 'SEO & Metadata', icon: Globe },
                            { id: 'pembayaran', label: 'Metode Pembayaran', icon: CreditCard },
                            { id: 'keamanan', label: 'Keamanan', icon: ShieldCheck },
                        ].map((item) => (
                            <button
                                key={item.id}
                                className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold text-slate-500 hover:bg-white hover:text-[#D4AF37] hover:shadow-xl hover:shadow-slate-200/50 transition-all border border-transparent hover:border-slate-100 group text-left"
                            >
                                <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                {item.label}
                            </button>
                        ))}

                        <div className="pt-6 mt-6 border-t border-slate-200">
                            <button className="w-full bg-[#D4AF37] hover:bg-[#B48C5E] text-white py-4 rounded-2xl font-black shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2">
                                <Save className="w-5 h-5" />
                                SIMPAN SEMUA
                            </button>
                        </div>
                    </div>
                </div>

                {/* Form Sections */}
                <div className="lg:col-span-2 space-y-8">
                    {/* General Section */}
                    <div id="umum">
                        <RoyalCard className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-amber-50 rounded-xl text-[#D4AF37]">
                                    <Layout className="w-5 h-5" />
                                </div>
                                <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Informasi Umum</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Platform</label>
                                    <input type="text" defaultValue="Nikahin" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Support Email</label>
                                    <input type="email" defaultValue="halo@nikahin.app" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp Support</label>
                                    <input type="text" defaultValue="081234567890" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Footer Copyright</label>
                                    <input type="text" defaultValue="© 2024 Nikahin. All rights reserved." className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700" />
                                </div>
                            </div>
                        </RoyalCard>
                    </div>

                    {/* SEO Section */}
                    <div id="seo">
                        <RoyalCard className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-blue-50 rounded-xl text-blue-500">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">SEO & Metadata Global</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Meta Title Default</label>
                                    <input type="text" defaultValue="Nikahin - Buat Undangan Pernikahan Digital Elegan" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Meta Description Default</label>
                                    <textarea rows={3} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700 resize-none">Platform terbaik untuk membuat undangan digital pernikahan dengan tema elegan, fitur lengkap, dan proses instan.</textarea>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Google Analytics ID</label>
                                    <input type="text" placeholder="G-XXXXXXXXXX" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700" />
                                </div>
                            </div>
                        </RoyalCard>
                    </div>

                    {/* Payments Section */}
                    <div id="pembayaran">
                        <RoyalCard className="space-y-6 border-l-4 border-l-emerald-500">
                            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                                        <CreditCard className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Konfigurasi Mayar.id</h3>
                                </div>
                                <RoyalBadge variant="success">PRODUCTION MODE</RoyalBadge>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mayar API Key</label>
                                    <div className="relative">
                                        <input type="password" defaultValue="***************************" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700" />
                                        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#D4AF37] uppercase">Lihat</button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mayar Webhook Secret</label>
                                    <input type="password" defaultValue="***************************" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700" />
                                </div>
                                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
                                    <Settings className="w-8 h-8 text-amber-500 shrink-0" />
                                    <p className="text-xs text-amber-800 font-medium leading-relaxed">
                                        Pastikan URL Webhook di Dashboard Mayar sudah diarahkan ke: <br />
                                        <code className="bg-white/50 px-2 py-0.5 rounded font-bold">https://nikahin.app/api/webhooks/mayar</code>
                                    </p>
                                </div>
                            </div>
                        </RoyalCard>
                    </div>

                    {/* Security Section */}
                    <div id="keamanan">
                        <RoyalCard className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-rose-50 rounded-xl text-rose-500">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Keamanan & Maintenance</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">Mode Maintenance</p>
                                        <p className="text-[10px] text-slate-400 font-medium tracking-wide">Matikan akses publik sementara untuk pemeliharaan.</p>
                                    </div>
                                    <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">Registrasi User Baru</p>
                                        <p className="text-[10px] text-slate-400 font-medium tracking-wide">Izinkan user baru mendaftar di platform.</p>
                                    </div>
                                    <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer shadow-inner shadow-emerald-600/20">
                                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                                    </div>
                                </div>
                            </div>
                        </RoyalCard>
                    </div>
                </div>
            </div>
        </div>
    );
}
