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
import { listThemes, deleteTheme } from "@/app/actions/theme";

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
                tier: (t as any).tier || "free",
                isActive: (t as any).isActive ?? true,
                previewImage: (t as any).previewImage || undefined,
                isDynamic: !!t.config // Mark if it can be edited via builder
            }));
            setThemes(dbThemes);
        }
        setIsLoading(false);
    };

    const handleDelete = async (slug: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus tema ini?")) return;

        const result = await deleteTheme(slug);
        if (result.success) {
            fetchThemes();
        } else {
            alert("Gagal menghapus tema");
        }
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

            {/* Themes List (Compact Table Style) */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-800/50">
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 border-r border-slate-800">Preview</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 border-r border-slate-800">Nama Tema & Detail</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 border-r border-slate-800">Kategori</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 border-r border-slate-800">Tier Akses</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 border-r border-slate-800">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredThemes.map((theme) => (
                                <tr key={theme.id} className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-4 w-32 border-r border-slate-800">
                                        <div className="aspect-video bg-slate-800 rounded-md overflow-hidden relative">
                                            {theme.previewImage ? (
                                                <img src={theme.previewImage} alt={theme.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-700">
                                                    <Monitor className="w-6 h-6" />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 border-r border-slate-800">
                                        <div>
                                            <h3 className="font-bold text-slate-100">{theme.name}</h3>
                                            <p className="text-xs text-slate-500 line-clamp-1">{theme.description}</p>
                                            <code className="text-[10px] text-amber-500/70 mt-1 block">slug: {theme.id}</code>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 border-r border-slate-800">
                                        <span className="text-xs text-slate-400 capitalize bg-slate-800 px-2 py-1 rounded border border-slate-700">
                                            {theme.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 border-r border-slate-800">
                                        {theme.tier === 'free' ? (
                                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 uppercase">
                                                <Plus className="w-3 h-3 rotate-45" /> Free
                                            </span>
                                        ) : theme.tier === 'gold' ? (
                                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20 uppercase">
                                                Gold
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-purple-500/10 text-purple-400 text-[10px] font-bold border border-purple-500/20 uppercase">
                                                Platinum
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 border-r border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${theme.isActive ? 'bg-green-500' : 'bg-slate-600'}`}></div>
                                            <span className={`text-[11px] font-medium ${theme.isActive ? 'text-green-400' : 'text-slate-500'}`}>
                                                {theme.isActive ? 'Aktif' : 'Non-aktif'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {theme.isDynamic ? (
                                                <Link
                                                    href={`/admin/themes/builder/${theme.id}`}
                                                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all"
                                                    title="Edit Config"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                            ) : (
                                                <div className="p-2 text-slate-700 cursor-not-allowed" title="Hardcoded (ReadOnly)">
                                                    <Monitor className="w-4 h-4" />
                                                </div>
                                            )}
                                            <button
                                                onClick={() => handleDelete(theme.id)}
                                                className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all"
                                                title="Hapus"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredThemes.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        <Palette className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Tidak ada tema yang ditemukan.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

