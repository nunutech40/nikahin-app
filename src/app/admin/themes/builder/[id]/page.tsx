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
    Trash2
} from "lucide-react";
import Link from "next/link";
import { MASTER_THEME_CONFIG } from "@/components/themes/masterConfig";
import { DynamicThemeConfig, SectionBlock } from "@/types/invitation";

export default function ThemeBuilderPage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap async params (Next.js 15+)
    const { id } = React.use(params);

    // State for the configuration being edited
    const [config, setConfig] = useState<DynamicThemeConfig>(MASTER_THEME_CONFIG);
    const [activeTab, setActiveTab] = useState<'global' | 'sections'>('global');
    const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddMenu, setShowAddMenu] = useState(false);

    // Fetch initial config from DB
    useEffect(() => {
        async function loadConfig() {
            try {
                const result = await getThemeConfig(id);
                if (result.success && result.config) {
                    setConfig(result.config);
                }
            } catch (error) {
                console.error("Failed to load theme config:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadConfig();
    }, [id]);

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
            const result = await saveThemeConfig(id, config);
            if (result.success) {
                alert("Theme configuration saved successfully!");
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
        // This is a naive mapping. Ideally this comes from a central registry or section component
        const variants: Record<string, string[]> = {
            'hero': ['fullscreen_center', 'fullscreen_simple', 'split_screen'],
            'couple': ['classic_circle', 'modern_card', 'minimal_split'],
            'event': ['timeline_vertical', 'grid_cards', 'classic_list'],
            'gallery': ['grid_masonry', 'carousel', 'grid_bento'],
            'quote': ['simple_centered', 'card_w_icon', 'parallax_bg'],
            'love_story': ['timeline_zigzag', 'story_cards'],
            'gift': ['bank_cards', 'simple_list', 'qr_popup'],
            'rsvp': ['simple_form', 'card_style'],
            'closing': ['simple_centered', 'image_bg_overlay']
        };
        return variants[type] || ['default'];
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-[100]">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
                <p className="text-slate-400 font-serif italic">Loading Theme Configuration...</p>
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
                        <h1 className="font-bold text-slate-100">Theme Builder</h1>
                        <p className="text-xs text-slate-400">Editing: Custom Theme</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1">
                    <button
                        onClick={() => setPreviewMode('mobile')}
                        className={`p-2 rounded-md transition-all ${previewMode === 'mobile' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                        title="Mobile View"
                    >
                        <Smartphone className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setPreviewMode('desktop')}
                        className={`p-2 rounded-md transition-all ${previewMode === 'desktop' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                        title="Desktop View"
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
                        <>Saving...</>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Save Changes
                        </>
                    )}
                </button>
            </header>

            {/* 2. MAIN WORKSPACE */}
            <div className="flex-1 flex overflow-hidden">

                {/* 2A. LEFT SIDEBAR: Controls */}
                <aside className="w-80 border-r border-slate-800 bg-slate-900 flex flex-col">
                    {/* Tabs */}
                    <div className="flex border-b border-slate-800">
                        <button
                            onClick={() => setActiveTab('global')}
                            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'global'
                                ? 'border-amber-500 text-amber-500 bg-slate-800/50'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            <Palette className="w-4 h-4" /> Global Style
                        </button>
                        <button
                            onClick={() => setActiveTab('sections')}
                            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'sections'
                                ? 'border-amber-500 text-amber-500 bg-slate-800/50'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            <Layers className="w-4 h-4" /> Sections
                        </button>
                    </div>

                    {/* Controls Content */}
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        {activeTab === 'global' ? (
                            <div className="space-y-6">
                                {/* Colors */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                        <Palette className="w-3 h-3" /> Color Palette
                                    </h3>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm text-slate-300 block mb-1">Primary Color</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={config.global.primaryColor}
                                                    onChange={(e) => updateGlobalConfig('primaryColor', e.target.value)}
                                                    className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                                />
                                                <input
                                                    type="text"
                                                    value={config.global.primaryColor}
                                                    readOnly
                                                    className="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-slate-300"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm text-slate-300 block mb-1">Secondary Color</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={config.global.secondaryColor}
                                                    onChange={(e) => updateGlobalConfig('secondaryColor', e.target.value)}
                                                    className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                                />
                                                <input
                                                    type="text"
                                                    value={config.global.secondaryColor}
                                                    readOnly
                                                    className="flex-1 bg-slate-800 border-slate-700 rounded px-2 py-1 text-sm text-slate-300"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm text-slate-300 block mb-1">Background Color</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={config.global.backgroundColor}
                                                    onChange={(e) => updateGlobalConfig('backgroundColor', e.target.value)}
                                                    className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                                />
                                                <input
                                                    type="text"
                                                    value={config.global.backgroundColor}
                                                    readOnly
                                                    className="flex-1 bg-slate-800 border-slate-700 rounded px-2 py-1 text-sm text-slate-300"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-800 my-4" />

                                {/* Fonts */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                        <Type className="w-3 h-3" /> Typography
                                    </h3>

                                    <div>
                                        <label className="text-sm text-slate-300 block mb-1">Heading Font</label>
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
                                        <label className="text-sm text-slate-300 block mb-1">Body Font</label>
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
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-xs text-slate-500 mb-4 px-1">
                                    Use arrows to reorder sections. Manage visibility and variants.
                                </p>

                                <div className="space-y-2">
                                    {config.sections.sort((a, b) => a.order - b.order).map((section, index) => (
                                        <div
                                            key={section.id}
                                            className={`bg-slate-800 border ${section.isVisible ? 'border-slate-700' : 'border-slate-800 opacity-60'} rounded-lg p-3 transition-all`}
                                        >
                                            {/* Header Row */}
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-slate-700 rounded text-slate-400">
                                                        <Layout className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-200 capitalize">{section.type.replace('_', ' ')}</p>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-1 bg-slate-900 rounded p-1">
                                                    <button
                                                        disabled={index === 0}
                                                        onClick={() => moveSection(section.id, 'up')}
                                                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                                                        title="Move Up"
                                                    >
                                                        <ArrowUp className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        disabled={index === config.sections.length - 1}
                                                        onClick={() => moveSection(section.id, 'down')}
                                                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                                                        title="Move Down"
                                                    >
                                                        <ArrowDown className="w-4 h-4" />
                                                    </button>
                                                    <div className="w-px h-4 bg-slate-800 mx-1"></div>
                                                    <button
                                                        onClick={() => toggleSectionVisibility(section.id)}
                                                        className={`p-1 ${section.isVisible ? 'text-amber-500' : 'text-slate-600'} hover:text-white`}
                                                        title={section.isVisible ? "Hide Section" : "Show Section"}
                                                    >
                                                        {section.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                    </button>
                                                    <div className="w-px h-4 bg-slate-800 mx-1"></div>
                                                    <button
                                                        onClick={() => removeSection(section.id)}
                                                        className="p-1 text-slate-600 hover:text-rose-500 transition-colors"
                                                        title="Remove Section"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Variant Selector */}
                                            {section.isVisible && (
                                                <div className="bg-slate-900/50 rounded p-2">
                                                    <label className="text-xs text-slate-500 block mb-1 uppercase font-bold">Layout Variant</label>
                                                    <select
                                                        value={section.variant}
                                                        onChange={(e) => updateSectionVariant(section.id, e.target.value)}
                                                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                                    >
                                                        {getVariantsForType(section.type).map(v => (
                                                            <option key={v} value={v}>{v.replace('_', ' ')}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4">
                                    {showAddMenu ? (
                                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-2 animate-in fade-in slide-in-from-bottom-2">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Section Type</h4>
                                                <button onClick={() => setShowAddMenu(false)} className="text-slate-500 hover:text-white text-xs">Cancel</button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                {['quote', 'couple', 'event', 'love_story', 'gallery', 'gift', 'rsvp', 'closing'].map((type) => (
                                                    <button
                                                        key={type}
                                                        onClick={() => {
                                                            addSection(type as SectionBlock['type']);
                                                            setShowAddMenu(false);
                                                        }}
                                                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300 capitalize text-left transition-colors flex items-center gap-2"
                                                    >
                                                        <Plus className="w-3 h-3" /> {type.replace('_', ' ')}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setShowAddMenu(true)}
                                            className="w-full flex items-center justify-center gap-2 border border-dashed border-slate-700 rounded-lg py-3 text-slate-500 hover:text-amber-500 hover:border-amber-500/50 hover:bg-slate-800/50 transition-all text-sm font-medium"
                                        >
                                            <Plus className="w-4 h-4" /> Add New Section
                                        </button>
                                    )}
                                </div>
                            </div>
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
