"use client";

import React, { useState, useEffect } from "react";
import { InvitationData, Person, Event, LoveStoryItem, Quotes, ThemeConfig } from "@/types/invitation";
import { MOCK_DATA } from "@/data/mockData";
import { DEMO_DATA } from "@/data/demoData";
import { BasicTheme } from "@/components/themes/BasicTheme";
import { invitationSchema } from "@/lib/validation";
import {
    Smartphone, Monitor, Menu, X,
    Users, Calendar, Heart, Image as ImageIcon, Gift, Music, Palette,
    Lock, LogOut, ExternalLink, Sparkles, Terminal, Copy, Share2
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
    canEditThemeConfig,
    canChangeCover,
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
    availableThemes = [],
    availablePackages = [],
    guestMode = false
}: DashboardClientProps) {
    const [debugMode, setDebugMode] = useState(false);

    // Invitation State
    const [invitationData, setInvitationData] = useState<InvitationData>(() => {
        const data = initialData?.content || (userPackageSlug === "demo" ? DEMO_DATA : MOCK_DATA);
        const baseData = userPackageSlug === "demo" ? DEMO_DATA : MOCK_DATA;

        return {
            ...baseData,
            ...data,
            // PRIORITIZE DB SLUG! The content.slug might be stale/mocked.
            slug: initialData?.slug || data?.slug || baseData.slug
        } as InvitationData;
    });

    const [invitationId, setInvitationId] = useState<number | null>(() => {
        if (initialData?.id !== undefined) return initialData.id;
        return null;
    });

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

    // ✨ PLATINUM PREVIEW FOR DEMO ✨
    // Merge user edits with beautiful DEMO_DATA and enable all Platinum features in preview
    const previewData: InvitationData = isDemo ? {
        ...DEMO_DATA,
        ...invitationData,
        // For features that are LOCKED in demo, we force the beautiful DEMO_DATA
        // For features that are OPEN in demo, we use the user's edits (invitationData)
        giftOptions: canEditGiftRegistry(userPackageSlug) ? invitationData.giftOptions : DEMO_DATA.giftOptions,
        themeConfig: canEditThemeConfig(userPackageSlug) ? invitationData.themeConfig : DEMO_DATA.themeConfig,

        // Ensure editable sections take priority
        groom: invitationData.groom || DEMO_DATA.groom,
        bride: invitationData.bride || DEMO_DATA.bride,
        events: invitationData.events || DEMO_DATA.events,
        loveStory: canEditLoveStory(userPackageSlug) ? (invitationData.loveStory || DEMO_DATA.loveStory) : DEMO_DATA.loveStory,
        gallery: canEditGallery(userPackageSlug) ? (invitationData.gallery || DEMO_DATA.gallery) : DEMO_DATA.gallery,
        quotes: canEditQuotes(userPackageSlug) ? (invitationData.quotes || DEMO_DATA.quotes) : DEMO_DATA.quotes,
        musicUrl: canEditMusic(userPackageSlug) ? (invitationData.musicUrl || DEMO_DATA.musicUrl) : DEMO_DATA.musicUrl,
        coverImage: canChangeCover(userPackageSlug) ? (invitationData.coverImage || DEMO_DATA.coverImage) : DEMO_DATA.coverImage,

        // Features override to Platinum set (using underscores consistently)
        features: [
            'love_story', 'gallery_10', 'gallery_unlimited', 'gift_registry',
            'background_music', 'custom_theme', 'rsvp_basic', 'rsvp_export',
            'quotes', 'unlimited_events', 'remove_branding', 'cover_image',
            'video_background', 'live_streaming'
        ]
    } : invitationData;

    const tabs = [
        { id: 'mempelai', label: 'Mempelai', icon: Users },
        { id: 'acara', label: 'Acara', icon: Calendar },
        { id: 'cerita', label: 'Cerita', icon: Heart },
        { id: 'galeri', label: 'Galeri', icon: ImageIcon },
        { id: 'hadiah', label: 'Hadiah', icon: Gift },
        { id: 'tampilan', label: 'Tampilan', icon: Palette },
        { id: 'lainnya', label: 'Lainnya', icon: Sparkles },
    ];

    const isTabLocked = (tabId: string) => {
        if (isDemo) {
            if (tabId === 'hadiah') return !canEditGiftRegistry(userPackageSlug);
            if (tabId === 'tampilan') return false;
            return false;
        }
        if (tabId === 'cerita') return !canUseFeature(invitationData, 'love_story');
        if (tabId === 'galeri') return !canUseFeature(invitationData, 'gallery');
        if (tabId === 'hadiah') return !canUseFeature(invitationData, 'gift_registry');
        if (tabId === 'lainnya') return !canUseFeature(invitationData, 'quotes') && !canUseFeature(invitationData, 'background_music');
        return false;
    };

    // --- HANDLERS ---
    const handleSave = async () => {
        if (isDemo && !canSaveInvitation(userPackageSlug)) {
            setUpgradeFeature("Simpan Data");
            setShowUpgradeModal(true);
            return;
        }
        const result = invitationSchema.safeParse(invitationData);
        if (!result.success) {
            setZodError(result.error);
            toast.error("Ada data yang belum valid.");
        } else {
            setZodError(null);
            if (invitationId === null) return;
            setIsSaving(true);
            try {
                const saveResult = await saveInvitation(invitationId, invitationData);
                if (saveResult.success) toast.success("Draft berhasil disimpan!");
            } catch (err) {
                toast.error("Gagal menyimpan.");
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleCoupleChange = (section: 'groom' | 'bride', field: keyof Person, value: string) => {
        setInvitationData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
    };

    const handleEventChange = (index: number, field: keyof Event, value: string) => {
        setInvitationData(prev => {
            const newEvents = [...(prev.events || [])];
            newEvents[index] = { ...newEvents[index], [field]: value };
            return { ...prev, events: newEvents };
        });
    };

    const handleEventAdd = () => {
        setInvitationData(prev => ({
            ...prev,
            events: [...(prev.events || []), { name: '', date: '', time: '', location: '', address: '', mapsLink: '' }]
        }));
    };

    const handleEventRemove = (index: number) => {
        setInvitationData(prev => ({ ...prev, events: (prev.events || []).filter((_, i) => i !== index) }));
    };

    const handleLoveStoryChange = (newLoveStory: LoveStoryItem[]) => {
        if (isDemo && !canEditLoveStory(userPackageSlug)) { setUpgradeFeature("Love Story"); setShowUpgradeModal(true); return; }
        setInvitationData(prev => ({ ...prev, loveStory: newLoveStory }));
    };

    const handleGalleryChange = (newGallery: string[]) => {
        if (isDemo && !canEditGallery(userPackageSlug)) { setUpgradeFeature("Galeri"); setShowUpgradeModal(true); return; }
        setInvitationData(prev => ({ ...prev, gallery: newGallery }));
    };

    const handleGiftOptionsChange = (newOptions: InvitationData['giftOptions']) => {
        if (isDemo && !canEditGiftRegistry(userPackageSlug)) { setUpgradeFeature("Hadiah Digital"); setShowUpgradeModal(true); return; }
        setInvitationData(prev => ({ ...prev, giftOptions: newOptions }));
    };

    const handleAddressChange = (field: keyof InvitationData['shippingAddress'], value: string) => {
        setInvitationData(prev => ({ ...prev, shippingAddress: { ...(prev.shippingAddress || {}), [field]: value } }));
    };

    const handleQuotesChange = (field: keyof Quotes, value: string) => {
        if (isDemo && !canEditQuotes(userPackageSlug)) { setUpgradeFeature("Quotes"); setShowUpgradeModal(true); return; }
        setInvitationData(prev => ({ ...prev, quotes: { ...(prev.quotes || {}), [field]: value } }));
    };

    const handleMusicChange = (value: string) => {
        if (isDemo && !canEditMusic(userPackageSlug)) { setUpgradeFeature("Musik"); setShowUpgradeModal(true); return; }
        setInvitationData(prev => ({ ...prev, musicUrl: value }));
    };

    const handleThemeConfigChange = (field: keyof ThemeConfig, value: string) => {
        if (isDemo && !canEditThemeConfig(userPackageSlug)) { setUpgradeFeature("Custom Theme"); setShowUpgradeModal(true); return; }
        setInvitationData(prev => ({ ...prev, themeConfig: { ...(prev.themeConfig || MOCK_DATA.themeConfig!), [field]: value } }));
    };

    const handleCoverChange = (value: string) => {
        if (isDemo && !canChangeCover(userPackageSlug)) { setUpgradeFeature("Cover Image"); setShowUpgradeModal(true); return; }
        setInvitationData(prev => ({ ...prev, coverImage: value }));
    };

    const handleCreateFirstInvitation = async () => {
        if (!newSlug) return;
        setIsCreating(true);
        try {
            const defaultTheme = availableThemes.find(t => t.slug === 'basic-theme') || availableThemes[0];
            const defaultPackage = availablePackages.find(p => p.slug === 'basic') || availablePackages[0];
            const result = await createInvitation(defaultTheme.id, defaultPackage.id, newSlug, MOCK_DATA);
            if (result.success) { toast.success("Selesai!"); window.location.reload(); }
        } finally { setIsCreating(false); }
    };

    if (guestMode || !initialData) {
        return (
            <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white p-12 rounded-3xl shadow-xl text-center border">
                    <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        {guestMode ? <Lock className="w-10 h-10 text-amber-500" /> : <Heart className="w-10 h-10 text-amber-500 opacity-20" />}
                    </div>
                    {guestMode ? (
                        <>
                            <h2 className="text-2xl font-serif font-bold mb-4">Mode Demo - Guest</h2>
                            <Link href="/register" className="block w-full bg-[#D4AF37] text-white py-4 rounded-2xl font-semibold">Daftar Sekarang</Link>
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-serif font-bold mb-2">Siap Buat Undangan?</h2>
                            <p className="text-slate-400 text-sm mb-8">Tentukan nama link undangan Anda (slug)</p>
                            <input type="text" value={newSlug} onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/ /g, '-'))} className="w-full px-6 py-4 rounded-2xl border bg-slate-50 mb-4 focus:bg-white outline-none transition-all" placeholder="misal: adi-sinta-wedding" />
                            <button onClick={handleCreateFirstInvitation} disabled={isCreating} className="w-full bg-[#D4AF37] hover:bg-[#b28f1f] text-white py-4 rounded-2xl font-bold shadow-lg shadow-amber-100 transition-all">
                                {isCreating ? "Sedang Proses..." : "Buat Undangan Sekarang"}
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 z-50">
                <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg">
                            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                        <h1 className="text-lg font-bold flex items-center gap-2">💍 <span className="hidden sm:inline">Nikahin</span></h1>
                        <span className={`px-2 py-0.5 rounded-full border text-[9px] font-black uppercase ${isDemo ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
                            {userPackageSlug}
                        </span>
                    </div>

                    <div className="hidden lg:flex bg-slate-100 p-1 rounded-xl">
                        <button onClick={() => setPreviewMode("mobile")} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${previewMode === "mobile" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
                            <Smartphone className="w-3.5 h-3.5 mr-2 inline" /> HP
                        </button>
                        <button onClick={() => setPreviewMode("desktop")} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${previewMode === "desktop" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
                            <Monitor className="w-3.5 h-3.5 mr-2 inline" /> DESKTOP
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href={`/${invitationData.slug}`} target="_blank" className="p-2 text-slate-400 hover:text-blue-500 transition-colors hidden sm:block"><ExternalLink className="w-4 h-4" /></Link>
                        <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 bg-[#D4AF37] hover:bg-[#b28f1f] text-white rounded-xl text-xs font-black shadow-sm disabled:opacity-50 transition-all">
                            {isSaving ? "SAVING..." : "SIMPAN"}
                        </button>
                        <button onClick={() => signOut({ callbackUrl: "/login" })} className="p-2 text-slate-400 hover:text-rose-500 ml-1 transition-colors"><LogOut className="w-4 h-4" /></button>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar Editor */}
                <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-full lg:w-[400px] xl:w-[450px] bg-white border-r transform transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} flex flex-col pt-[58px] lg:pt-0`}>
                    <div className="flex overflow-x-auto border-b bg-slate-50/30 scrollbar-hide">
                        {tabs.map((tab) => (
                            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false); }} className={`flex flex-col items-center py-4 px-3 min-w-[70px] border-b-2 transition-all relative ${activeTab === tab.id ? "border-[#D4AF37] text-[#D4AF37] bg-white" : "border-transparent text-slate-400 hover:text-slate-600"}`}>
                                <tab.icon className="w-4 h-4 mb-1.5" />
                                <span className="text-[9px] font-black uppercase tracking-wider">{tab.label}</span>
                                {isTabLocked(tab.id) && <Lock className="absolute top-2 right-2 w-2 h-2 text-slate-300" />}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
                        {activeTab === "mempelai" && <CoupleInfoForm groom={invitationData.groom} bride={invitationData.bride} onChange={handleCoupleChange} errorSource={zodError} />}
                        {activeTab === "acara" && <EventForm events={invitationData.events || []} onChange={handleEventChange} onAdd={handleEventAdd} onRemove={handleEventRemove} errorSource={zodError} canAddMore={(invitationData.events || []).length < 1 || canUseFeature(invitationData, 'unlimited_events')} />}
                        {activeTab === "cerita" && (
                            <FeatureGate canUse={isDemo ? canEditLoveStory(userPackageSlug) : canUseFeature(invitationData, 'love_story')} featureCode="love_story">
                                <LoveStoryForm loveStory={invitationData.loveStory || []} onChange={handleLoveStoryChange} errorSource={zodError} />
                            </FeatureGate>
                        )}
                        {activeTab === "galeri" && (
                            <FeatureGate canUse={isDemo ? canEditGallery(userPackageSlug) : canUseFeature(invitationData, 'gallery_10')} featureCode="gallery_10">
                                <GalleryForm gallery={invitationData.gallery || []} onChange={handleGalleryChange} errorSource={zodError} />
                            </FeatureGate>
                        )}
                        {activeTab === "hadiah" && (
                            <FeatureGate canUse={isDemo ? canEditGiftRegistry(userPackageSlug) : canUseFeature(invitationData, 'gift_registry')} featureCode="gift_registry">
                                <GiftForm giftOptions={invitationData.giftOptions || []} shippingAddress={invitationData.shippingAddress || { recipient: '', address: '' }} onGiftOptionsChange={handleGiftOptionsChange} onAddressChange={handleAddressChange} errorSource={zodError} />
                            </FeatureGate>
                        )}
                        {activeTab === "tampilan" && (
                            <ThemeSettingsForm
                                themeConfig={invitationData.themeConfig || MOCK_DATA.themeConfig!}
                                coverImage={invitationData.coverImage || ""}
                                onConfigChange={handleThemeConfigChange}
                                onCoverChange={handleCoverChange}
                                errorSource={zodError}
                                canCustomizePalette={isDemo ? canEditThemeConfig(userPackageSlug) : canUseFeature(invitationData, 'custom_theme')}
                                canCustomizeTypography={isDemo ? canEditThemeConfig(userPackageSlug) : canUseFeature(invitationData, 'custom_theme')}
                                canCustomizeCover={isDemo ? canChangeCover(userPackageSlug) : canUseFeature(invitationData, 'cover_image')}
                            />
                        )}
                        {activeTab === "lainnya" && (
                            <div className="space-y-10">
                                <FeatureGate canUse={isDemo ? canEditQuotes(userPackageSlug) : canUseFeature(invitationData, 'quotes')} featureCode="quotes">
                                    <QuotesForm quotes={invitationData.quotes || { verse: '', source: '' }} onChange={handleQuotesChange} errorSource={zodError} />
                                </FeatureGate>
                                <FeatureGate canUse={isDemo ? canEditMusic(userPackageSlug) : canUseFeature(invitationData, 'background_music')} featureCode="background_music">
                                    <MusicForm musicUrl={invitationData.musicUrl || ""} onChange={handleMusicChange} errorSource={zodError} />
                                </FeatureGate>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main Preview (The part that used to be "menceng") */}
                <main className="flex-1 bg-slate-100 p-4 lg:p-8 flex items-center justify-center overflow-hidden">
                    <div className={`
                        relative bg-white shadow-2xl transition-all duration-500 overflow-hidden
                        ${previewMode === "mobile"
                            ? "w-[375px] h-[750px] rounded-[40px] border-[12px] border-slate-900 border-x-[12px]"
                            : "w-full h-full max-w-5xl rounded-2xl border"
                        }
                    `}>
                        {/* Fake Smartphone Notch for Mobile Mode */}
                        {previewMode === "mobile" && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20 flex items-center justify-center">
                                <div className="w-10 h-1 bg-slate-800 rounded-full" />
                            </div>
                        )}

                        {/* THE THEME PREVIEW */}
                        <div className="h-full overflow-y-auto custom-scrollbar bg-white">
                            <BasicTheme
                                data={previewData}
                                guestName="Bpk. Fulan & Kel."
                                isPreview={true}
                                isMobile={previewMode === "mobile"}
                                invitationId={invitationId || undefined}
                            />
                        </div>
                    </div>

                    {/* Quick Access Debug */}
                    <button onClick={() => setDebugMode(true)} className="absolute bottom-4 right-4 p-2 bg-slate-800 text-slate-400 rounded-full opacity-20 hover:opacity-100 transition-all"><Terminal className="w-4 h-4" /></button>
                </main>
            </div>

            {/* Debug Mode Modal */}
            {debugMode && (
                <div className="fixed inset-0 z-[9999] bg-slate-900/95 text-emerald-400 p-8 font-mono overflow-auto animate-in fade-in">
                    <div className="flex justify-between items-center mb-6 border-b border-emerald-900/50 pb-4">
                        <h2 className="text-xl font-bold flex items-center gap-3">🛠️ INVITATION DEBUGGER</h2>
                        <button onClick={() => setDebugMode(false)} className="bg-emerald-500 text-slate-900 px-6 py-2 rounded-xl font-bold">CLOSE</button>
                    </div>
                    <div className="grid grid-cols-2 gap-8 text-sm">
                        <div className="space-y-2">
                            <p><span className="text-slate-500">Package:</span> {userPackageSlug}</p>
                            <p><span className="text-slate-500">Invitation ID:</span> {invitationId}</p>
                            <p><span className="text-slate-500">Preview Mode:</span> {previewMode}</p>
                        </div>
                        <pre className="bg-black/40 p-6 rounded-3xl border border-emerald-900/30 text-[10px] leading-relaxed">
                            {JSON.stringify(invitationData, null, 2)}
                        </pre>
                    </div>
                </div>
            )}

            <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} feature={upgradeFeature} message={upgradeMessage} />
        </div>
    );
}
