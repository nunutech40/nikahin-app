"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Check, X } from "lucide-react";
import { submitRSVP } from "@/app/actions/rsvp";
import { RsvpVariant } from "@/types/invitation";

interface RsvpProps {
    invitationId?: number;
    variant?: RsvpVariant;
}

export function Rsvp({ invitationId, variant = "standard_form" }: RsvpProps) {
    const [formData, setFormData] = useState({
        name: "",
        attendance: "" as "hadir" | "tidak" | "ragu" | "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!invitationId) return;

        setIsSubmitting(true);
        setStatus(null);

        const result = await submitRSVP({
            invitationId,
            name: formData.name,
            attendance: formData.attendance as "hadir" | "tidak" | "ragu",
            message: formData.message,
        });

        setIsSubmitting(false);

        if (result.success) {
            setStatus({ type: 'success', message: "Terima kasih! Konfirmasi Anda telah terkirim." });
            setFormData({ name: "", attendance: "", message: "" });
            // Close modal after delay if in modal mode
            if (variant === "modal_popup") {
                setTimeout(() => setIsModalOpen(false), 2000);
            }
        } else {
            setStatus({ type: 'error', message: result.error || "Gagal mengirim konfirmasi" });
        }
    };

    // VARIANT: Standard Form (Inline)
    if (variant === "standard_form") {
        return (
            <section id="rsvp" className="section scroll-mt-20 py-20 px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-10"
                >
                    <p className="section-subtitle text-sm text-[var(--color-primary)] mb-2 uppercase tracking-wide">Konfirmasi Kehadiran</p>
                    <h2 className="section-title text-4xl font-serif text-[var(--color-primary-dark)]">RSVP</h2>
                    <div className="ornament mt-4" />
                </motion.div>

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    onSubmit={handleSubmit}
                    className="max-w-md mx-auto glass bg-white/80 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl border border-white"
                >
                    {status && (
                        <div className={`mb-4 p-4 rounded-xl text-sm ${status.type === 'success'
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                            }`}>
                            {status.message}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Nama Lengkap"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all bg-white/50"
                            />
                        </div>

                        <div>
                            <select
                                value={formData.attendance}
                                onChange={(e) => setFormData({ ...formData, attendance: e.target.value as any })}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all bg-white/50"
                            >
                                <option value="">Konfirmasi Kehadiran</option>
                                <option value="hadir">Hadir</option>
                                <option value="tidak">Tidak Hadir</option>
                                <option value="ragu">Masih Ragu</option>
                            </select>
                        </div>

                        <div>
                            <textarea
                                placeholder="Ucapan & Doa (Opsional)"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all resize-none bg-white/50"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || !invitationId}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white text-sm md:text-base font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-4 h-4" />
                            {isSubmitting ? "Mengirim..." : "Kirim Konfirmasi"}
                        </button>
                        {!invitationId && (
                            <p className="text-[10px] text-center text-red-400 mt-2">Mode Preview: RSVP dinonaktifkan</p>
                        )}
                    </div>
                </motion.form>
            </section>
        );
    }

    // VARIANT: Modal Popup
    if (variant === "modal_popup") {
        return (
            <section id="rsvp" className="section py-20 px-4 text-center">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl font-serif mb-6">Akan Hadir?</h2>
                    <p className="text-[var(--color-text-muted)] mb-8">Beritahu kami apakah Anda bisa bergabung dalam perayaan kami.</p>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-8 py-4 bg-[var(--color-primary-dark)] text-white rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
                    >
                        Buka Formulir RSVP
                    </button>
                </div>

                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white w-full max-w-md rounded-3xl p-6 relative shadow-2xl"
                            >
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                                >
                                    <X className="w-4 h-4" />
                                </button>

                                <h3 className="text-2xl font-serif mb-6 text-[var(--color-primary-dark)]">Konfirmasi Kehadiran</h3>
                                {/* Reusing the form logic inside modal */}
                                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                                    {status && (
                                        <div className={`p-3 rounded-lg text-sm ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {status.message}
                                        </div>
                                    )}
                                    <input
                                        type="text"
                                        placeholder="Nama Lengkap"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="w-full p-3 border rounded-xl"
                                    />
                                    <select
                                        value={formData.attendance}
                                        onChange={(e) => setFormData({ ...formData, attendance: e.target.value as any })}
                                        required
                                        className="w-full p-3 border rounded-xl"
                                    >
                                        <option value="">Status Kehadiran</option>
                                        <option value="hadir">Hadir</option>
                                        <option value="tidak">Tidak Hadir</option>
                                        <option value="ragu">Ragu-ragu</option>
                                    </select>
                                    <textarea
                                        placeholder="Pesan"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full p-3 border rounded-xl"
                                        rows={3}
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !invitationId}
                                        className="w-full py-3 bg-[var(--color-primary)] text-white rounded-xl font-bold hover:bg-[var(--color-primary-dark)]"
                                    >
                                        {isSubmitting ? "Mengirim..." : "Kirim Sekarang"}
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </section>
        );
    }

    return null;
}
