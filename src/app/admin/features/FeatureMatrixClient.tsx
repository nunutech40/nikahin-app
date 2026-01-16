"use client";

import React, { useState } from "react";
import { Check, X, Sparkles, Crown, Award } from "lucide-react";
import { toast } from "sonner";
import { updatePackageFeatures } from "@/app/actions/admin";

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
    features,
    packages,
    packageFeatureMap: initialPackageFeatureMap,
}: FeatureMatrixClientProps) {
    const [packageFeatureMap, setPackageFeatureMap] = useState(initialPackageFeatureMap);
    const [loadingPackageId, setLoadingPackageId] = useState<number | null>(null);

    const isFeatureEnabled = (packageId: number, featureId: number) => {
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
            case "bronze":
                return Award;
            case "silver":
                return Sparkles;
            case "gold":
                return Crown;
            default:
                return Award;
        }
    };

    const getPackageColor = (slug: string) => {
        switch (slug) {
            case "bronze":
                return "bg-orange-100 text-orange-700 border-orange-200";
            case "silver":
                return "bg-slate-100 text-slate-700 border-slate-200";
            case "gold":
                return "bg-amber-100 text-amber-700 border-amber-200";
            default:
                return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    // Separate core and premium features
    const coreFeatures = features.filter((f) => f.isCore);
    const premiumFeatures = features.filter((f) => !f.isCore);

    return (
        <div className="space-y-8">
            {/* Package Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {packages.map((pkg) => {
                    const Icon = getPackageIcon(pkg.slug);
                    const enabledCount = packageFeatureMap[pkg.id]?.length || 0;
                    const hasChanges = JSON.stringify(packageFeatureMap[pkg.id]?.sort()) !== JSON.stringify(initialPackageFeatureMap[pkg.id]?.sort());

                    return (
                        <div
                            key={pkg.id}
                            className={`p-6 rounded-2xl border-2 ${getPackageColor(pkg.slug)} transition-all hover:shadow-lg`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-white/50 flex items-center justify-center">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-lg">{pkg.name}</h3>
                                        <p className="text-xs opacity-75 font-medium">
                                            Rp {(pkg.price / 1000).toLocaleString("id-ID")}k
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm opacity-75 mb-4 line-clamp-2">{pkg.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold">
                                    {enabledCount} Fitur Aktif
                                </span>
                                {hasChanges && (
                                    <button
                                        onClick={() => handleSavePackage(pkg.id)}
                                        disabled={loadingPackageId === pkg.id}
                                        className="px-4 py-2 bg-white rounded-lg text-xs font-bold hover:shadow-md transition-all disabled:opacity-50"
                                    >
                                        {loadingPackageId === pkg.id ? "Menyimpan..." : "Simpan"}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Feature Matrix */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest sticky left-0 bg-slate-50 z-10">
                                    Fitur
                                </th>
                                {packages.map((pkg) => (
                                    <th
                                        key={pkg.id}
                                        className="px-6 py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest"
                                    >
                                        {pkg.name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {/* Core Features Section */}
                            {coreFeatures.length > 0 && (
                                <>
                                    <tr className="bg-emerald-50">
                                        <td colSpan={packages.length + 1} className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <Check className="w-4 h-4 text-emerald-600" />
                                                <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">
                                                    Fitur Inti (Default untuk semua paket)
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                    {coreFeatures.map((feature) => (
                                        <tr key={feature.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 sticky left-0 bg-white z-10">
                                                <div>
                                                    <p className="font-bold text-slate-900 text-sm">{feature.name}</p>
                                                    <p className="text-xs text-slate-400 mt-0.5">{feature.description}</p>
                                                </div>
                                            </td>
                                            {packages.map((pkg) => {
                                                const enabled = isFeatureEnabled(pkg.id, feature.id);
                                                return (
                                                    <td key={pkg.id} className="px-6 py-4 text-center">
                                                        <button
                                                            onClick={() => toggleFeature(pkg.id, feature.id)}
                                                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${enabled
                                                                    ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                                                                    : "bg-slate-100 text-slate-300 hover:bg-slate-200"
                                                                }`}
                                                        >
                                                            {enabled ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                                                        </button>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </>
                            )}

                            {/* Premium Features Section */}
                            {premiumFeatures.length > 0 && (
                                <>
                                    <tr className="bg-amber-50">
                                        <td colSpan={packages.length + 1} className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <Crown className="w-4 h-4 text-amber-600" />
                                                <span className="text-xs font-black text-amber-700 uppercase tracking-wider">
                                                    Fitur Premium
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                    {premiumFeatures.map((feature) => (
                                        <tr key={feature.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 sticky left-0 bg-white z-10">
                                                <div>
                                                    <p className="font-bold text-slate-900 text-sm">{feature.name}</p>
                                                    <p className="text-xs text-slate-400 mt-0.5">{feature.description}</p>
                                                </div>
                                            </td>
                                            {packages.map((pkg) => {
                                                const enabled = isFeatureEnabled(pkg.id, feature.id);
                                                return (
                                                    <td key={pkg.id} className="px-6 py-4 text-center">
                                                        <button
                                                            onClick={() => toggleFeature(pkg.id, feature.id)}
                                                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${enabled
                                                                    ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                                                                    : "bg-slate-100 text-slate-300 hover:bg-slate-200"
                                                                }`}
                                                        >
                                                            {enabled ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                                                        </button>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
