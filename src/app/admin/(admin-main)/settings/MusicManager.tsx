"use client";

import React, { useState, useEffect, useRef } from "react";
import RoyalCard from "@/components/ui/RoyalCard";
import {
    Music,
    Plus,
    Trash2,
    Play,
    Pause,
    Save,
    Loader2,
    Music2,
    Link as LinkIcon,
    Database,
    RefreshCcw
} from "lucide-react";
import {
    getAdminMusicList,
    addMusicToLibrary,
    deleteMusicFromLibrary,
    seedMusicLibrary
} from "@/app/actions/admin";
import { toast } from "sonner";
import AudioUpload from "@/components/dashboard/AudioUpload";

export default function MusicManager() {
    const [musicList, setMusicList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [playingUrl, setPlayingUrl] = useState<string | null>(null);
    const audioInstance = useRef<HTMLAudioElement | null>(null);

    // Confirmation states
    const [showSeedConfirm, setShowSeedConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Form state
    const [newTrack, setNewTrack] = useState({
        title: "",
        artist: "",
        category: "Romantic",
        url: ""
    });

    const fetchMusic = async () => {
        setIsLoading(true);
        const result = await getAdminMusicList();
        if (result.success) {
            setMusicList(result.data || []);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchMusic();
        return () => {
            if (audioInstance.current) {
                audioInstance.current.pause();
            }
        };
    }, []);

    const handleAdd = async () => {
        if (!newTrack.title || !newTrack.url) {
            toast.error("Judul dan URL musik wajib diisi.");
            return;
        }

        setIsSaving(true);
        const result = await addMusicToLibrary(newTrack);
        if (result.success) {
            toast.success("Musik berhasil ditambahkan ke library!");
            setNewTrack({ title: "", artist: "", category: "Romantic", url: "" });
            fetchMusic();
        } else {
            toast.error(result.error || "Gagal menambah musik.");
        }
        setIsSaving(false);
    };

    const handleSeed = async () => {
        setIsSaving(true);
        const result = await seedMusicLibrary();
        if (result.success) {
            toast.success("10 Lagu default berhasil ditambahkan!");
            fetchMusic();
        } else {
            toast.error(result.error || "Gagal melakukan seeding.");
        }
        setIsSaving(false);
        setShowSeedConfirm(false);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        const result = await deleteMusicFromLibrary(deleteId);
        if (result.success) {
            toast.success("Lagu terhapus.");
            fetchMusic();
        } else {
            toast.error("Gagal menghapus.");
        }
        setDeleteId(null);
    };

    const togglePlay = (url: string) => {
        if (playingUrl === url && audioInstance.current) {
            audioInstance.current.pause();
            audioInstance.current = null;
            setPlayingUrl(null);
            return;
        }

        if (audioInstance.current) {
            audioInstance.current.pause();
        }

        const audio = new Audio(url);
        audioInstance.current = audio;
        setPlayingUrl(url);
        audio.play().catch(() => {
            toast.error("Gagal memutar audio.");
            setPlayingUrl(null);
        });

        audio.onended = () => {
            setPlayingUrl(null);
            audioInstance.current = null;
        };
    };

    return (
        <div id="music">
            <RoyalCard className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-sky-50 rounded-xl text-sky-600">
                            <Music className="w-5 h-5" />
                        </div>
                        <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Public Music Library</h3>
                    </div>
                    <div className="px-3 py-1 bg-sky-50 rounded-full border border-sky-100">
                        <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest">{musicList.length} Tracks</span>
                    </div>
                </div>

                {/* Add New Track Form */}
                <div className="p-6 rounded-[32px] bg-slate-50 border border-slate-100 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                            <Plus className="w-4 h-4 text-sky-500" />
                        </div>
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Tambah Lagu Baru</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Judul Lagu</label>
                            <input
                                type="text"
                                value={newTrack.title}
                                onChange={(e) => setNewTrack({ ...newTrack, title: e.target.value })}
                                placeholder="Contoh: Eternal Love"
                                className="w-full px-5 py-3 rounded-xl bg-white border border-slate-100 focus:border-sky-500 outline-none transition-all font-bold text-slate-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Artis / Penulis</label>
                            <input
                                type="text"
                                value={newTrack.artist}
                                onChange={(e) => setNewTrack({ ...newTrack, artist: e.target.value })}
                                placeholder="Contoh: Wedding Piano"
                                className="w-full px-5 py-3 rounded-xl bg-white border border-slate-100 focus:border-sky-500 outline-none transition-all font-bold text-slate-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategori</label>
                            <select
                                value={newTrack.category}
                                onChange={(e) => setNewTrack({ ...newTrack, category: e.target.value })}
                                className="w-full px-5 py-3 rounded-xl bg-white border border-slate-100 appearance-none font-bold text-slate-700"
                            >
                                <option>Romantic</option>
                                <option>Classic</option>
                                <option>Jazz</option>
                                <option>Pop</option>
                                <option>Traditional</option>
                                <option>Acoustic</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <AudioUpload
                                label="Upload Lagu (MP3)"
                                onUploadSuccess={(url) => setNewTrack({ ...newTrack, url })}
                                currentAudioUrl={newTrack.url}
                                onRemove={() => setNewTrack({ ...newTrack, url: "" })}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleAdd}
                        disabled={isSaving || !newTrack.url}
                        className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-black shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {isSaving ? "MENYIMPAN..." : "TAMBAHKAN KE LIBRARY"}
                    </button>
                </div>

                {/* List of Tracks */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between ml-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Daftar Lagu Aktif</p>
                        {showSeedConfirm ? (
                            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                                <span className="text-[9px] font-bold text-slate-400">Yakin tambahkan 10 lagu?</span>
                                <button onClick={handleSeed} className="text-[9px] font-black text-emerald-500 uppercase">Ya</button>
                                <button onClick={() => setShowSeedConfirm(false)} className="text-[9px] font-black text-slate-300 uppercase">Batal</button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowSeedConfirm(true)}
                                disabled={isSaving}
                                className="text-[9px] font-black text-sky-500 uppercase tracking-widest hover:underline flex items-center gap-1.5"
                            >
                                <Database className="w-3 h-3" /> Seed Default Library
                            </button>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="py-10 flex flex-col items-center justify-center text-slate-400">
                            <Loader2 className="w-8 h-8 animate-spin mb-2" />
                            <p className="text-[10px] font-bold uppercase tracking-widest">Memuat Library...</p>
                        </div>
                    ) : musicList.length === 0 ? (
                        <div className="py-10 border-2 border-dashed border-slate-100 rounded-[32px] flex flex-col items-center justify-center text-slate-300">
                            <Music2 className="w-12 h-12 mb-3 opacity-20" />
                            <p className="text-xs font-bold uppercase tracking-widest">Belum ada lagu di library</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            {musicList.map((track) => {
                                const isInternal = track.url.startsWith('/uploads');
                                return (
                                    <div
                                        key={track.id}
                                        className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-sky-200 transition-all group flex items-center gap-4 shadow-sm hover:shadow-md"
                                    >
                                        <button
                                            onClick={() => togglePlay(track.url)}
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${playingUrl === track.url ? 'bg-sky-500 text-white shadow-lg shadow-sky-200' : 'bg-slate-50 text-slate-400 group-hover:bg-sky-50 group-hover:text-sky-500'}`}
                                        >
                                            {playingUrl === track.url ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                                        </button>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <h4 className="font-bold text-slate-900 truncate">{track.title}</h4>
                                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${isInternal ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                                    {isInternal ? 'System' : 'Direct Link'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{track.artist || 'Unknown Artist'}</p>
                                                <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                <p className="text-[10px] text-sky-500 font-black uppercase tracking-widest">{track.category}</p>
                                            </div>
                                            <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                                <LinkIcon className="w-2.5 h-2.5" />
                                                <p className="text-[9px] font-medium text-slate-400 truncate max-w-xs">{track.url}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {deleteId === track.id ? (
                                                <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-1">
                                                    <span className="text-[10px] font-bold text-rose-500">Hapus?</span>
                                                    <button onClick={handleDelete} className="text-[10px] font-black text-rose-600 uppercase">Ya</button>
                                                    <button onClick={() => setDeleteId(null)} className="text-[10px] font-black text-slate-300 uppercase">Ga</button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setDeleteId(track.id)}
                                                    className="w-10 h-10 rounded-xl bg-slate-50 text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-all flex items-center justify-center"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </RoyalCard>
        </div>
    );
}
