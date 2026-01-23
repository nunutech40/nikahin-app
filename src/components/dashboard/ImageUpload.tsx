"use client";

import React, { useState, useRef } from "react";
import imageCompression from "browser-image-compression";
import { Upload, X, Loader2, Image as LucideImage } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
    onUploadSuccess: (url: string) => void;
    label?: string;
    maxSizeMB?: number; // Initial file size check
    maxWidthOrHeight?: number; // Resize target
    currentImageUrl?: string;
    onRemove?: () => void;
}

export default function ImageUpload({
    onUploadSuccess,
    label = "Upload Foto",
    maxSizeMB = 5, // Allow up to 5MB original
    maxWidthOrHeight = 1280, // High quality but optimized
    currentImageUrl,
    onRemove
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 1. Initial size check
        if (file.size > maxSizeMB * 1024 * 1024) {
            toast.error(`File terlalu besar. Maksimal ${maxSizeMB}MB.`);
            return;
        }

        setIsUploading(true);
        setProgress(10);

        try {
            // 2. COMPRESS ON CLIENT SIDE
            // This reduces server load and bandwidth
            const options = {
                maxSizeMB: 0.8, // Target 800KB (Good balance of quality/size)
                maxWidthOrHeight: maxWidthOrHeight,
                useWebWorker: true,
                onProgress: (p: number) => setProgress(10 + (p * 0.4)), // Progress up to 50%
            };

            const compressedFile = await imageCompression(file, options);
            setProgress(60);

            // 3. UPLOAD TO SERVER
            const formData = new FormData();
            formData.append("file", compressedFile);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.error || "Gagal upload");

            setProgress(100);
            toast.success("Foto berhasil diunggah!");
            onUploadSuccess(result.url);
        } catch (error: any) {
            console.error("Upload Error:", error);
            toast.error(error.message || "Gagal upload. Coba lagi.");
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
                {currentImageUrl && onRemove && (
                    <button
                        onClick={onRemove}
                        className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 flex items-center gap-1"
                    >
                        <X className="w-3 h-3" /> Hapus
                    </button>
                )}
            </div>

            {currentImageUrl ? (
                <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-slate-100 group">
                    <img
                        src={currentImageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <button
                            className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest pointer-events-auto"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Ganti Foto
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className={`
                        w-full aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all
                        ${isUploading
                            ? "bg-slate-50 border-slate-200 cursor-not-allowed"
                            : "bg-white border-slate-200 hover:border-[#D4AF37] hover:bg-amber-50/30 text-slate-400 hover:text-[#D4AF37]"
                        }
                    `}
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="w-8 h-8 animate-spin" />
                            <div className="text-center">
                                <p className="text-xs font-bold uppercase tracking-widest mb-1">Sedang Memproses...</p>
                                <div className="w-32 h-1 bg-slate-200 rounded-full mx-auto overflow-hidden">
                                    <div
                                        className="h-full bg-[#D4AF37] transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-12 h-12 bg-slate-50 group-hover:bg-amber-100 rounded-full flex items-center justify-center transition-colors">
                                <Upload className="w-6 h-6" />
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-bold uppercase tracking-widest">Klik Untuk Upload</p>
                                <p className="text-[10px] opacity-60 mt-1">PNG, JPG, WEBP (Max 5MB)</p>
                            </div>
                        </>
                    )}
                </button>
            )}

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />

            {/* Maintenance Hint */}
            <p className="text-[10px] text-slate-400 italic px-1">
                * Foto dikompresi otomatis di HP Anda sebelum dikirim untuk menghemat kuota dan mempercepat loading undangan.
            </p>
        </div>
    );
}
