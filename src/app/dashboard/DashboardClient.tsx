"use client";

import React, { useState } from "react";
import { InvitationData, Person, Event, LoveStoryItem, Quotes, ThemeConfig } from "@/types/invitation";
import { MOCK_DATA } from "@/data/mockData";
import { BasicTheme } from "@/components/themes/BasicTheme";
import { invitationSchema } from "@/lib/validation";
import {
    Smartphone, Monitor, Menu, X,
    Users, Calendar, Heart, Image as ImageIcon, Gift, Music, Palette,
    Lock, AlertCircle, LogOut, User
} from "lucide-react";
import { z } from "zod";
import Link from "next/link";
import { signOut } from "next-auth/react";

// Feature Gating
import { canUseFeature } from "@/lib/features";
import FeatureGate from "@/components/dashboard/FeatureGate";

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
    availableThemes: { id: number; slug: string; name: string }[];
    availablePackages: { id: number; slug: string; name: string }[];
}

export default function DashboardPage({
    initialData,
    userId,
    availableThemes,
    availablePackages
}: DashboardClientProps) {
    // State
    const [invitationData, setInvitationData] = useState<InvitationData>(
        initialData?.content || MOCK_DATA
    );
    const [invitationId, setInvitationId] = useState<number | null>(initialData?.id || null);
    const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");
    const [isSaving, setIsSaving] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newSlug, setNewSlug] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("mempelai");
    const [zodError, setZodError] = useState<z.ZodError | null>(null);

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
        setInvitationData(prev => ({ ...prev, loveStory: newLoveStory }));
    };

    const handleGalleryChange = (newGallery: string[]) => {
        setInvitationData(prev => ({ ...prev, gallery: newGallery }));
    };

    const handleGiftOptionsChange = (newOptions: InvitationData['giftOptions']) => {
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
        setInvitationData(prev => ({
            ...prev,
            quotes: {
                ...prev.quotes,
                [field]: value
            }
        }));
    };

    const handleMusicChange = (value: string) => {
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

            alert(`Ada ${result.error.issues.length} data yang belum lengkap atau salah. Silakan cek bagian yang berwarna merah.`);
        } else {
            setZodError(null);

            if (!invitationId) {
                alert("ID Undangan tidak ditemukan. Silakan hubungi admin.");
                return;
            }

            setIsSaving(true);
            try {
                const saveResult = await saveInvitation(invitationId, invitationData);
                if (saveResult.success) {
                    alert("✅ Undangan kamu berhasil disimpan!");
                } else {
                    alert("❌ Gagal menyimpan: " + saveResult.error);
                }
            } catch (err) {
                alert("❌ Terjadi kesalahan saat menyimpan data.");
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleCreateFirstInvitation = async () => {
        if (!newSlug) {
            alert("Harap masukkan URL undangan (misal: nunu-wedding)");
            return;
        }

        const cleanSlug = newSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-');

        setIsCreating(true);
        try {
            // Find default theme and package IDs
            const defaultTheme = availableThemes.find(t => t.slug === 'basic-theme') || availableThemes[0];
            const defaultPackage = availablePackages.find(p => p.slug === 'basic') || availablePackages[0];

            if (!defaultTheme || !defaultPackage) {
                alert("Konfigurasi tema/paket tidak ditemukan.");
                return;
            }

            const result = await createInvitation(
                defaultTheme.id,
                defaultPackage.id,
                cleanSlug,
                MOCK_DATA
            );

            if (result.success) {
                // Refresh window to load new data
                window.location.reload();
            } else {
                alert("❌ Gagal membuat undangan: " + result.error);
            }
        } catch (err) {
            alert("❌ Terjadi kesalahan saat membuat undangan.");
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

    if (!initialData) {
        return (
            <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4 text-center">
                <div className="max-w-md bg-white p-12 rounded-3xl shadow-xl border border-gray-100">
                    <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Heart className="w-10 h-10 text-amber-500 fill-current opacity-20" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">Kamu Belum Punya Undangan</h2>
                    <p className="text-gray-500 mb-8">Wah, mulai buat undangan pertamamu sekarang dan rayakan hari bahagiamu!</p>

                    <div className="mb-6 text-left">
                        <label className="text-sm font-medium text-gray-700 ml-1 mb-2 block">Masukkan URL Undangan</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">nikahin.com/</span>
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
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 shadow-sm z-50">
                <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                💍 <span className="hidden sm:inline">Nikahin Dashboard</span>
                            </h1>
                        </div>
                    </div>

                    <div className="hidden md:flex bg-slate-100 p-1 rounded-lg">
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
                        <Link
                            href="/dashboard/profile"
                            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors hidden sm:flex"
                            title="Profil Saya"
                        >
                            <User className="w-5 h-5" />
                        </Link>

                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-dark)] transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSaving ? "Menyimpan..." : "Simpan"}
                        </button>

                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                                    text-[10px] font-medium transition-colors border-b-2
                                    ${activeTab === tab.id
                                        ? "border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/5"
                                        : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50"}
                                `}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.label}
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
                            <FeatureGate canUse={canUseFeature(invitationData, 'love-story')} featureCode="love-story">
                                <LoveStoryForm
                                    loveStory={invitationData.loveStory}
                                    onChange={handleLoveStoryChange}
                                    errorSource={zodError}
                                />
                            </FeatureGate>
                        )}
                        {activeTab === "galeri" && (
                            <FeatureGate canUse={canUseFeature(invitationData, 'gallery')} featureCode="gallery">
                                <GalleryForm
                                    gallery={invitationData.gallery}
                                    onChange={handleGalleryChange}
                                    errorSource={zodError}
                                />
                            </FeatureGate>
                        )}
                        {activeTab === "hadiah" && (
                            <FeatureGate canUse={canUseFeature(invitationData, 'gift-registry')} featureCode="gift-registry">
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
                            <FeatureGate canUse={canUseFeature(invitationData, 'custom-theme')} featureCode="custom-theme">
                                <ThemeSettingsForm
                                    themeConfig={invitationData.themeConfig || MOCK_DATA.themeConfig!}
                                    coverImage={invitationData.coverImage || ""}
                                    onConfigChange={handleThemeConfigChange}
                                    onCoverChange={handleCoverChange}
                                    errorSource={zodError}
                                />
                            </FeatureGate>
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

                                <FeatureGate canUse={canUseFeature(invitationData, 'background-music')} featureCode="background-music">
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
        </div>
    );
}
