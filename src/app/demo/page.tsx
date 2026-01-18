"use client";

import { useState } from "react";
import { MOCK_DATA } from "@/data/mockData";
import { BasicTheme } from "@/components/themes/BasicTheme";
import { Lock, LogIn, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DemoPage() {
    const [demoData, setDemoData] = useState(MOCK_DATA);
    const [showSaveModal, setShowSaveModal] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Banner */}
            <div className="sticky top-0 z-50 bg-gradient-to-r from-[#D4AF37] to-[#b28f1f] text-white py-4 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <Lock className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">Mode Demo - Guest</h1>
                            <p className="text-xs text-white/80">Edit bebas, tapi tidak bisa save & publish</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/login"
                            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-all flex items-center gap-2"
                        >
                            <LogIn className="w-4 h-4" />
                            Login
                        </Link>
                        <Link
                            href="/register"
                            className="px-6 py-2 bg-white text-[#D4AF37] rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2"
                        >
                            Daftar Gratis
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Demo Editor */}
            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Form Editor */}
                    <div className="bg-white rounded-2xl p-6 shadow-xl">
                        <h2 className="text-2xl font-black text-gray-800 mb-6">
                            ✨ Coba Edit Undangan
                        </h2>

                        <div className="space-y-6">
                            {/* Mempelai */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Nama Mempelai Pria
                                </label>
                                <input
                                    type="text"
                                    value={demoData.groom.name}
                                    onChange={(e) => setDemoData({
                                        ...demoData,
                                        groom: { ...demoData.groom, name: e.target.value }
                                    })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Nama Mempelai Wanita
                                </label>
                                <input
                                    type="text"
                                    value={demoData.bride.name}
                                    onChange={(e) => setDemoData({
                                        ...demoData,
                                        bride: { ...demoData.bride, name: e.target.value }
                                    })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                                />
                            </div>

                            {/* Info Box */}
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                <p className="text-sm text-amber-800 font-semibold mb-2">
                                    💡 Ini hanya demo!
                                </p>
                                <p className="text-xs text-amber-700">
                                    Perubahan tidak akan disimpan. Daftar untuk save & publish undangan Anda.
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={() => setShowSaveModal(true)}
                                    className="w-full py-4 bg-gray-100 text-gray-400 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <Lock className="w-5 h-5" />
                                    Save (Perlu Login)
                                </button>

                                <Link
                                    href="/register"
                                    className="block w-full py-4 bg-[#D4AF37] text-white rounded-xl font-bold hover:bg-[#b28f1f] transition-all text-center"
                                >
                                    Daftar untuk Save & Publish
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right: Preview */}
                    <div className="sticky top-24">
                        <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-white font-bold">Preview Live</h3>
                                <div className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                                    LIVE
                                </div>
                            </div>

                            {/* Mobile Frame */}
                            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
                                <div className="aspect-[9/16] overflow-y-auto">
                                    <BasicTheme data={demoData} guestName="Demo User" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Modal */}
            {showSaveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center">
                                <Lock className="w-8 h-8 text-[#D4AF37]" />
                            </div>
                            <h2 className="text-2xl font-black text-gray-800 mb-2">
                                Daftar untuk Save
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Buat akun gratis untuk menyimpan dan mempublish undangan Anda
                            </p>
                            <div className="space-y-3">
                                <Link
                                    href="/register"
                                    className="block w-full py-4 bg-[#D4AF37] text-white rounded-xl font-bold hover:bg-[#b28f1f] transition-all"
                                >
                                    Daftar Sekarang
                                </Link>
                                <button
                                    onClick={() => setShowSaveModal(false)}
                                    className="w-full py-3 text-gray-500 font-semibold hover:text-gray-700 transition-colors"
                                >
                                    Nanti Saja
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
