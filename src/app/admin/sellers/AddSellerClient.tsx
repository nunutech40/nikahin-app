"use client";

import { useState } from "react";
import { Plus, X, User, Mail, Phone, Lock, ArrowRight, Store, Eye, EyeOff } from "lucide-react";
import { createSeller } from "@/app/actions/admin";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AddSellerClient() {
    const [isOpen, setIsOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    });

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const result = await createSeller(formData);

        if (result.success) {
            toast.success("Seller berhasil ditambahkan!");
            setIsOpen(false);
            setFormData({ name: "", email: "", phone: "", password: "" });
            router.refresh();
        } else {
            toast.error(result.error || "Gagal menambah seller");
        }
        setIsSubmitting(false);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-200/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
                <Plus className="w-4 h-4" /> Tambah Seller
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="relative bg-white rounded-[40px] w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                                    <Store className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-serif font-black text-slate-900">Provision New Seller</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Admin Authorization Required</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-400"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nama Owner / Agensi</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: Digital Nikah Solo"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all placeholder:text-slate-300 font-medium"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Seller</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                                        <input
                                            type="email"
                                            required
                                            placeholder="seller@nikahin.id"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all placeholder:text-slate-300 font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nomor WhatsApp</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                                        <input
                                            type="tel"
                                            required
                                            placeholder="0812..."
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all placeholder:text-slate-300 font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Set Password Awal</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        placeholder="Min. 6 karakter"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all placeholder:text-slate-300 font-medium"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-500 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-slate-900 hover:bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-50"
                            >
                                {isSubmitting ? "Provisioning..." : (
                                    <>
                                        Daftarkan Seller <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
