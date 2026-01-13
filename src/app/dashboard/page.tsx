"use client";

import React, { useState } from "react";
import { InvitationData, Person, Event, LoveStoryItem, Quotes } from "@/types/invitation";
import { MOCK_DATA } from "@/data/mockData";
import { BasicTheme } from "@/components/themes/BasicTheme";
import { invitationSchema } from "@/lib/validation";
import {
    Smartphone, Monitor, Menu, X,
    Users, Calendar, Heart, Image as ImageIcon, Gift, Music
} from "lucide-react";

// Form Components
import CoupleInfoForm from "@/components/dashboard/forms/CoupleInfoForm";
import EventForm from "@/components/dashboard/forms/EventForm";
import LoveStoryForm from "@/components/dashboard/forms/LoveStoryForm";
import GalleryForm from "@/components/dashboard/forms/GalleryForm";
import GiftForm from "@/components/dashboard/forms/GiftForm";
import QuotesForm from "@/components/dashboard/forms/QuotesForm";
import MusicForm from "@/components/dashboard/forms/MusicForm";

export default function DashboardPage() {
    // State
    const [invitationData, setInvitationData] = useState<InvitationData>(MOCK_DATA);
    const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("mempelai");
    const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});

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

    const handleSave = () => {
        const result = invitationSchema.safeParse(invitationData);
        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            setErrors(fieldErrors);
            alert("Terjadi kesalahan validasi. Mohon periksa kembali inputan Anda (Kotak merah).");
            console.error("Validation Errors:", fieldErrors);
        } else {
            setErrors({});
            alert("Undangan Valid! Perubahan siap disimpan (Simulasi).");
            // Here we will call the Server Action later
        }
    };

    // Tabs Configuration
    const tabs = [
        { id: "mempelai", label: "Mempelai", icon: Users },
        { id: "acara", label: "Acara", icon: Calendar },
        { id: "cerita", label: "Cerita", icon: Heart },
        { id: "galeri", label: "Galeri", icon: ImageIcon },
        { id: "hadiah", label: "Hadiah", icon: Gift },
        { id: "lainnya", label: "Lainnya", icon: Music },
    ];

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

                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-dark)] transition-all shadow-sm"
                    >
                        Simpan Perubahan
                    </button>
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
                                errors={errors}
                            />
                        )}
                        {activeTab === "acara" && (
                            <EventForm
                                events={invitationData.events}
                                onChange={handleEventChange}
                                onAdd={handleEventAdd}
                                onRemove={handleEventRemove}
                                errors={errors}
                            />
                        )}
                        {activeTab === "cerita" && (
                            <LoveStoryForm
                                loveStory={invitationData.loveStory}
                                onChange={handleLoveStoryChange}
                                errors={errors}
                            />
                        )}
                        {activeTab === "galeri" && (
                            <GalleryForm
                                gallery={invitationData.gallery}
                                onChange={handleGalleryChange}
                                errors={errors}
                            />
                        )}
                        {activeTab === "hadiah" && (
                            <GiftForm
                                giftOptions={invitationData.giftOptions}
                                shippingAddress={invitationData.shippingAddress}
                                onGiftOptionsChange={handleGiftOptionsChange}
                                onAddressChange={handleAddressChange}
                                errors={errors}
                            />
                        )}
                        {activeTab === "lainnya" && (
                            <div className="space-y-8">
                                <QuotesForm
                                    quotes={invitationData.quotes}
                                    onChange={handleQuotesChange}
                                    errors={errors}
                                />
                                <MusicForm
                                    musicUrl={invitationData.musicUrl}
                                    onChange={handleMusicChange}
                                    errors={errors}
                                />
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
