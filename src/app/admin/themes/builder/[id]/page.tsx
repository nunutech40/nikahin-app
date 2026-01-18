"use client";

import { saveThemeConfig, getThemeConfig } from "@/app/actions/theme";
import React, { useState, useEffect } from "react";
import {
    Layout,
    Type,
    Palette,
    Save,
    ArrowLeft,
    Smartphone,
    Monitor,
    Layers,
    ArrowUp,
    ArrowDown,
    Eye,
    EyeOff,
    Check,
    Loader2,
    Trash2,
    Settings
} from "lucide-react";
import Link from "next/link";
import { MASTER_THEME_CONFIG } from "@/components/themes/masterConfig";
import { STANDARD_THEME_CONFIG, MODERN_DARK_CONFIG } from "@/components/themes/presets";
import { DynamicThemeConfig, SectionBlock } from "@/types/invitation";

export default function ThemeBuilderPage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap async params (Next.js 15+)
    const { id } = React.use(params);

    // State for the configuration being edited
    const [config, setConfig] = useState<DynamicThemeConfig>(MASTER_THEME_CONFIG);
    const [activeTab, setActiveTab] = useState<'global' | 'sections' | 'settings'>('global');
    const [metadata, setMetadata] = useState<{
        name: string;
        description: string;
        category: string;
        tier: 'free' | 'gold' | 'platinum';
        isActive: boolean;
    }>({
        name: "",
        description: "",
        category: "dynamic",
        tier: "free",
        isActive: true
    });
    const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddMenu, setShowAddMenu] = useState(false);

    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const isImport = searchParams?.get('import') === 'true';

    // Fetch initial config from DB
    useEffect(() => {
        async function loadConfig() {
            // Priority 1: Check if it's an import from localStorage
            if (isImport) {
                const importData = localStorage.getItem(`import_${id}`);
                if (importData) {
                    try {
                        setConfig(JSON.parse(importData));
                        setIsLoading(false);
                        // Clean up
                        localStorage.removeItem(`import_${id}`);
                        return;
                    } catch (e) {
                        console.error("Failed to parse import data", e);
                    }
                }
            }

            try {
                const result = await getThemeConfig(id);
                if (result.success && result.config) {
                    setConfig(result.config);
                    if (result.metadata) {
                        setMetadata({
                            name: result.metadata.name,
                            description: result.metadata.description,
                            category: result.metadata.category,
                            tier: result.metadata.tier as any,
                            isActive: result.metadata.isActive
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to load theme config:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadConfig();
    }, [id, isImport]);
    // Send live updates to iframe whenever config changes
    React.useEffect(() => {
        const iframe = document.querySelector('iframe');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({
                type: 'THEME_UPDATE',
                config: config
            }, '*');
        }
    }, [config]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Using 'id' from params as slug
            const result = await saveThemeConfig(id, config, metadata);
            if (result.success) {
                alert("Tema berhasil disimpan!");
            } else {
                alert("Failed to save: " + result.error);
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while saving.");
        } finally {
            setIsSaving(false);
        }
    };

    const updateGlobalConfig = (key: keyof DynamicThemeConfig['global'], value: string) => {
        setConfig(prev => ({
            ...prev,
            global: {
                ...prev.global,
                [key]: value
            }
        }));
    };

    // --- Section Helpers ---

    const moveSection = (id: string, direction: 'up' | 'down') => {
        setConfig(prev => {
            const sections = [...prev.sections].sort((a, b) => a.order - b.order);
            const index = sections.findIndex(s => s.id === id);
            if (index === -1) return prev;

            if (direction === 'up' && index > 0) {
                // Swap orders
                const temp = sections[index - 1].order;
                sections[index - 1].order = sections[index].order;
                sections[index].order = temp;
            } else if (direction === 'down' && index < sections.length - 1) {
                // Swap orders
                const temp = sections[index + 1].order;
                sections[index + 1].order = sections[index].order;
                sections[index].order = temp;
            }

            return { ...prev, sections };
        });
    };

    const toggleSectionVisibility = (id: string) => {
        setConfig(prev => ({
            ...prev,
            sections: prev.sections.map(s =>
                s.id === id ? { ...s, isVisible: !s.isVisible } : s
            )
        }));
    };

    const removeSection = (id: string) => {
        if (!confirm("Are you sure you want to remove this section?")) return;
        setConfig(prev => ({
            ...prev,
            sections: prev.sections.filter(s => s.id !== id)
        }));
    };

    const updateSectionVariant = (id: string, variant: string) => {
        setConfig(prev => ({
            ...prev,
            sections: prev.sections.map(s =>
                s.id === id ? { ...s, variant } : s
            )
        }));
    };

    const addSection = (type: SectionBlock['type']) => {
        const newId = `${type}_${Date.now()}`;
        const variants = getVariantsForType(type);

        const newSection: SectionBlock = {
            id: newId,
            type: type,
            variant: variants[0] || 'default',
            order: config.sections.length,
            isVisible: true
        };

        setConfig(prev => ({
            ...prev,
            sections: [...prev.sections, newSection]
        }));
    };

    const getVariantsForType = (type: string) => {
        const variants: Record<string, string[]> = {
            'hero': ['fullscreen_center', 'minimal_split', 'card_overlap'],
            'quote': ['centered_simple', 'card_backdrop', 'floating_text'],
            'couple': ['card_grid', 'rounded_split', 'vertical_timeline'],
            'event': ['vertical_list', 'card_carousel'],
            'gallery': ['masonry_grid', 'standard_grid', 'carousel_slider'],
            'love_story': ['zig_zag', 'vertical_timeline', 'carousel'],
            'gift': ['card_grid', 'simple_list'],
            'rsvp': ['standard_form', 'modal_popup'],
            'closing': ['simple_centered', 'full_image']
        };
        return variants[type] || ['default'];
    };

    const getSectionName = (type: string) => {
        const names: Record<string, string> = {
            'hero': 'Sampul / Hero',
            'quote': 'Kata Mutiara',
            'couple': 'Mempelai',
            'event': 'Detail Acara',
            'love_story': 'Cerita Cinta',
            'gallery': 'Galeri Foto',
            'gift': 'Amplop Digital',
            'rsvp': 'Konfirmasi RSVP',
            'closing': 'Penutup'
        };
        return names[type] || type;
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-[100]">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
                <p className="text-slate-400 font-serif italic">Memuat Konfigurasi Tema...</p>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-slate-950 flex flex-col z-50">
            {/* 1. TOP BAR: Navigation & Actions */}
            <header className="h-16 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/themes" className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="font-bold text-slate-100">{metadata.name || "Tema Baru"}</h1>
                        <p className="text-xs text-slate-400">Slug: {id}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1">
                    <button
                        onClick={() => setPreviewMode('mobile')}
                        className={`p-2 rounded-md transition-all ${previewMode === 'mobile' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                        title="Tampilan Mobile"
                    >
                        <Smartphone className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setPreviewMode('desktop')}
                        className={`p-2 rounded-md transition-all ${previewMode === 'desktop' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                        title="Tampilan Desktop"
                    >
                        <Monitor className="w-4 h-4" />
                    </button>
                </div>

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-600 disabled:text-slate-400 text-slate-900 px-4 py-2 rounded-lg font-bold transition-colors"
                >
                    {isSaving ? (
                        <>Menyimpan...</>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Simpan Perubahan
                        </>
                    )}
                </button>
            </header>

            {/* 2. MAIN WORKSPACE */}
            <div className="flex-1 flex overflow-hidden">

                {/* 2A. LEFT SIDEBAR: Controls */}
                <aside className="w-80 border-r border-slate-800 bg-slate-900 flex flex-col shrink-0">
                    {/* Tabs */}
                    <div className="flex border-b border-slate-800 h-12">
                        <button
                            onClick={() => setActiveTab('global')}
                            className={`flex-1 flex items-center justify-center gap-2 text-sm font-bold transition-colors ${activeTab === 'global' ? 'text-amber-500 border-b-2 border-amber-500 bg-slate-800/50' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            <Palette className="w-4 h-4" /> Gaya Global
                        </button>
                        <button
                            onClick={() => setActiveTab('sections')}
                            className={`flex-1 flex items-center justify-center gap-2 text-sm font-bold transition-colors ${activeTab === 'sections' ? 'text-amber-500 border-b-2 border-amber-500 bg-slate-800/50' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            <Layers className="w-4 h-4" /> Bagian
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`flex-1 flex items-center justify-center gap-2 text-sm font-bold transition-colors ${activeTab === 'settings' ? 'text-amber-500 border-b-2 border-amber-500 bg-slate-800/50' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            <Settings className="w-4 h-4" /> Pengaturan
                        </button>
                    </div>

                    {/* Controls Content */}
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        {activeTab === 'settings' ? (
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Informasi Tema</h3>

                                    <div>
                                        <label className="text-sm text-slate-300 block mb-1">Nama Tema</label>
                                        <input
                                            type="text"
                                            value={metadata.name}
                                            placeholder="Contoh: Royal Gold Elegant"
                                            onChange={(e) => setMetadata(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm text-slate-300 block mb-1">Kategori</label>
                                        <select
                                            value={metadata.category}
                                            onChange={(e) => setMetadata(prev => ({ ...prev, category: e.target.value }))}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                        >
                                            <option value="elegant">Elegant</option>
                                            <option value="modern">Modern</option>
                                            <option value="minimalist">Minimalist</option>
                                            <option value="floral">Floral</option>
                                            <option value="dynamic">Dynamic</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-sm text-slate-300 block mb-1">Deskripsi Singkat</label>
                                        <textarea
                                            value={metadata.description}
                                            rows={2}
                                            placeholder="Jelaskan karakteristik tema ini..."
                                            onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-slate-300 block mb-1">Akses Tier</label>
                                            <select
                                                value={metadata.tier}
                                                onChange={(e) => setMetadata(prev => ({ ...prev, tier: e.target.value as any }))}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            >
                                                <option value="free">Free</option>
                                                <option value="gold">Gold</option>
                                                <option value="platinum">Platinum</option>
                                            </select>
                                            <p className="text-[10px] text-slate-500 mt-1 italic">
                                                * Gold: muncul di paket Gold & Platinum. Platinum: hanya di Platinum.
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-sm text-slate-300 block mb-1">Status</label>
                                            <div className="h-[38px] flex items-center">
                                                <button
                                                    onClick={() => setMetadata(prev => ({ ...prev, isActive: !prev.isActive }))}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${metadata.isActive ? 'bg-amber-500' : 'bg-slate-700'}`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${metadata.isActive ? 'translate-x-6' : 'translate-x-1'}`}
                                                    />
                                                </button>
                                                <span className="ml-3 text-sm text-slate-400">{metadata.isActive ? 'Aktif' : 'Non-aktif'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-800">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Identitas Unik (ID)</h3>
                                    <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                                        <code className="text-xs text-amber-500 break-all">{id}</code>
                                        <p className="text-[10px] text-slate-500 mt-2 italic">ID ini digunakan sebagai identitas teknis di database.</p>
                                    </div>
                                </div>
                            </div>
                        ) : activeTab === 'global' ? (
                            <div className="space-y-6">
                                {/* Colors */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Palet Warna</h3>

                                    <div className="grid grid-cols-1 gap-3">
                                        <div>
                                            <label className="text-sm text-slate-300 block mb-1">Warna Utama</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="color"
                                                    value={config.global.primaryColor}
                                                    onChange={(e) => updateGlobalConfig('primaryColor', e.target.value)}
                                                    className="w-10 h-10 bg-slate-800 border border-slate-700 rounded cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    value={config.global.primaryColor}
                                                    onChange={(e) => updateGlobalConfig('primaryColor', e.target.value)}
                                                    className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 uppercase"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm text-slate-300 block mb-1">Warna Sekunder</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="color"
                                                    value={config.global.secondaryColor}
                                                    onChange={(e) => updateGlobalConfig('secondaryColor', e.target.value)}
                                                    className="w-10 h-10 bg-slate-800 border border-slate-700 rounded cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    value={config.global.secondaryColor}
                                                    onChange={(e) => updateGlobalConfig('secondaryColor', e.target.value)}
                                                    className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 uppercase"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm text-slate-300 block mb-1">Warna Latar</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="color"
                                                    value={config.global.backgroundColor}
                                                    onChange={(e) => updateGlobalConfig('backgroundColor', e.target.value)}
                                                    className="w-10 h-10 bg-slate-800 border border-slate-700 rounded cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    value={config.global.backgroundColor}
                                                    onChange={(e) => updateGlobalConfig('backgroundColor', e.target.value)}
                                                    className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 uppercase"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-slate-800">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tipografi</h3>

                                    <div>
                                        <label className="text-sm text-slate-300 block mb-1">Font Judul</label>
                                        <select
                                            value={config.global.fontHeading}
                                            onChange={(e) => updateGlobalConfig('fontHeading', e.target.value)}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                        >
                                            <option value="Playfair Display">Playfair Display</option>
                                            <option value="Cinzel">Cinzel</option>
                                            <option value="Great Vibes">Great Vibes</option>
                                            <option value="Dancing Script">Dancing Script</option>
                                            <option value="Prata">Prata</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-sm text-slate-300 block mb-1">Font Isi</label>
                                        <select
                                            value={config.global.fontBody}
                                            onChange={(e) => updateGlobalConfig('fontBody', e.target.value)}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                        >
                                            <option value="Inter">Inter</option>
                                            <option value="Lato">Lato</option>
                                            <option value="Montserrat">Montserrat</option>
                                            <option value="Open Sans">Open Sans</option>
                                            <option value="Spectral">Spectral</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-slate-800">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Template Tema</h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        <button
                                            onClick={() => {
                                                if (confirm("Gunakan template Standard Elegant? Ini akan menimpa pengaturan saat ini.")) {
                                                    setConfig(STANDARD_THEME_CONFIG);
                                                }
                                            }}
                                            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-xs text-left text-slate-300 border border-slate-700 transition-colors"
                                        >
                                            Standard Elegant (Rizka Ayu)
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm("Gunakan template Modern Dark? Ini akan menimpa pengaturan saat ini.")) {
                                                    setConfig(MODERN_DARK_CONFIG);
                                                }
                                            }}
                                            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-xs text-left text-slate-300 border border-slate-700 transition-colors"
                                        >
                                            Modern Dark
                                        </button>
                                    </div>

                                    <div className="pt-4">
                                        <label className="text-[10px] text-slate-500 block mb-2 uppercase font-black tracking-widest">Import Struktur JSON</label>
                                        <button
                                            onClick={() => {
                                                const json = prompt("Paste struktur JSON tema di sini:");
                                                if (json) {
                                                    try {
                                                        const parsed = JSON.parse(json);
                                                        if (parsed.global && parsed.sections) {
                                                            setConfig(parsed);
                                                            alert("Tema berhasil di-import!");
                                                        } else {
                                                            alert("Struktur JSON tidak valid. Pastikan ada 'global' dan 'sections'.");
                                                        }
                                                    } catch (e) {
                                                        alert("Gagal membaca JSON: " + e);
                                                    }
                                                }
                                            }}
                                            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-400 py-2 rounded text-xs border border-dashed border-slate-600 transition-all"
                                        >
                                            <Layers className="w-3 h-3" /> Tempel JSON Tema
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-4 px-1">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Daftar Bagian</h3>
                                    <button
                                        onClick={() => {
                                            if (confirm("Reset semua bagian ke pengaturan awal?")) {
                                                setConfig(prev => ({ ...prev, sections: MASTER_THEME_CONFIG.sections }));
                                            }
                                        }}
                                        className="text-[10px] text-amber-500 hover:text-amber-400 font-bold"
                                    >
                                        Reset ke Default
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500 mb-4 px-1">
                                    Gunakan panah untuk mengatur urutan bagian. Atur visibilitas dan varian.
                                </p>

                                <div className="space-y-2">
                                    {[...config.sections].sort((a, b) => a.order - b.order).map((section, index) => (
                                        <div
                                            key={section.id}
                                            className={`bg-slate-800/40 border ${section.isVisible ? 'border-slate-800' : 'border-slate-800/50 grayscale opacity-60'} rounded-lg p-3 group hover:border-slate-700 transition-all`}
                                        >
                                            {/* Header Row */}
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-amber-500 transition-colors">
                                                        <Layout className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-200">{getSectionName(section.type)}</span>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        disabled={index === 0}
                                                        onClick={() => moveSection(section.id, 'up')}
                                                        className="p-1 text-slate-500 hover:text-white disabled:opacity-30"
                                                        title="Pindah Ke Atas"
                                                    >
                                                        <ArrowUp className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        disabled={index === config.sections.length - 1}
                                                        onClick={() => moveSection(section.id, 'down')}
                                                        className="p-1 text-slate-500 hover:text-white disabled:opacity-30"
                                                        title="Pindah Ke Bawah"
                                                    >
                                                        <ArrowDown className="w-4 h-4" />
                                                    </button>
                                                    <div className="w-px h-4 bg-slate-800 mx-1"></div>
                                                    <button
                                                        onClick={() => toggleSectionVisibility(section.id)}
                                                        className={`p-1 ${section.isVisible ? 'text-amber-500' : 'text-slate-600'} hover:text-white`}
                                                        title={section.isVisible ? "Sembunyikan Bagian" : "Tampilkan Bagian"}
                                                    >
                                                        {section.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                    </button>
                                                    <div className="w-px h-4 bg-slate-800 mx-1"></div>
                                                    <button
                                                        onClick={() => removeSection(section.id)}
                                                        className="p-1 text-slate-600 hover:text-rose-500 transition-colors"
                                                        title="Hapus Bagian"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Section Settings */}
                                            {section.isVisible && (
                                                <div className="mt-3 space-y-3 bg-slate-900/50 rounded p-2">
                                                    <div>
                                                        <label className="text-[10px] text-slate-500 block mb-1 uppercase font-black tracking-widest">Varian Tampilan</label>
                                                        <select
                                                            value={section.variant}
                                                            onChange={(e) => updateSectionVariant(section.id, e.target.value)}
                                                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 capitalize"
                                                        >
                                                            {getVariantsForType(section.type).map(v => (
                                                                <option key={v} value={v}>{v.replace(/_/g, ' ')}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="text-[10px] text-slate-500 block mb-1 uppercase font-black tracking-widest">Warna Latar Bagian</label>
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="color"
                                                                value={section.backgroundColor || "#ffffff"}
                                                                onChange={(e) => {
                                                                    const newColor = e.target.value;
                                                                    setConfig(prev => ({
                                                                        ...prev,
                                                                        sections: prev.sections.map(s =>
                                                                            s.id === section.id ? { ...s, backgroundColor: newColor } : s
                                                                        )
                                                                    }));
                                                                }}
                                                                className="w-6 h-6 bg-slate-800 border border-slate-700 rounded cursor-pointer p-0"
                                                            />
                                                            <button
                                                                onClick={() => {
                                                                    setConfig(prev => ({
                                                                        ...prev,
                                                                        sections: prev.sections.map(s =>
                                                                            s.id === section.id ? { ...s, backgroundColor: undefined } : s
                                                                        )
                                                                    }));
                                                                }}
                                                                className="text-[10px] text-slate-400 hover:text-white"
                                                            >
                                                                Gunakan Global
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4">
                                    {showAddMenu ? (
                                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-2 animate-in fade-in slide-in-from-bottom-2">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pilih Jenis Bagian</h4>
                                                <button onClick={() => setShowAddMenu(false)} className="text-slate-500 hover:text-white text-xs">Batal</button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                {['hero', 'quote', 'couple', 'event', 'love_story', 'gallery', 'gift', 'rsvp', 'closing'].map((type) => (
                                                    <button
                                                        key={type}
                                                        onClick={() => {
                                                            addSection(type as SectionBlock['type']);
                                                            setShowAddMenu(false);
                                                        }}
                                                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300 transition-colors flex items-center gap-2"
                                                    >
                                                        <Plus className="w-3 h-3" /> {getSectionName(type)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setShowAddMenu(true)}
                                            className="w-full flex items-center justify-center gap-2 border border-dashed border-slate-700 rounded-lg py-3 text-slate-500 hover:text-amber-500 hover:border-amber-500/50 hover:bg-slate-800/50 transition-all text-sm font-medium"
                                        >
                                            <Plus className="w-4 h-4" /> Tambah Bagian Baru
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </aside>

                {/* 2B. RIGHT AREA: Live Preview */}
                <main className="flex-1 bg-slate-950 flex items-center justify-center relative bg-checkered p-8">
                    {/* The Checkered BG pattern css class would be needed, or inline SVG */}
                    <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{
                        backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                    }}></div>

                    <div
                        className={`relative bg-white shadow-2xl transition-all duration-300 overflow-hidden border-8 border-slate-900 rounded-[3rem] ${previewMode === 'mobile'
                            ? 'w-[375px] h-[812px]' // iPhone X Dimensions
                            : 'w-full h-full rounded-md border-0 max-w-6xl mx-auto'
                            }`}
                    >
                        {/* 
                            IFRAME APPROACH:
                            Ideally we use an iframe to isolate styles.
                            src={`/demo?theme=custom&preview=true`} 
                            BUT we want real-time updates without save.
                            So we might need postMessage or render the component directly inside a contextual provider.
                            
                            Rendering Component Directly:
                            <DynamicTheme data={...} />
                            
                            Challenge: Global Styles (body font) might leak to Admin UI if not careful.
                            DynamicTheme uses scoped variables on the container, which is good.
                            But it appends <style> to head for fonts.
                            
                            For MVP: Iframe is safer and cleaner for "Preview". 
                            We can pass the config via URL param (encoded) or localStorage or postMessage.
                        */}
                        <iframe
                            title="Theme Preview"
                            src={`/demo?theme=custom`}
                            className="w-full h-full bg-white"
                        />

                        {/* Overlay just to show it's updating (mockup) */}
                        <div className="absolute top-4 right-4 bg-amber-500 text-slate-900 text-xs font-bold px-2 py-1 rounded shadow animate-pulse">
                            Live Preview
                        </div>
                    </div>
                </main>
            </div >
        </div >
    );
}

// Helper icon
function Plus({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M5 12h14" /><path d="M12 5v14" />
        </svg>
    )
}
