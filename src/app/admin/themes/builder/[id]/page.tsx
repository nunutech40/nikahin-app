"use client";

import React, { useState } from "react";
import {
    Layout,
    Type,
    Palette,
    Save,
    ArrowLeft,
    Smartphone,
    Monitor,
    Layers
} from "lucide-react";
import Link from "next/link";
import { MASTER_THEME_CONFIG } from "@/components/themes/masterConfig";
import { DynamicThemeConfig } from "@/types/invitation";

export default function ThemeBuilderPage({ params }: { params: { id: string } }) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id } = params; // In future, use ID to fetch specific theme config from DB

    // State for the configuration being edited
    // Initialize with MASTER Config for now
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [config, setConfig] = useState<DynamicThemeConfig>(MASTER_THEME_CONFIG);
    const [activeTab, setActiveTab] = useState<'global' | 'sections'>('global');
    const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');

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

    const updateGlobalConfig = (key: keyof DynamicThemeConfig['global'], value: string) => {
        setConfig(prev => ({
            ...prev,
            global: {
                ...prev.global,
                [key]: value
            }
        }));
    };

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

                <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 py-2 rounded-lg font-bold transition-colors">
                    <Save className="w-4 h-4" />
                    Save Changes
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
                                            disabled
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                        >
                                            <option value="Playfair Display">Playfair Display</option>
                                            <option value="Cinzel">Cinzel</option>
                                            <option value="Great Vibes">Great Vibes</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-sm text-slate-300 block mb-1">Body Font</label>
                                        <select
                                            value={config.global.fontBody}
                                            disabled
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                        >
                                            <option value="Inter">Inter</option>
                                            <option value="Lato">Lato</option>
                                            <option value="Montserrat">Montserrat</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-xs text-slate-500 mb-4 px-1">
                                    Drag and drop to reorder sections. Click to edit variants.
                                </p>

                                <div className="space-y-2">
                                    {config.sections.sort((a, b) => a.order - b.order).map((section) => (
                                        <div
                                            key={section.id}
                                            className="bg-slate-800 border border-slate-700 rounded-lg p-3 flex items-center justify-between group hover:border-amber-500/50 transition-all cursor-move"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-slate-700 rounded text-slate-400">
                                                    <Layout className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-200 capitalize">{section.type.replace('_', ' ')}</p>
                                                    <p className="text-xs text-slate-500 capitalize">{section.variant.replace('_', ' ')}</p>
                                                </div>
                                            </div>
                                            {/* Visibility Toggle */}
                                            <div className="flex items-center gap-2">
                                                {/* Placeholder for Edit/Hide */}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button className="w-full mt-4 flex items-center justify-center gap-2 border border-dashed border-slate-700 rounded-lg py-3 text-slate-500 hover:text-amber-500 hover:border-amber-500/50 hover:bg-slate-800/50 transition-all text-sm font-medium">
                                    <Plus className="w-4 h-4" /> Add Section (Coming Soon)
                                </button>
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
