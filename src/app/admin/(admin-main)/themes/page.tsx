"use client";

import React, { useState, Suspense } from "react";
import {
    Palette,
    Plus,
    Search,
    Monitor,
    Edit,
    Trash2,
    Eye,
    Layers
} from "lucide-react";
import Link from "next/link";
import { getAllThemes, ThemeMetadata } from "@/lib/themeRegistry";
import { listThemes } from "@/app/actions/theme";

export default function ThemesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [themes, setThemes] = useState<ThemeMetadata[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchThemes = async () => {
        setIsLoading(true);
        const result = await listThemes();
        if (result.success && result.themes) {
            // Map DB themes to ThemeMetadata format
            const dbThemes: ThemeMetadata[] = result.themes.map(t => ({
                id: t.slug,
                name: t.name || "",
                description: t.description || "",
                isFree: t.isFree || false,
                category: t.category || "dynamic",
                previewImage: (t as any).previewImage || undefined,
                isDynamic: !!t.config // Mark if it can be edited via builder
            }));
            setThemes(dbThemes);
        }
        setIsLoading(false);
    };

    React.useEffect(() => {
        fetchThemes();
    }, []);

    const filteredThemes = themes.filter(theme =>
        theme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        theme.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-600">
                        Manajemen Tema
                    </h1>
                    <p className="text-slate-400">Atur koleksi tema undangan dan buat template baru.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            const json = prompt("Paste struktur JSON tema di sini:");
                            if (json) {
                                try {
                                    const parsed = JSON.parse(json);
                                    if (parsed.global && parsed.sections) {
                                        const id = `theme_${Date.now()}`;
                                        // We need to save it and redirect. 
                                        // For now, let's just use localStorage to pass it to the builder
                                        localStorage.setItem(`import_${id}`, json);
                                        window.location.href = `/admin/themes/builder/${id}?import=true`;
                                    } else {
                                        alert("Struktur JSON tidak valid.");
                                    }
                                } catch (e) {
                                    alert("Gagal membaca JSON: " + e);
                                }
                            }
                        }}
                        className="flex items-center gap-2 bg-slate-800 text-slate-300 px-4 py-2 rounded-lg font-bold hover:bg-slate-700 transition-all cursor-pointer border border-slate-700"
                    >
                        <Layers className="w-4 h-4" />
                        Import JSON
                    </button>
                    <button
                        onClick={() => {
                            const id = `theme_${Date.now()}`;
                            window.location.href = `/admin/themes/builder/${id}`;
                        }}
                        className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-900 px-4 py-2 rounded-lg font-bold hover:shadow-lg hover:shadow-amber-500/20 transition-all cursor-pointer"
                    >
                        <Plus className="w-5 h-5" />
                        Buat Tema Baru
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Cari tema..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                    />
                </div>
                <select className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50">
                    <option value="all">Semua Kategori</option>
                    <option value="modern">Modern</option>
                    <option value="elegant">Elegant</option>
                    <option value="dynamic">Dynamic (Builder)</option>
                </select>
            </div>

            {/* Themes Grid */}
            <Suspense fallback={<div className="text-center py-12 text-slate-500">Loading themes...</div>}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredThemes.map((theme) => (
                        <ThemeCard key={theme.id} theme={theme} />
                    ))}
                </div>

                {filteredThemes.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        <Palette className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Tidak ada tema yang ditemukan.</p>
                    </div>
                )}
            </Suspense>
        </div>
    );
}

function ThemeCard({ theme }: { theme: ThemeMetadata }) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-amber-500/50 transition-all group">
            {/* Preview Image */}
            <div className="relative aspect-video bg-slate-800">
                {theme.previewImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={theme.previewImage}
                        alt={theme.name}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-slate-600">
                        <Monitor className="w-12 h-12" />
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    {theme.isFree ? (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded font-medium border border-green-500/30">Free</span>
                    ) : (
                        <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded font-medium border border-amber-500/30">Premium</span>
                    )}
                    <span className="px-2 py-1 bg-slate-900/80 text-slate-300 text-xs rounded font-medium border border-slate-700 capitalize">
                        {theme.category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg text-slate-100">{theme.name}</h3>
                </div>
                <p className="text-slate-400 text-sm line-clamp-2 mb-4 h-10">
                    {theme.description}
                </p>

                <div className="flex items-center gap-2 pt-4 border-t border-slate-800">
                    {theme.isDynamic ? (
                        <Link
                            href={`/admin/themes/builder/${theme.id}`}
                            className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700"
                        >
                            <Edit className="w-4 h-4" /> Edit Config
                        </Link>
                    ) : (
                        <button disabled className="flex-1 flex items-center justify-center gap-2 bg-transparent text-slate-600 cursor-not-allowed py-2 rounded-lg text-sm font-medium italic">
                            Hardcoded
                        </button>
                    )}

                    <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors" title="Preview">
                        <Eye className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
