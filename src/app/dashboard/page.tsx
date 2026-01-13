"use client";

import React, { useState } from "react";
import { InvitationData } from "@/types/invitation";
import { MOCK_DATA } from "@/data/mockData";
import { BasicTheme } from "@/components/themes/BasicTheme";
import { Smartphone, Monitor, Menu, X } from "lucide-react";

/**
 * ============================================
 * DASHBOARD PAGE
 * ============================================
 * 
 * User-facing dashboard for creating and editing wedding invitations.
 * Features:
 * - Split-screen layout (form left, preview right)
 * - Responsive design (stacks on mobile)
 * - Live preview of changes
 * - Form validation
 * 
 * Architecture:
 * - State managed locally (no DB yet - Iterasi 4)
 * - Preview uses actual theme component
 * - Mobile-optimized with collapsible sections
 */

export default function DashboardPage() {
    // State for invitation data
    const [invitationData, setInvitationData] = useState<InvitationData>(MOCK_DATA);

    // State for preview mode (mobile/desktop)
    const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");

    // State for mobile sidebar toggle
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 shadow-sm">
                <div className="px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isSidebarOpen ? (
                                <X className="w-5 h-5 text-slate-700" />
                            ) : (
                                <Menu className="w-5 h-5 text-slate-700" />
                            )}
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">
                                💍 Nikahin Dashboard
                            </h1>
                            <p className="text-sm text-slate-600 hidden sm:block">
                                Buat undangan pernikahan digital Anda
                            </p>
                        </div>
                    </div>

                    {/* Preview Mode Toggle (Desktop Only) */}
                    <div className="hidden md:flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => setPreviewMode("mobile")}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${previewMode === "mobile"
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-600 hover:text-slate-900"
                                }`}
                        >
                            <Smartphone className="w-4 h-4" />
                            <span className="text-sm font-medium">Mobile</span>
                        </button>
                        <button
                            onClick={() => setPreviewMode("desktop")}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${previewMode === "desktop"
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-600 hover:text-slate-900"
                                }`}
                        >
                            <Monitor className="w-4 h-4" />
                            <span className="text-sm font-medium">Desktop</span>
                        </button>
                    </div>

                    {/* Save Button */}
                    <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-medium hover:from-pink-600 hover:to-rose-600 transition-all shadow-sm hover:shadow-md">
                        Simpan
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Form Sidebar */}
                <aside
                    className={`
                        fixed lg:static inset-y-0 left-0 z-40
                        w-full lg:w-96 xl:w-[28rem]
                        bg-white border-r border-slate-200
                        transform transition-transform duration-300 ease-in-out
                        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                        overflow-y-auto
                    `}
                >
                    <div className="p-6 space-y-6">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 mb-1">
                                Edit Undangan
                            </h2>
                            <p className="text-sm text-slate-600">
                                Isi data undangan Anda di bawah ini
                            </p>
                        </div>

                        {/* Form sections will be added here */}
                        <div className="space-y-4">
                            <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 rounded-lg">
                                <p className="text-sm text-slate-700">
                                    📝 <strong>Form sections coming soon!</strong>
                                </p>
                                <p className="text-xs text-slate-600 mt-2">
                                    Phase 3.2 akan menambahkan form untuk:
                                </p>
                                <ul className="text-xs text-slate-600 mt-1 ml-4 list-disc space-y-1">
                                    <li>Informasi Mempelai</li>
                                    <li>Detail Acara</li>
                                    <li>Galeri Foto</li>
                                    <li>Quotes & Musik</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Overlay for mobile */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Preview Section */}
                <main className="flex-1 overflow-hidden bg-slate-100">
                    <div className="h-full flex items-center justify-center p-4 lg:p-8">
                        {/* Preview Container */}
                        <div className="h-full w-full flex items-center justify-center">
                            {previewMode === "mobile" ? (
                                // Mobile Preview
                                <div className="relative flex items-center justify-center">
                                    {/* Mobile Frame */}
                                    <div className="relative bg-slate-900 rounded-[3rem] p-3 shadow-2xl">
                                        <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-inner w-[360px]">
                                            {/* Notch */}
                                            <div className="h-6 bg-slate-900 rounded-b-3xl mx-auto w-40" />

                                            {/* Preview Content */}
                                            <div className="h-[600px] w-[360px] overflow-y-auto scrollbar-hide">
                                                <BasicTheme
                                                    data={invitationData}
                                                    guestName="Preview User"
                                                    isPreview={true}
                                                    isMobile={true}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Preview Label */}
                                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                        <span className="text-xs font-medium text-slate-600 bg-white px-3 py-1 rounded-full shadow-sm">
                                            📱 Mobile Preview
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                // Desktop Preview
                                <div className="relative w-full max-w-5xl">
                                    <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
                                        {/* Browser Chrome */}
                                        <div className="h-10 bg-slate-200 border-b border-slate-300 flex items-center px-4 gap-2">
                                            <div className="flex gap-2">
                                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                            </div>
                                            <div className="flex-1 ml-4">
                                                <div className="bg-white rounded px-3 py-1 text-xs text-slate-600">
                                                    localhost:3000/{invitationData.slug}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Preview Content */}
                                        <div className="h-[600px] overflow-y-auto">
                                            <BasicTheme
                                                data={invitationData}
                                                guestName="Preview User"
                                                isPreview={true}
                                                isMobile={false}
                                            />
                                        </div>
                                    </div>

                                    {/* Preview Label */}
                                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                        <span className="text-xs font-medium text-slate-600 bg-white px-3 py-1 rounded-full shadow-sm">
                                            💻 Desktop Preview
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
