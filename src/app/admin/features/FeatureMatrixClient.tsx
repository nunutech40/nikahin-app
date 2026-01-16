"use client";

import React, { useState } from "react";
import { Check, X, Sparkles, Crown, Award, ShieldCheck, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { updatePackageFeatures, toggleFeatureCoreStatus } from "@/app/actions/admin";

interface Feature {
    id: number;
    code: string;
    name: string;
    description: string | null;
    isCore: boolean;
}

interface Package {
    id: number;
    slug: string;
    name: string;
    description: string | null;
    price: number;
    isActive: boolean;
}

interface FeatureMatrixClientProps {
    features: Feature[];
    packages: Package[];
    packageFeatureMap: Record<number, number[]>;
}

export default function FeatureMatrixClient({
    features: initialFeatures,
    packages,
    packageFeatureMap: initialPackageFeatureMap,
}: FeatureMatrixClientProps) {
    const [features, setFeatures] = useState(initialFeatures);
    const [packageFeatureMap, setPackageFeatureMap] = useState(initialPackageFeatureMap);
    const [loadingPackageId, setLoadingPackageId] = useState<number | null>(null);
    const [loadingFeatureId, setLoadingFeatureId] = useState<number | null>(null);

    const isFeatureEnabled = (packageId: number, featureId: number) => {
        // If it's a core feature, it's enabled for everyone
        const feature = features.find(f => f.id === featureId);
        if (feature?.isCore) return true;

        return packageFeatureMap[packageId]?.includes(featureId) || false;
    };

    const toggleFeature = (packageId: number, featureId: number) => {
        setPackageFeatureMap((prev) => {
            const currentFeatures = prev[packageId] || [];
            const isEnabled = currentFeatures.includes(featureId);

            return {
                ...prev,
                [packageId]: isEnabled
                    ? currentFeatures.filter((id) => id !== featureId)
                    : [...currentFeatures, featureId],
            };
        });
    };

    const handleToggleCore = async (featureId: number, currentStatus: boolean) => {
        setLoadingFeatureId(featureId);
        try {
            const result = await toggleFeatureCoreStatus(featureId, currentStatus);
            if (result.success) {
                setFeatures(prev =>
                    prev.map(f => f.id === featureId ? { ...f, isCore: !currentStatus } : f)
                );
                toast.success("Status fitur berhasil diperbarui");
            } else {
                toast.error(result.error || "Gagal memperbarui status fitur");
            }
        } catch (err) {
            toast.error("Terjadi kesalahan sistem");
        } finally {
            setLoadingFeatureId(null);
        }
    };

    const handleSavePackage = async (packageId: number) => {
        setLoadingPackageId(packageId);
        try {
            const featureIds = packageFeatureMap[packageId] || [];
            const result = await updatePackageFeatures(packageId, featureIds);

            if (result.success) {
                toast.success("Fitur paket berhasil diupdate!");
            } else {
                toast.error(result.error || "Gagal mengupdate fitur paket");
            }
        } catch (err) {
            toast.error("Terjadi kesalahan sistem");
        } finally {
            setLoadingPackageId(null);
        }
    };

    const getPackageIcon = (slug: string) => {
        switch (slug) {
            case "bronze": return Award;
            case "silver": return Sparkles;
            case "gold": return Crown;
            default: return Award;
        }
    };

    const getPackageColor = (slug: string) => {
        switch (slug) {
            case "bronze": return "bg-orange-100 text-orange-700 border-orange-200";
            case "silver": return "bg-slate-100 text-slate-700 border-slate-200";
            case "gold": return "bg-amber-100 text-amber-700 border-amber-200";
            default: return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    return (
        <div className="space-y-8">
            {/* Package Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {packages.map((pkg) => {
                    const Icon = getPackageIcon(pkg.slug);
                    const coreCount = features.filter(f => f.isCore).length;
                    const packageSpecificCount = (packageFeatureMap[pkg.id] || []).filter(id => !features.find(f => f.id === id)?.isCore).length;
                    const enabledCount = coreCount + packageSpecificCount;
                    const hasChanges = JSON.stringify(packageFeatureMap[pkg.id]?.sort()) !== JSON.stringify(initialPackageFeatureMap[pkg.id]?.sort());

                    return (
                        <div
                            key={pkg.id}
                            className={`p-5 rounded-3xl border ${getPackageColor(pkg.slug)} transition-all relative group shadow-sm hover:shadow-md`}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-2xl bg-white/50 flex items-center justify-center">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm leading-tight">{pkg.name}</h3>
                                    <p className="text-[10px] opacity-60 font-black uppercase tracking-widest mt-0.5">
                                        Rp {(pkg.price / 1000).toLocaleString("id-ID")}k
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-auto">
                                <div className="text-[11px] font-bold">
                                    {enabledCount} Fitur Total
                                </div>
                                {hasChanges && (
                                    <button
                                        onClick={() => handleSavePackage(pkg.id)}
                                        disabled={loadingPackageId === pkg.id}
                                        className="px-3 py-1.5 bg-white rounded-xl text-[10px] font-black uppercase hover:shadow-md transition-all disabled:opacity-50 text-slate-900 border border-slate-200/50"
                                    >
                                        {loadingPackageId === pkg.id ? "..." : "Save"}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Unified Feature Matrix */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100">
                                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em] sticky left-0 bg-slate-50/80 z-20 backdrop-blur-md">
                                    Modul Fitur
                                </th>
                                <th className="px-6 py-6 text-center text-xs font-black text-amber-600 uppercase tracking-[0.2em] bg-amber-50/30">
                                    Global/Default
                                </th>
                                {packages.map((pkg) => (
                                    <th
                                        key={pkg.id}
                                        className="px-6 py-6 text-center text-xs font-black text-slate-400 uppercase tracking-[0.2em]"
                                    >
                                        {pkg.name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {features.map((feature) => (
                                <tr key={feature.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-5 sticky left-0 bg-white group-hover:bg-slate-50/50 z-10 transition-colors border-r border-slate-50">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-slate-900 leading-tight">
                                                    {feature.name}
                                                </span>
                                                {feature.isCore && (
                                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-widest rounded-full">
                                                        Core
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs text-slate-400 mt-1 line-clamp-1 group-hover:line-clamp-none transition-all">
                                                {feature.description}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Global/Default Toggle */}
                                    <td className="px-6 py-5 text-center bg-amber-50/10">
                                        <button
                                            onClick={() => handleToggleCore(feature.id, feature.isCore)}
                                            disabled={loadingFeatureId === feature.id}
                                            className={`
                                                w-10 h-10 rounded-2xl flex items-center justify-center mx-auto transition-all active:scale-90
                                                ${feature.isCore
                                                    ? "bg-amber-100 text-amber-600 shadow-inner"
                                                    : "bg-slate-100 text-slate-300 hover:bg-slate-200"}
                                                ${loadingFeatureId === feature.id ? "animate-pulse" : ""}
                                            `}
                                            title={feature.isCore ? "Nonaktifkan sebagai fitur global" : "Jadikan fitur global untuk semua paket"}
                                        >
                                            {feature.isCore ? <ShieldCheck className="w-5 h-5" /> : <HelpCircle className="w-5 h-5 opacity-40" />}
                                        </button>
                                    </td>

                                    {/* Package Matrix Toggles */}
                                    {packages.map((pkg) => {
                                        const enabled = isFeatureEnabled(pkg.id, feature.id);
                                        const isManualToggleDisabled = feature.isCore;

                                        return (
                                            <td key={pkg.id} className="px-6 py-5 text-center">
                                                <button
                                                    onClick={() => !isManualToggleDisabled && toggleFeature(pkg.id, feature.id)}
                                                    disabled={isManualToggleDisabled}
                                                    className={`
                                                        w-10 h-10 rounded-2xl flex items-center justify-center mx-auto transition-all
                                                        ${enabled
                                                            ? (isManualToggleDisabled ? "bg-emerald-50 text-emerald-300 cursor-default" : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200 active:scale-95")
                                                            : "bg-white border border-slate-100 text-slate-200 hover:bg-slate-100 hover:text-slate-400 active:scale-95"}
                                                    `}
                                                    title={isManualToggleDisabled ? "Termasuk secara default otomatis" : (enabled ? "Nonaktifkan Fitur" : "Aktifkan Fitur")}
                                                >
                                                    {enabled ? <Check className="w-5 h-5" /> : <X className="w-4 h-4" />}
                                                </button>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Hint Box */}
            <div className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100 flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-blue-900 mb-1">Tips Konfigurasi</h4>
                    <p className="text-xs text-blue-700 leading-relaxed max-w-2xl">
                        Fitur yang ditandai sebagai <span className="font-bold">Global/Default</span> akan otomatis aktif di semua paket (Bronze, Silver, Gold).
                        Gunakan kolom ini untuk fitur dasar yang wajib ada tanpa perlu mencentang manual per paket.
                        Ingat untuk menekan tombol <strong>Save</strong> pada kartu paket jika melakukan perubahan manual pada kotak centang paket.
                    </p>
                </div>
            </div>
        </div>
    );
}
