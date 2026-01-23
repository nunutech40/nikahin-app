"use client";

import React, { useState } from "react";
import RoyalCard from "@/components/ui/RoyalCard";
import { User, Phone, Lock, Save, RefreshCcw, ShieldCheck } from "lucide-react";
import { updateProfile, updatePassword } from "@/app/actions/profile";
import { toast } from "sonner";

interface ProfileFormProps {
    user: {
        name: string | null;
        email: string;
        phone: string | null;
    };
}

export default function ProfileForm({ user }: ProfileFormProps) {
    const [profileData, setProfileData] = useState({
        name: user.name || "",
        phone: user.phone || "",
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingProfile(true);
        try {
            const result = await updateProfile(profileData);
            if (result.success) {
                toast.success("Profil berhasil diperbarui!");
            } else {
                toast.error(result.error || "Gagal memperbarui profil.");
            }
        } catch (error) {
            toast.error("Terjadi kesalahan sistem.");
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingPassword(true);
        try {
            const result = await updatePassword(passwordData);
            if (result.success) {
                toast.success("Password berhasil diperbarui!");
                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            } else {
                toast.error(result.error || "Gagal memperbarui password.");
            }
        } catch (error) {
            toast.error("Terjadi kesalahan sistem.");
        } finally {
            setIsSavingPassword(false);
        }
    };

    return (
        <div className="space-y-10">
            {/* Basic Info Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <h3 className="text-xl font-black text-slate-900 font-serif tracking-tight mb-2">Informasi Dasar</h3>
                    <p className="text-slate-500 text-sm">Update informasi identitas Anda yang akan digunakan untuk personalisasi layanan.</p>
                </div>
                <div className="lg:col-span-2">
                    <RoyalCard>
                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <User className="w-3 h-3" /> Nama Lengkap
                                    </label>
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700"
                                        placeholder="Nama Anda"
                                        required
                                    />
                                </div>
                                <div className="space-y-2 text-slate-400">
                                    <label className="text-[10px] font-black uppercase tracking-widest ml-1">Email (Permanent)</label>
                                    <div className="w-full px-5 py-3 rounded-xl bg-slate-100/50 border border-slate-100 font-bold text-slate-400 cursor-not-allowed">
                                        {user.email}
                                    </div>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Phone className="w-3 h-3" /> Nomor WhatsApp
                                    </label>
                                    <input
                                        type="tel"
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                        className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700"
                                        placeholder="0812XXXXXXXX"
                                        required
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">* Digunakan untuk pengiriman notifikasi RSVP dan tamu.</p>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={isSavingProfile}
                                    className="bg-slate-900 hover:bg-black text-white px-8 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 shadow-xl shadow-slate-200"
                                >
                                    {isSavingProfile ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </RoyalCard>
                </div>
            </div>

            <div className="h-px bg-slate-200" />

            {/* Password Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <h3 className="text-xl font-black text-slate-900 font-serif tracking-tight mb-2">Keamanan Akun</h3>
                    <p className="text-slate-500 text-sm">Pastikan akun Anda tetap aman dengan menggunakan password yang kuat dan unik.</p>
                </div>
                <div className="lg:col-span-2">
                    <RoyalCard>
                        <form onSubmit={handlePasswordUpdate} className="space-y-6">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Lock className="w-3 h-3" /> Password Saat Ini
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <ShieldCheck className="w-3 h-3" /> Password Baru
                                        </label>
                                        <input
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700"
                                            placeholder="Minimal 6 karakter"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <ShieldCheck className="w-3 h-3" /> Konfirmasi Password Baru
                                        </label>
                                        <input
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700"
                                            placeholder="Ulangi password baru"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={isSavingPassword}
                                    className="bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-50 px-8 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 shadow-xl shadow-slate-100"
                                >
                                    {isSavingPassword ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </RoyalCard>
                </div>
            </div>
        </div>
    );
}
