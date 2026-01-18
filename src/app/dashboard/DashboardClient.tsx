"use client";

import React, { useState } from "react";
import { InvitationData, Person, Event, LoveStoryItem, Quotes, ThemeConfig } from "@/types/invitation";
import { MOCK_DATA } from "@/data/mockData";
import { DEMO_DATA } from "@/data/demoData";
import { BasicTheme } from "@/components/themes/BasicTheme";
import { invitationSchema } from "@/lib/validation";
import {
    Smartphone, Monitor, Menu, X,
    Users, Calendar, Heart, Image as ImageIcon, Gift, Music, Palette,
    Lock, AlertCircle, LogOut, User, ShieldCheck, Mail,
    Copy, Share2, ExternalLink
} from "lucide-react";
import { z } from "zod";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

// Feature Gating
import { canUseFeature } from "@/lib/features";
import FeatureGate from "@/components/dashboard/FeatureGate";

// Demo Restrictions
import {
    isDemoPackage,
    canEditGallery,
    canEditLoveStory,
    canEditMusic,
    canEditQuotes,
    canEditGiftRegistry,
    canSaveInvitation,
    canCopyLink,
    canShareWhatsApp
} from "@/lib/demoRestrictions";
import { UpgradeModal } from "@/components/UpgradeModal";

// Form Components
import CoupleInfoForm from "@/components/dashboard/forms/CoupleInfoForm";
import EventForm from "@/components/dashboard/forms/EventForm";
import LoveStoryForm from "@/components/dashboard/forms/LoveStoryForm";
import GalleryForm from "@/components/dashboard/forms/GalleryForm";
import GiftForm from "@/components/dashboard/forms/GiftForm";
import QuotesForm from "@/components/dashboard/forms/QuotesForm";
import MusicForm from "@/components/dashboard/forms/MusicForm";
import ThemeSettingsForm from "@/components/dashboard/forms/ThemeSettingsForm";
import { saveInvitation, createInvitation } from "@/app/actions/invitation";

interface DashboardClientProps {
    initialData: any | null;
    userId: number;
    userRole?: string;
    userPackageSlug: string;
    availableThemes: { id: number; slug: string; name: string }[];
    availablePackages: { id: number; slug: string; name: string }[];
    guestMode?: boolean;
}

export default function DashboardClient({
    initialData,
    userId,
    userRole,
    userPackageSlug,
    availableThemes,
    availablePackages,
    guestMode = false
}: DashboardClientProps) {
    // State
    const [invitationData, setInvitationData] = useState<InvitationData>(() => {
        // Priority: 1. initialData.content, 2. DEMO_DATA (if demo), 3. MOCK_DATA
        const data = initialData?.content || (userPackageSlug === "demo" ? DEMO_DATA : MOCK_DATA);

        // Ensure critical fields exist
        const baseData = userPackageSlug === "demo" ? DEMO_DATA : MOCK_DATA;

        return {
            ...baseData,
            ...data,
            slug: data?.slug || initialData?.slug || baseData.slug
        } as InvitationData;
    });
    const [invitationId, setInvitationId] = useState<number | null>(initialData?.id || (userPackageSlug === "demo" ? 0 : null));
    const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");
    const [isSaving, setIsSaving] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newSlug, setNewSlug] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("mempelai");
    const [zodError, setZodError] = useState<z.ZodError | null>(null);

    // Upgrade Modal State
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [upgradeFeature, setUpgradeFeature] = useState("");
    const [upgradeMessage, setUpgradeMessage] = useState("");

    const isDemo = isDemoPackage(userPackageSlug);

    const handleCopyLink = () => {
        if (isDemo && !canCopyLink(userPackageSlug)) {
            setUpgradeFeature("Bagikan Undangan");
            setUpgradeMessage("Bagikan link undangan kustom Anda ke teman dan keluarga sekarang dengan paket Silver atau Gold!");
            setShowUpgradeModal(true);
            return;
        }
        const url = `${window.location.origin}/${invitationData.slug}`;
        navigator.clipboard.writeText(url);
        toast.success("Link undangan berhasil disalin!", {
            description: "Silakan bagikan ke tamu undangan Anda."
        });
    };

    const handleShareWhatsApp = () => {
        if (isDemo && !canShareWhatsApp(userPackageSlug)) {
            setUpgradeFeature("Bagikan via WhatsApp");
            setUpgradeMessage("Fitur share otomatis ke WhatsApp tersedia eksklusif untuk paket Silver dan Gold.");
            setShowUpgradeModal(true);
            return;
        }
        const url = `${window.location.origin}/${invitationData.slug}`;
        const text = `Halo! Kami mengundang Anda ke acara pernikahan kami. Lihat detailnya di sini: ${url}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    // Handlers
    const handleCoupleChange = (section: 'groom' | 'bride', field: keyof Person, value: string) => {
        setInvitationData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleEventChange = (index: number, field: keyof Event, value: string) => {
        setInvitationData(prev => {
            const newEvents = [...prev.events];
            newEvents[index] = { ...newEvents[index], [field]: value };
            return { ...prev, events: newEvents };
        });
    };

    const handleEventAdd = () => {
        setInvitationData(prev => ({
            ...prev,
            events: [...prev.events, {
                name: '',
                date: '',
                time: '',
                location: '',
                address: '',
                mapsLink: ''
            }]
        }));
    };

    const handleEventRemove = (index: number) => {
        setInvitationData(prev => ({
            ...prev,
            events: prev.events.filter((_, i) => i !== index)
        }));
    };

    const handleLoveStoryChange = (newLoveStory: LoveStoryItem[]) => {
        if (isDemo && !canEditLoveStory(userPackageSlug)) {
            setUpgradeFeature("Love Story");
            setUpgradeMessage("Bagikan perjalanan cinta kalian yang indah dengan fitur Love Story timeline yang eksklusif.");
            setShowUpgradeModal(true);
            return;
        }
        setInvitationData(prev => ({ ...prev, loveStory: newLoveStory }));
    };

    const handleGalleryChange = (newGallery: string[]) => {
        if (isDemo && !canEditGallery(userPackageSlug)) {
            setUpgradeFeature("Galeri Foto");
            setUpgradeMessage("Upload hingga puluhan foto kenangan manis kalian dengan fitur Galeri Premium.");
            setShowUpgradeModal(true);
            return;
        }
        setInvitationData(prev => ({ ...prev, gallery: newGallery }));
    };

    const handleGiftOptionsChange = (newOptions: InvitationData['giftOptions']) => {
        if (isDemo && !canEditGiftRegistry(userPackageSlug)) {
            setUpgradeFeature("Hadiah Digital");
            setUpgradeMessage("Mudahkan tamu memberikan kado atau angpao secara digital dengan fitur Gift Registry.");
            setShowUpgradeModal(true);
            return;
        }
        setInvitationData(prev => ({ ...prev, giftOptions: newOptions }));
    };

    const handleAddressChange = (field: keyof InvitationData['shippingAddress'], value: string) => {
        setInvitationData(prev => ({
            ...prev,
            shippingAddress: {
                ...prev.shippingAddress,
                [field]: value
            }
        }));
    };

    const handleQuotesChange = (field: keyof Quotes, value: string) => {
        if (isDemo && !canEditQuotes(userPackageSlug)) {
            setUpgradeFeature("Quotes & Doa");
            setUpgradeMessage("Tambahkan ayat suci atau kata-kata mutiara favorit kalian ke dalam undangan.");
            setShowUpgradeModal(true);
            return;
        }
        setInvitationData(prev => ({
            ...prev,
            quotes: {
                ...prev.quotes,
                [field]: value
            }
        }));
    };

    const handleMusicChange = (value: string) => {
        if (isDemo && !canEditMusic(userPackageSlug)) {
            setUpgradeFeature("Musik Latar");
            setUpgradeMessage("Pilih lagu romantis favorit kalian untuk menyambut tamu undangan.");
            setShowUpgradeModal(true);
            return;
        }
        setInvitationData(prev => ({ ...prev, musicUrl: value }));
    };

    const handleThemeConfigChange = (field: keyof ThemeConfig, value: string) => {
        setInvitationData(prev => ({
            ...prev,
            themeConfig: {
                ...(prev.themeConfig || MOCK_DATA.themeConfig!),
                [field]: value
            }
        }));
    };

    const handleCoverChange = (value: string) => {
        setInvitationData(prev => ({ ...prev, coverImage: value }));
    };

    const handleSave = async () => {
        if (isDemo && !canSaveInvitation(userPackageSlug)) {
            setUpgradeFeature("Simpan Undangan");
            setUpgradeMessage("Simpan data undangan Anda secara permanen dan kelola kapan saja dengan paket berbayar.");
            setShowUpgradeModal(true);
            return;
        }
        const result = invitationSchema.safeParse(invitationData);
        if (!result.success) {
            setZodError(result.error);

            // Find first error tab to redirect user
            const firstErrorPath = result.error.issues[0].path[0] as string;
            const tabMapping: Record<string, string> = {
                'groom': 'mempelai', 'bride': 'mempelai',
                'events': 'acara', 'loveStory': 'cerita',
                'gallery': 'galeri', 'giftOptions': 'hadiah',
                'quotes': 'lainnya', 'musicUrl': 'lainnya'
            };

            if (tabMapping[firstErrorPath]) {
                setActiveTab(tabMapping[firstErrorPath]);
            }

            toast.error(`Ada ${result.error.issues.length} data yang belum lengkap atau salah.`, {
                description: "Silakan cek bagian yang berwarna merah."
            });
        } else {
            setZodError(null);

            if (!invitationId) {
                toast.error("ID Undangan tidak ditemukan. Silakan hubungi admin.");
                return;
            }

            setIsSaving(true);
            try {
                const saveResult = await saveInvitation(invitationId, invitationData);
                if (saveResult.success) {
                    toast.success("Undangan kamu berhasil disimpan!");
                } else {
                    toast.error("Gagal menyimpan: " + saveResult.error);
                }
            } catch (err) {
                toast.error("Terjadi kesalahan saat menyimpan data.");
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleCreateFirstInvitation = async () => {
        if (!newSlug) {
            toast.error("Harap masukkan URL undangan (misal: nunu-wedding)");
            return;
        }

        const cleanSlug = newSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-');

        setIsCreating(true);
        try {
            // Find default theme and package IDs
            const defaultTheme = availableThemes.find(t => t.slug === 'basic-theme') || availableThemes[0];
            const defaultPackage = availablePackages.find(p => p.slug === 'basic') || availablePackages[0];

            if (!defaultTheme || !defaultPackage) {
                toast.error("Konfigurasi tema/paket tidak ditemukan.");
                return;
            }

            const result = await createInvitation(
                defaultTheme.id,
                defaultPackage.id,
                cleanSlug,
                MOCK_DATA
            );

            if (result.success) {
                toast.success("Selamat! Undangan pertama kamu berhasil dibuat.");
                // Refresh window to load new data
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                toast.error("Gagal membuat undangan: " + result.error);
            }
        } catch (err) {
            toast.error("Terjadi kesalahan saat membuat undangan.");
        } finally {
            setIsCreating(false);
        }
    };

    // Tabs Configuration
    const tabs = [
        { id: "mempelai", label: "Mempelai", icon: Users },
        { id: "acara", label: "Acara", icon: Calendar },
        { id: "cerita", label: "Cerita", icon: Heart },
        { id: "galeri", label: "Galeri", icon: ImageIcon },
        { id: "hadiah", label: "Hadiah", icon: Gift },
        { id: "tampilan", label: "Tampilan", icon: Palette },
        { id: "lainnya", label: "Lainnya", icon: Music },
    ];

    // Guest Mode: Show demo editor with CTA to register
    if (guestMode || !initialData) {
        return (
            <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4 text-center">
                <div className="max-w-md bg-white p-12 rounded-3xl shadow-xl border border-gray-100">
                    <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        {guestMode ? (
                            <Lock className="w-10 h-10 text-amber-500" />
                        ) : (
                            <Heart className="w-10 h-10 text-amber-500 fill-current opacity-20" />
                        )}
                    </div>

                    {guestMode ? (
                        <>
                            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">
                                Mode Demo - Guest
                            </h2>
                            <p className="text-gray-500 mb-8">
                                Daftar sekarang untuk menyimpan dan mempublish undangan Anda!
                            </p>

                            <div className="space-y-3">
                                <Link
                                    href="/register"
                                    className="block w-full bg-[#D4AF37] hover:bg-[#b28f1f] text-white py-4 rounded-2xl font-semibold shadow-lg shadow-[#D4AF37]/20 transition-all"
                                >
                                    Daftar Gratis Sekarang
                                </Link>
                                <Link
                                    href="/login"
                                    className="block w-full text-sm text-gray-400 hover:text-gray-600 transition-colors py-2"
                                >
                                    Sudah punya akun? Login
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">
                                Kamu Belum Punya Undangan
                            </h2>
                            <p className="text-gray-500 mb-8">
                                Wah, mulai buat undangan pertamamu sekarang dan rayakan hari bahagiamu!
                            </p>

                            <div className="mb-6 text-left">
                                <label className="text-sm font-medium text-gray-700 ml-1 mb-2 block">
                                    Masukkan URL Undangan
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                                        nikahin.com/
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="misal: nunu-wedding"
                                        value={newSlug}
                                        onChange={(e) => setNewSlug(e.target.value)}
                                        className="w-full pl-[95px] pr-4 py-4 rounded-2xl border border-gray-200 focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 outline-none transition-all placeholder:text-gray-300"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleCreateFirstInvitation}
                                disabled={isCreating}
                                className="w-full bg-[#D4AF37] hover:bg-[#b28f1f] text-white py-4 rounded-2xl font-semibold shadow-lg shadow-[#D4AF37]/20 transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {isCreating ? "Sedang Membuat..." : "Buat Undangan Sekarang"}
                            </button>
                            <button
                                onClick={() => signOut({ callbackUrl: "/login" })}
                                className="block w-full mt-6 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                Atau keluar dari akun
                            </button>

                            {userRole === 'admin' && (
                                <div className="mt-8 pt-8 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.2em] mb-3">
                                        Administrator Access
                                    </p>
                                    <Link
                                        href="/admin"
                                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl shadow-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 hover:bg-slate-800"
                                    >
                                        <ShieldCheck className="w-5 h-5 text-amber-500" />
                                        Masuk ke Admin Panel
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        );
    }

    if (!invitationData) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-900">Gagal Memuat Data</h2>
                    <p className="text-slate-500 mt-2">Maaf, terjadi kesalahan saat memuat data undangan.</p>
                    <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-[#D4AF37] text-white rounded-lg">Coba Lagi</button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 shadow-sm z-50">
                <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                        <div className="flex items-center gap-3">
                            <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                💍 <span className="hidden sm:inline">Nikahin</span>
                            </h1>
                            <div className={`hidden xs:flex items-center gap-1.5 px-2 py-1 rounded-md border ${isDemo ? 'bg-rose-50 border-rose-100' : 'bg-amber-50 border-amber-100'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDemo ? 'bg-rose-400' : 'bg-amber-400'}`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${isDemo ? 'text-rose-700' : 'text-amber-700'}`}>
                                    {isDemo ? 'Demo Mode' : 'Free Tier'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:flex bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => setPreviewMode("mobile")}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${previewMode === "mobile" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                                }`}
                        >
                            <Smartphone className="w-4 h-4" /> Mobile
                        </button>
                        <button
                            onClick={() => setPreviewMode("desktop")}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${previewMode === "desktop" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                                }`}
                        >
                            <Monitor className="w-4 h-4" /> Desktop
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCopyLink}
                            className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all hidden sm:flex"
                            title="Salin Link"
                        >
                            <Copy className="w-5 h-5" />
                        </button>

                        <button
                            onClick={handleShareWhatsApp}
                            className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all hidden sm:flex"
                            title="Share WA"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>

                        <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />

                        <Link
                            href={`/${invitationData.slug}`}
                            target="_blank"
                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all flex items-center gap-2"
                            title="Lihat Undangan"
                        >
                            <ExternalLink className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Live Preview</span>
                        </Link>

                        <Link
                            href="/dashboard/rsvp"
                            className="bg-slate-50 p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all relative group flex items-center gap-2"
                            title="RSVP Inbox"
                        >
                            <Mail className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-widest pr-1 hidden sm:inline">RSVP</span>
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                        </Link>

                        <div className="w-px h-6 bg-slate-200 mx-1" />

                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-4 py-2 bg-[#D4AF37] text-white rounded-lg text-sm font-bold hover:bg-[#b28f1f] transition-all shadow-sm shadow-amber-200 disabled:opacity-50"
                        >
                            {isSaving ? "Saving..." : "Save"}
                        </button>

                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="bg-slate-100 p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all ml-2"
                            title="Keluar"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Fixed Sidebar for Forms */}
                <aside
                    className={`
                        fixed lg:static inset-y-0 left-0 z-40
                        w-full lg:w-[400px] xl:w-[450px]
                        bg-white border-r border-slate-200
                        transform transition-transform duration-300 ease-in-out
                        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                        flex flex-col pt-[60px] lg:pt-0
                    `}
                >
                    {/* Tabs Navigation */}
                    <div className="flex overflow-x-auto border-b border-slate-200 scrollbar-hide">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex flex-col items-center justify-center min-w-[70px] py-3 px-2 gap-1
                                    text-[10px] font-medium transition-colors border-b-2 relative
                                    ${activeTab === tab.id
                                        ? "border-[#D4AF37] text-[#D4AF37] bg-amber-50/50"
                                        : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50"}
                                `}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.label}

                                {/* Lock Icon for restricted features (Both Demo & Paid) */}
                                {((tab.id === 'cerita' && !canUseFeature(invitationData, 'love_story')) ||
                                    (tab.id === 'galeri' && !canUseFeature(invitationData, 'gallery')) ||
                                    (tab.id === 'hadiah' && !canUseFeature(invitationData, 'gift_registry')) ||
                                    (tab.id === 'lainnya' && !canUseFeature(invitationData, 'quotes') && !canUseFeature(invitationData, 'background_music'))
                                ) && (
                                        <div className="absolute top-1 right-1">
                                            <Lock className="w-2.5 h-2.5 text-slate-400" />
                                        </div>
                                    )}
                            </button>
                        ))}
                    </div>

                    {/* Form Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                        {activeTab === "mempelai" && (
                            <CoupleInfoForm
                                groom={invitationData.groom}
                                bride={invitationData.bride}
                                onChange={handleCoupleChange}
                                errorSource={zodError}
                            />
                        )}
                        {activeTab === "acara" && (
                            <EventForm
                                events={invitationData.events}
                                onChange={handleEventChange}
                                onAdd={handleEventAdd}
                                onRemove={handleEventRemove}
                                errorSource={zodError}
                                canAddMore={invitationData.events.length < 1 || canUseFeature(invitationData, 'multi-event')}
                            />
                        )}
                        {activeTab === "cerita" && (
                            <FeatureGate canUse={canUseFeature(invitationData, 'love_story')} featureCode="love_story">
                                <LoveStoryForm
                                    loveStory={invitationData.loveStory}
                                    onChange={handleLoveStoryChange}
                                    errorSource={zodError}
                                />
                            </FeatureGate>
                        )}
                        {activeTab === "galeri" && (
                            <FeatureGate canUse={canUseFeature(invitationData, 'gallery')} featureCode="gallery_10">
                                <GalleryForm
                                    gallery={invitationData.gallery}
                                    onChange={handleGalleryChange}
                                    errorSource={zodError}
                                />
                            </FeatureGate>
                        )}
                        {activeTab === "hadiah" && (
                            <FeatureGate canUse={canUseFeature(invitationData, 'gift_registry')} featureCode="gift_registry">
                                <GiftForm
                                    giftOptions={invitationData.giftOptions}
                                    shippingAddress={invitationData.shippingAddress}
                                    onGiftOptionsChange={handleGiftOptionsChange}
                                    onAddressChange={handleAddressChange}
                                    errorSource={zodError}
                                />
                            </FeatureGate>
                        )}
                        {activeTab === "tampilan" && (
                            <ThemeSettingsForm
                                themeConfig={invitationData.themeConfig || MOCK_DATA.themeConfig!}
                                coverImage={invitationData.coverImage || ""}
                                onConfigChange={handleThemeConfigChange}
                                onCoverChange={handleCoverChange}
                                errorSource={zodError}
                                canCustomizePalette={canUseFeature(invitationData, 'custom_theme')}
                                canCustomizeTypography={canUseFeature(invitationData, 'custom_theme')}
                                canCustomizeCover={canUseFeature(invitationData, 'cover_image')}
                            />
                        )}
                        {activeTab === "lainnya" && (
                            <div className="space-y-8">
                                <FeatureGate canUse={canUseFeature(invitationData, 'quotes')} featureCode="quotes">
                                    <QuotesForm
                                        quotes={invitationData.quotes}
                                        onChange={handleQuotesChange}
                                        errorSource={zodError}
                                    />
                                </FeatureGate>

                                <FeatureGate canUse={canUseFeature(invitationData, 'background_music')} featureCode="background_music">
                                    <MusicForm
                                        musicUrl={invitationData.musicUrl}
                                        onChange={handleMusicChange}
                                        errorSource={zodError}
                                    />
                                </FeatureGate>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Mobile Overlay */}
                {isSidebarOpen && (
                    <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
                )}

                {/* Preview Area */}
                <main className="flex-1 overflow-hidden bg-slate-100 relative">
                    <div className="absolute inset-0 flex items-center justify-center p-4 lg:p-8">
                        {previewMode === "mobile" ? (
                            <div className="relative animate-in zoom-in duration-300">
                                <div className="relative bg-slate-900 rounded-[3rem] p-3 shadow-2xl ring-8 ring-slate-900/10">
                                    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-inner w-[360px] h-[640px] md:h-[700px]">
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-slate-900 rounded-b-xl z-50"></div>
                                        <div className="h-full w-full overflow-y-auto scrollbar-hide pb-10">
                                            <BasicTheme
                                                data={invitationData}
                                                guestName="Tamu Undangan"
                                                isPreview={true}
                                                isMobile={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-full max-w-6xl animate-in fade-in duration-300">
                                <div className="bg-white rounded-xl shadow-2xl overflow-hidden h-full flex flex-col border border-slate-200">
                                    <div className="h-10 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-2 flex-shrink-0">
                                        <div className="flex gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-red-400" />
                                            <div className="w-3 h-3 rounded-full bg-amber-400" />
                                            <div className="w-3 h-3 rounded-full bg-emerald-400" />
                                        </div>
                                        <div className="flex-1 ml-4 flex justify-center">
                                            <div className="bg-white border border-slate-200 rounded-md px-4 py-1 text-xs text-slate-500 w-1/2 text-center font-mono">
                                                nikahin.com/{invitationData.slug}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto">
                                        <BasicTheme
                                            data={invitationData}
                                            guestName="Tamu Undangan"
                                            isPreview={true}
                                            isMobile={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Upgrade Modal */}
            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                feature={upgradeFeature}
                message={upgradeMessage}
            />
        </div>
    );
}
