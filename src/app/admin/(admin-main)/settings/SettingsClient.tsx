"use client";

import React, { useState } from "react";
import RoyalCard from "@/components/ui/RoyalCard";
import {
    Globe,
    ShieldCheck,
    Smartphone,
    CreditCard,
    Save,
    Layout,
    Package,
    RefreshCcw,
    HardDrive,
    Database
} from "lucide-react";
import RoyalBadge from "@/components/ui/RoyalBadge";
import { updateSystemSettings, getStorageStats } from "@/app/actions/admin";
import { toast } from "sonner";
import { useEffect } from "react";

interface SettingsClientProps {
    initialSettings: any;
    initialPackages: any[];
}

export default function SettingsClient({ initialSettings, initialPackages }: SettingsClientProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [packagesList, setPackagesList] = useState(initialPackages);
    const [packageLoadingId, setPackageLoadingId] = useState<number | null>(null);
    const [storageStats, setStorageStats] = useState<any>(null);
    const [isRefreshingStorage, setIsRefreshingStorage] = useState(false);
    const [settings, setSettings] = useState(initialSettings || {
        appName: "Nikahin",
        logoUrl: "",
        supportEmail: "halo@nikahin.app",
        supportWa: "081234567890",
        footerCopyright: "© 2024 Nikahin. All rights reserved.",
        instagramUrl: "https://instagram.com/nikahin",
        tiktokUrl: "https://tiktok.com/@nikahin",
        youtubeUrl: "",
        termsUrl: "/terms",
        privacyUrl: "/privacy",
        metaTitle: "Nikahin - Buat Undangan Pernikahan Digital Elegan",
        metaDesc: "Platform terbaik untuk membuat undangan digital pernikahan dengan tema elegan, fitur lengkap, dan proses instan.",
        gaId: "",
        pixelId: "",
        ogImage: "",
        heroTitle: "Abadikan Momen dengan Kesempurnaan",
        heroSubtitle: "Nikmati kebebasan kustomisasi penuh dengan puluhan tema premium, RSVP otomatis, dan gift digital tercanggih.",
        happyCouplesCount: 12400,
        mayarApiKey: "",
        mayarWebhookSecret: "",
        mayarSandbox: true,
        waProvider: "Fonnte (Recommended)",
        waToken: "",
        emailProvider: "SMTP",
        emailFromName: "Nikahin Notification",
        emailFromAddress: "notifications@nikahin.app",
        smtpHost: "smtp.gmail.com",
        smtpUser: "",
        smtpPass: "",
        smtpPort: 587,
        smtpEncryption: "TLS",
        defaultPackage: "Bronze (Trial)",
        trialDays: 7,
        referralCommission: 10,
        isMaintenance: false,
        allowRegistration: true,
        showWatermark: true,
        bankName: "BCA",
        bankAccountNumber: "1234567890",
        bankAccountName: "Nikahin Collective",
    });

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const result = await updateSystemSettings(settings);
            if (result.success) {
                toast.success("Pengaturan sistem berhasil disimpan!");
            } else {
                toast.error(result.error || "Gagal menyimpan pengaturan.");
            }
        } catch (error) {
            toast.error("Terjadi kesalahan sistem.");
        } finally {
            setIsSaving(false);
        }
    };

    const updateField = (field: string, value: any) => {
        setSettings((prev: any) => ({ ...prev, [field]: value }));
    };

    const fetchStorageStats = async () => {
        setIsRefreshingStorage(true);
        try {
            const result = await getStorageStats();
            if (result.success) setStorageStats(result);
        } finally {
            setIsRefreshingStorage(false);
        }
    };

    useEffect(() => {
        fetchStorageStats();
    }, []);

    const handlePackageUpdate = async (pkg: any) => {
        setPackageLoadingId(pkg.id);
        try {
            const { updatePackageDetails } = await import("@/app/actions/admin");
            const result = await updatePackageDetails(pkg.id, {
                name: pkg.name,
                description: pkg.description,
                price: parseInt(pkg.price),
                originalPrice: parseInt(pkg.originalPrice)
            });
            if (result.success) toast.success(`Paket ${pkg.name} berhasil diperbarui!`);
            else toast.error(result.error || "Gagal memperbarui paket.");
        } catch (error) {
            toast.error("Terjadi kesalahan sistem saat update paket.");
        } finally {
            setPackageLoadingId(null);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Navigation Links (Quick Scroll) */}
            <div className="lg:col-span-1 space-y-2">
                <div className="sticky top-10 space-y-2">
                    {[
                        { id: 'umum', label: 'Informasi Umum', icon: Layout },
                        { id: 'seo', label: 'SEO & Marketing', icon: Globe },
                        { id: 'pembayaran', label: 'Pembayaran', icon: CreditCard },
                        { id: 'paket', label: 'Manajemen Paket', icon: Package },
                        { id: 'gateway', label: 'WA & Email', icon: Smartphone },
                        { id: 'bisnis', label: 'Bisnis & Trial', icon: Package },
                        { id: 'keamanan', label: 'Keamanan', icon: ShieldCheck },
                        { id: 'storage', label: 'Storage', icon: HardDrive },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }}
                            className="w-full flex items-center gap-3 px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider text-slate-500 hover:bg-white hover:text-[#D4AF37] hover:shadow-xl hover:shadow-slate-200/50 transition-all border border-transparent hover:border-slate-100 group text-left"
                        >
                            <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            {item.label}
                        </button>
                    ))}

                    <div className="pt-6 mt-6 border-t border-slate-200">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full bg-[#D4AF37] hover:bg-[#B48C5E] text-white py-4 rounded-2xl font-black shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isSaving ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {isSaving ? "MENYIMPAN..." : "SIMPAN SEMUA"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Form Sections */}
            <div className="lg:col-span-3 space-y-8">
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
                                <input
                                    type="text"
                                    value={settings.appName}
                                    onChange={(e) => updateField("appName", e.target.value)}
                                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Logo URL (PNG)</label>
                                <input
                                    type="text"
                                    placeholder="https://..."
                                    value={settings.logoUrl}
                                    onChange={(e) => updateField("logoUrl", e.target.value)}
                                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Support Email</label>
                                <input
                                    type="email"
                                    value={settings.supportEmail}
                                    onChange={(e) => updateField("supportEmail", e.target.value)}
                                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp Support</label>
                                <input
                                    type="text"
                                    value={settings.supportWa}
                                    onChange={(e) => updateField("supportWa", e.target.value)}
                                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Footer Copyright</label>
                                <input
                                    type="text"
                                    value={settings.footerCopyright}
                                    onChange={(e) => updateField("footerCopyright", e.target.value)}
                                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Instagram URL</label>
                                <input
                                    type="text"
                                    value={settings.instagramUrl}
                                    onChange={(e) => updateField("instagramUrl", e.target.value)}
                                    placeholder="https://instagram.com/yourbrand"
                                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">TikTok URL</label>
                                <input
                                    type="text"
                                    value={settings.tiktokUrl}
                                    onChange={(e) => updateField("tiktokUrl", e.target.value)}
                                    placeholder="https://tiktok.com/@yourbrand"
                                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Terms of Service URL</label>
                                <input
                                    type="text"
                                    value={settings.termsUrl}
                                    onChange={(e) => updateField("termsUrl", e.target.value)}
                                    placeholder="/terms"
                                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Privacy Policy URL</label>
                                <input
                                    type="text"
                                    value={settings.privacyUrl}
                                    onChange={(e) => updateField("privacyUrl", e.target.value)}
                                    placeholder="/privacy"
                                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700"
                                />
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
                            <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">SEO & Marketing Tag</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hero Title (Landing Page)</label>
                                <input
                                    type="text"
                                    value={settings.heroTitle}
                                    onChange={(e) => updateField("heroTitle", e.target.value)}
                                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hero Subtitle (Landing Page)</label>
                                <textarea
                                    rows={2}
                                    value={settings.heroSubtitle}
                                    onChange={(e) => updateField("heroSubtitle", e.target.value)}
                                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700 resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Counter Pasangan Bahagia</label>
                                    <input
                                        type="number"
                                        value={settings.happyCouplesCount}
                                        onChange={(e) => updateField("happyCouplesCount", parseInt(e.target.value))}
                                        className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Meta Title Default</label>
                                    <input
                                        type="text"
                                        value={settings.metaTitle}
                                        onChange={(e) => updateField("metaTitle", e.target.value)}
                                        className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Meta Description Default</label>
                                <textarea
                                    rows={3}
                                    value={settings.metaDesc}
                                    onChange={(e) => updateField("metaDesc", e.target.value)}
                                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700 resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Google Analytics ID</label>
                                    <input
                                        type="text"
                                        placeholder="G-XXXXXXXXXX"
                                        value={settings.gaId}
                                        onChange={(e) => updateField("gaId", e.target.value)}
                                        className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Facebook Pixel ID</label>
                                    <input
                                        type="text"
                                        placeholder="1234567890"
                                        value={settings.pixelId}
                                        onChange={(e) => updateField("pixelId", e.target.value)}
                                        className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">OG Image Default (Social Share)</label>
                                <input
                                    type="text"
                                    placeholder="https://..."
                                    value={settings.ogImage}
                                    onChange={(e) => updateField("ogImage", e.target.value)}
                                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700"
                                />
                                <p className="text-[10px] text-slate-400">Rekomendasi ukuran 1200x630 px</p>
                            </div>
                        </div>
                    </RoyalCard>
                </div>

                {/* Payments Section */}
                <div id="pembayaran">
                    <RoyalCard className="space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Metode Pembayaran (Mayar)</h3>
                            </div>
                            <RoyalBadge variant="success">ACTIVE</RoyalBadge>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => updateField("mayarSandbox", !settings.mayarSandbox)}>
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">Mode Sandbox (Testing)</p>
                                    <p className="text-[10px] text-slate-400 font-medium tracking-wide">Gunakan Mayar Sandbox untuk pengetesan pembayaran.</p>
                                </div>
                                <div className={`w-10 h-5 rounded-full relative transition-colors ${settings.mayarSandbox ? 'bg-amber-500' : 'bg-slate-200'}`}>
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.mayarSandbox ? 'right-1' : 'left-1'}`} />
                                </div>
                            </div>

                            <div className="pt-6 mt-6 border-t border-slate-50 space-y-6">
                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Atur Rekening Manual (Bank Transfer)</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Bank</label>
                                        <input
                                            type="text"
                                            value={settings.bankName}
                                            onChange={(e) => updateField("bankName", e.target.value)}
                                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700"
                                            placeholder="BCA / Mandiri / BNI"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nomor Rekening</label>
                                        <input
                                            type="text"
                                            value={settings.bankAccountNumber}
                                            onChange={(e) => updateField("bankAccountNumber", e.target.value)}
                                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700"
                                            placeholder="1234567890"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Atas Nama (A/N)</label>
                                        <input
                                            type="text"
                                            value={settings.bankAccountName}
                                            onChange={(e) => updateField("bankAccountName", e.target.value)}
                                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700"
                                            placeholder="PT Nikahin Digital"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 pt-6">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mayar API Key</label>
                                <input
                                    type="password"
                                    value={settings.mayarApiKey}
                                    onChange={(e) => updateField("mayarApiKey", e.target.value)}
                                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mayar Webhook Secret</label>
                                <input
                                    type="password"
                                    value={settings.mayarWebhookSecret}
                                    onChange={(e) => updateField("mayarWebhookSecret", e.target.value)}
                                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700"
                                />
                            </div>
                        </div>
                    </RoyalCard>
                </div>

                {/* Packages Section */}
                <div id="paket">
                    <RoyalCard className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                            <div className="p-2 bg-amber-50 rounded-xl text-[#D4AF37]">
                                <Package className="w-5 h-5" />
                            </div>
                            <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Manajemen Paket & Harga</h3>
                        </div>

                        <div className="space-y-10">
                            {packagesList.map((pkg: any, idx: number) => (
                                <div key={pkg.id} className={`p-8 rounded-[32px] border ${pkg.slug === 'platinum' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100'}`}>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-50/10">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${pkg.slug === 'platinum' ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Package ID: {pkg.slug}</p>
                                                <h4 className="text-xl font-black font-serif tracking-tight italic">{pkg.name}</h4>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handlePackageUpdate(pkg)}
                                            disabled={packageLoadingId === pkg.id}
                                            className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${pkg.slug === 'platinum' ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-slate-900 hover:bg-black text-white'}`}
                                        >
                                            {packageLoadingId === pkg.id ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            {packageLoadingId === pkg.id ? 'Saving...' : `Update ${pkg.name}`}
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Nama Tampilan</label>
                                            <input
                                                type="text"
                                                value={pkg.name}
                                                onChange={(e) => {
                                                    const newList = [...packagesList];
                                                    newList[idx].name = e.target.value;
                                                    setPackagesList(newList);
                                                }}
                                                className={`w-full px-5 py-3 rounded-xl border focus:border-[#D4AF37] outline-none transition-all font-bold ${pkg.slug === 'platinum' ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-100 text-slate-700'}`}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Harga Jual (Rp)</label>
                                            <input
                                                type="number"
                                                value={pkg.price}
                                                onChange={(e) => {
                                                    const newList = [...packagesList];
                                                    newList[idx].price = e.target.value;
                                                    setPackagesList(newList);
                                                }}
                                                className={`w-full px-5 py-3 rounded-xl border focus:border-[#D4AF37] outline-none transition-all font-bold ${pkg.slug === 'platinum' ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-100 text-slate-700'}`}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Harga Diskon/Coret (Rp)</label>
                                            <input
                                                type="number"
                                                value={pkg.originalPrice}
                                                onChange={(e) => {
                                                    const newList = [...packagesList];
                                                    newList[idx].originalPrice = e.target.value;
                                                    setPackagesList(newList);
                                                }}
                                                className={`w-full px-5 py-3 rounded-xl border focus:border-[#D4AF37] outline-none transition-all font-bold ${pkg.slug === 'platinum' ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-100 text-slate-700'}`}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Keterangan Singkat</label>
                                            <input
                                                type="text"
                                                value={pkg.description}
                                                onChange={(e) => {
                                                    const newList = [...packagesList];
                                                    newList[idx].description = e.target.value;
                                                    setPackagesList(newList);
                                                }}
                                                className={`w-full px-5 py-3 rounded-xl border focus:border-[#D4AF37] outline-none transition-all font-bold ${pkg.slug === 'platinum' ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-100 text-slate-700'}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </RoyalCard>
                </div>

                {/* Gateway Section */}
                <div id="gateway">
                    <RoyalCard className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                                <Smartphone className="w-5 h-5" />
                            </div>
                            <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">WhatsApp & Email Gateway</h3>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">WhatsApp Config</p>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Provider</label>
                                    <select
                                        value={settings.waProvider}
                                        onChange={(e) => updateField("waProvider", e.target.value)}
                                        className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700 appearance-none"
                                    >
                                        <option>Fonnte (Recommended)</option>
                                        <option>Meta Official API</option>
                                        <option>Custom Webhook</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">API Token / Key</label>
                                    <input
                                        type="password"
                                        placeholder="Key..."
                                        value={settings.waToken}
                                        onChange={(e) => updateField("waToken", e.target.value)}
                                        className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Email Gateway Config</p>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Provider</label>
                                    <select
                                        value={settings.emailProvider}
                                        onChange={(e) => updateField("emailProvider", e.target.value)}
                                        className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700 appearance-none"
                                    >
                                        <option>SMTP</option>
                                        <option>Resend</option>
                                        <option>Mailgun</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sender Name</label>
                                        <input
                                            type="text"
                                            value={settings.emailFromName}
                                            onChange={(e) => updateField("emailFromName", e.target.value)}
                                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sender Email</label>
                                        <input
                                            type="text"
                                            value={settings.emailFromAddress}
                                            onChange={(e) => updateField("emailFromAddress", e.target.value)}
                                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700"
                                        />
                                    </div>
                                </div>

                                {settings.emailProvider === "SMTP" && (
                                    <div className="pt-4 mt-4 border-t border-slate-50 space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">SMTP Host</label>
                                            <input
                                                type="text"
                                                placeholder="smtp.gmail.com"
                                                value={settings.smtpHost}
                                                onChange={(e) => updateField("smtpHost", e.target.value)}
                                                className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Port</label>
                                                <input
                                                    type="number"
                                                    value={settings.smtpPort}
                                                    onChange={(e) => updateField("smtpPort", parseInt(e.target.value))}
                                                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Encryption</label>
                                                <select
                                                    value={settings.smtpEncryption}
                                                    onChange={(e) => updateField("smtpEncryption", e.target.value)}
                                                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700 appearance-none"
                                                >
                                                    <option>TLS</option>
                                                    <option>SSL</option>
                                                    <option>None</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                                                <input
                                                    type="text"
                                                    value={settings.smtpUser}
                                                    onChange={(e) => updateField("smtpUser", e.target.value)}
                                                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                                                <input
                                                    type="password"
                                                    value={settings.smtpPass}
                                                    onChange={(e) => updateField("smtpPass", e.target.value)}
                                                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </RoyalCard>
                </div>

                {/* Business Section */}
                <div id="bisnis">
                    <RoyalCard className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                            <div className="p-2 bg-purple-50 rounded-xl text-purple-600">
                                <Package className="w-5 h-5" />
                            </div>
                            <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Aturan Bisnis & Penjualan</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Paket Default Baru</label>
                                <select
                                    value={settings.defaultPackage}
                                    onChange={(e) => updateField("defaultPackage", e.target.value)}
                                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 appearance-none font-bold text-slate-700"
                                >
                                    <option>Bronze (Trial)</option>
                                    <option>Demo</option>
                                    <option>Silver</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Masa Trial (Hari)</label>
                                <input
                                    type="number"
                                    value={settings.trialDays}
                                    onChange={(e) => updateField("trialDays", parseInt(e.target.value))}
                                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold text-slate-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Komisi Referral (%)</label>
                                <input
                                    type="number"
                                    value={settings.referralCommission}
                                    onChange={(e) => updateField("referralCommission", parseInt(e.target.value))}
                                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold text-slate-700"
                                />
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
                            <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Keamanan & Global Toggle</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div
                                onClick={() => updateField("isMaintenance", !settings.isMaintenance)}
                                className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors"
                            >
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">Mode Maintenance</p>
                                    <p className="text-[10px] text-slate-400 font-medium tracking-wide">Matikan akses publik.</p>
                                </div>
                                <div className={`w-10 h-5 rounded-full relative transition-colors ${settings.isMaintenance ? 'bg-amber-500' : 'bg-slate-200'}`}>
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.isMaintenance ? 'right-1' : 'left-1'}`} />
                                </div>
                            </div>

                            <div
                                onClick={() => updateField("allowRegistration", !settings.allowRegistration)}
                                className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors"
                            >
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">Registrasi Baru</p>
                                    <p className="text-[10px] text-slate-400 font-medium tracking-wide">Izinkan pendaftaran user.</p>
                                </div>
                                <div className={`w-10 h-5 rounded-full relative transition-colors ${settings.allowRegistration ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.allowRegistration ? 'right-1' : 'left-1'}`} />
                                </div>
                            </div>

                            <div
                                onClick={() => updateField("showWatermark", !settings.showWatermark)}
                                className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 md:col-span-2 cursor-pointer hover:bg-slate-100 transition-colors"
                            >
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">Watermark Nikahin</p>
                                    <p className="text-[10px] text-slate-400 font-medium tracking-wide">Tampilkan 'Powered by' pada undangan Bronze/Silver.</p>
                                </div>
                                <div className={`w-10 h-5 rounded-full relative transition-colors ${settings.showWatermark ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.showWatermark ? 'right-1' : 'left-1'}`} />
                                </div>
                            </div>
                        </div>
                    </RoyalCard>
                </div>

                {/* Storage Management Section */}
                <div id="storage">
                    <RoyalCard className="space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-50 rounded-xl text-slate-500">
                                    <HardDrive className="w-5 h-5" />
                                </div>
                                <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Storage Management</h3>
                            </div>
                            <button
                                onClick={fetchStorageStats}
                                disabled={isRefreshingStorage}
                                className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-[#D4AF37]"
                            >
                                <RefreshCcw className={`w-4 h-4 ${isRefreshingStorage ? 'animate-spin' : ''}`} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex items-center gap-5">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm">
                                    <Database className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total File Upload</p>
                                    <p className="text-2xl font-black text-slate-900">{storageStats?.totalFiles || 0} <span className="text-xs font-medium text-slate-400">File</span></p>
                                </div>
                            </div>
                            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex items-center gap-5">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm">
                                    <HardDrive className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Disk Usage (Uploads)</p>
                                    <p className="text-2xl font-black text-slate-900">{storageStats?.formattedSize || '0 MB'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                            <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
                                <strong>Tips Maintenance:</strong> Foto yang diupload melalui dashboard otomatis dikompresi di sisi client untuk menjaga efisiensi penyimpanan. Saat ini sistem menyimpan foto di direktori <code>public/uploads/users/[userId]</code>.
                            </p>
                        </div>
                    </RoyalCard>
                </div>
            </div>
        </div>
    );
}
