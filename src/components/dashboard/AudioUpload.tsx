"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Loader2, Music as LucideMusic, Headphones } from "lucide-react";
import { toast } from "sonner";

interface AudioUploadProps {
    onUploadSuccess: (url: string) => void;
    label?: string;
    maxSizeMB?: number;
    currentAudioUrl?: string;
    onRemove?: () => void;
}

export default function AudioUpload({
    onUploadSuccess,
    label = "Upload Musik Kustom",
    maxSizeMB = 10, // MP3 can be larger than images
    currentAudioUrl,
    onRemove
}: AudioUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 1. Basic Type Check
        if (!file.type.startsWith("audio/")) {
            toast.error("Mohon pilih file audio yang valid (MP3).");
            return;
        }

        // 2. Size check
        if (file.size > maxSizeMB * 1024 * 1024) {
            toast.error(`File terlalu besar. Maksimal ${maxSizeMB}MB.`);
            return;
        }

        setIsUploading(true);
        setProgress(20);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.error || "Gagal upload musik");

            setProgress(100);
            toast.success("Musik berhasil diunggah!");
            onUploadSuccess(result.url);
        } catch (error: any) {
            console.error("Audio Upload Error:", error);
            toast.error(error.message || "Gagal upload musik. Coba lagi.");
        } finally {
            setIsUploading(false);
            setProgress(0);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <label className="text-[13px] font-semibold text-slate-700">{label}</label>
                {currentAudioUrl && onRemove && (
                    <button
                        onClick={onRemove}
                        className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 flex items-center gap-1"
                    >
                        <X className="w-3 h-3" /> Hapus Audio
                    </button>
                )}
            </div>

            {currentAudioUrl ? (
                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 flex items-center gap-4 animate-in zoom-in-95 duration-300">
                    <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-200">
                        <Headphones className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-sky-900 uppercase tracking-widest truncate">Audio Uploaded</p>
                        <p className="text-[10px] text-sky-600/80 truncate">{currentAudioUrl.split('/').pop()}</p>
                    </div>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-white rounded-xl text-[10px] font-black uppercase tracking-widest text-sky-600 border border-sky-100 hover:bg-sky-100 transition-colors"
                    >
                        Ganti
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className={`
                        w-full py-8 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all
                        ${isUploading
                            ? "bg-slate-50 border-slate-200 cursor-not-allowed"
                            : "bg-white border-slate-200 hover:border-sky-400 hover:bg-sky-50/30 text-slate-400 hover:text-sky-500"
                        }
                    `}
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
                            <div className="text-center">
                                <p className="text-xs font-bold uppercase tracking-widest mb-1 text-sky-600">Mengunggah Musik...</p>
                                <div className="w-32 h-1 bg-slate-200 rounded-full mx-auto overflow-hidden">
                                    <div
                                        className="h-full bg-sky-500 transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-12 h-12 bg-slate-50 group-hover:bg-sky-100 rounded-full flex items-center justify-center transition-colors">
                                <Upload className="w-6 h-6" />
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-bold uppercase tracking-widest">Pilih File MP3</p>
                                <p className="text-[10px] opacity-60 mt-1">Maksimal 10MB • Format .mp3</p>
                            </div>
                        </>
                    )}
                </button>
            )}

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="audio/mpeg,audio/mp3"
                className="hidden"
            />
        </div>
    );
}
