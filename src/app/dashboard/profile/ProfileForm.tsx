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
        <div className="space-y-16">
            {/* Basic Info Section */}
            <section className="space-y-8">
                <div className="border-b border-slate-200 pb-4">
                    <h3 className="text-2xl font-black text-slate-900 font-serif tracking-tight flex items-center gap-3">
                        <User className="w-6 h-6 text-[#D4AF37]" />
                        Informasi Dasar
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">Identitas resmi Anda yang digunakan untuk personalisasi layanan Nikahin.</p>
                </div>

                <div className="max-w-4xl">
                    <RoyalCard>
                        <form onSubmit={handleProfileUpdate} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/5 outline-none transition-all font-bold text-slate-700 shadow-sm"
                                        placeholder="Nama Lengkap Anda"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email <span className="text-slate-300">(ID Permanen)</span></label>
                                    <div className="w-full px-6 py-4 rounded-2xl bg-slate-100/50 border border-slate-100 font-bold text-slate-400 cursor-not-allowed">
                                        {user.email}
                                    </div>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nomor WhatsApp</label>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#D4AF37] transition-colors font-bold text-sm">+62</div>
                                        <input
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/5 outline-none transition-all font-bold text-slate-700 shadow-sm"
                                            placeholder="812XXXXXXXX"
                                            required
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-2 ml-1 flex items-center gap-1.5 font-medium">
                                        <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                                        Digunakan untuk pengiriman notifikasi RSVP dan interaksi tamu.
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end border-t border-slate-50 pt-6">
                                <button
                                    type="submit"
                                    disabled={isSavingProfile}
                                    className="bg-slate-900 hover:bg-black text-white px-10 py-4 rounded-2xl font-black text-sm transition-all flex items-center gap-3 shadow-2xl shadow-slate-200 active:scale-[0.98] disabled:opacity-50"
                                >
                                    {isSavingProfile ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </RoyalCard>
                </div>
            </section>

            {/* Password Section */}
            <section className="space-y-8">
                <div className="border-b border-slate-200 pb-4">
                    <h3 className="text-2xl font-black text-slate-900 font-serif tracking-tight flex items-center gap-3">
                        <Lock className="w-6 h-6 text-rose-500" />
                        Keamanan Akun
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">Kami merekomendasikan penggantian password secara berkala untuk menjaga data Anda.</p>
                </div>

                <div className="max-w-4xl">
                    <RoyalCard>
                        <form onSubmit={handlePasswordUpdate} className="space-y-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password Saat Ini</label>
                                    <input
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-rose-300 focus:ring-4 focus:ring-rose-50/50 outline-none transition-all font-bold text-slate-700 shadow-sm"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password Baru</label>
                                        <input
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/5 outline-none transition-all font-bold text-slate-700 shadow-sm"
                                            placeholder="Min. 6 karakter"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Konfirmasi Password Baru</label>
                                        <input
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/5 outline-none transition-all font-bold text-slate-700 shadow-sm"
                                            placeholder="Ulangi password"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end border-t border-slate-50 pt-6">
                                <button
                                    type="submit"
                                    disabled={isSavingPassword}
                                    className="bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-50 px-10 py-4 rounded-2xl font-black text-sm transition-all flex items-center gap-3 shadow-xl shadow-slate-100 active:scale-[0.98] disabled:opacity-50"
                                >
                                    {isSavingPassword ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </RoyalCard>
                </div>
            </section>
        </div>
    );
}
