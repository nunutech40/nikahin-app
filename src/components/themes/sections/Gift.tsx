"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Gift as GiftIcon, MapPin } from "lucide-react";
import { InvitationData, GiftVariant } from "@/types/invitation";

interface GiftProps {
    giftOptions: InvitationData['giftOptions'];
    shippingAddress: InvitationData['shippingAddress'];
    variant?: GiftVariant;
}

export function GiftSection({ giftOptions, shippingAddress, variant = "card_grid" }: GiftProps) {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [copiedAddress, setCopiedAddress] = useState(false);

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(shippingAddress.address);
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 2000);
    };

    // VARIANT: Card Grid (Cards displayed in a grid)
    if (variant === "card_grid") {
        return (
            <section id="gift" className="section bg-[var(--color-rose-light)] py-20 px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <p className="section-subtitle text-sm uppercase text-[var(--color-primary)]">Wedding Gift</p>
                    <h2 className="section-title text-4xl font-serif text-[var(--color-primary-dark)]">Amplop Digital</h2>
                    <div className="ornament mt-4" />
                </motion.div>

                <p className="text-center text-sm md:text-base text-[var(--color-text-light)] max-w-xl mx-auto mb-12">
                    Doa restu Anda adalah hadiah terindah bagi kami. Namun jika memberi adalah ungkapan kasih, Anda dapat mengirimkan melalui:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {/* Bank Accounts */}
                    {giftOptions.map((option, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -5 }}
                            className="glass bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col items-center text-center"
                        >
                            <span className="text-4xl mb-4">{option.logo}</span>
                            <h3 className="font-serif text-xl font-bold text-[var(--color-primary-dark)] mb-1">
                                {option.bankName}
                            </h3>
                            <p className="text-gray-500 text-sm mb-4">a.n {option.accountHolder}</p>

                            <div className="bg-gray-50 rounded-lg p-3 w-full mb-4 border border-gray-200">
                                <p className="font-mono text-lg font-bold text-gray-700">{option.accountNumber}</p>
                            </div>

                            <button
                                onClick={() => handleCopy(option.accountNumber, index)}
                                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-[var(--color-primary-light)]/20 text-[var(--color-primary-dark)] text-sm font-medium hover:bg-[var(--color-primary)] hover:text-white transition-all"
                            >
                                {copiedIndex === index ? (
                                    <>
                                        <Check className="w-4 h-4" /> Tersalin
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" /> Salin No. Rekening
                                    </>
                                )}
                            </button>
                        </motion.div>
                    ))}

                    {/* Shipping Address (Full Width if needed or Card) */}
                </div>

                {shippingAddress && (
                    <div className="max-w-md mx-auto mt-8 glass bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                        <div className="flex items-center justify-center gap-2 mb-4 text-[var(--color-primary-dark)]">
                            <GiftIcon className="w-5 h-5" />
                            <h3 className="font-serif text-lg font-bold">Kirim Hadiah Fisik</h3>
                        </div>
                        <div className="text-center">
                            <p className="font-medium">{shippingAddress.recipient}</p>
                            <p className="text-sm text-gray-500 mb-4">{shippingAddress.address}</p>
                            <button
                                onClick={handleCopyAddress}
                                className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors text-sm"
                            >
                                {copiedAddress ? <><Check className="w-4 h-4" /> Alamat Tersalin</> : <><Copy className="w-4 h-4" /> Salin Alamat</>}
                            </button>
                        </div>
                    </div>
                )}
            </section>
        );
    }

    // VARIANT: Simple List (Minimalist text list)
    if (variant === "simple_list") {
        return (
            <section id="gift" className="section py-20 px-4 max-w-2xl mx-auto">
                <h2 className="text-center font-serif text-3xl mb-8">Wedding Gift</h2>
                <div className="space-y-6">
                    {giftOptions.map((option, index) => (
                        <div key={index} className="flex items-center justify-between border-b pb-4 border-gray-200">
                            <div>
                                <p className="font-bold text-[var(--color-primary-dark)]">{option.bankName}</p>
                                <p className="text-sm">a.n {option.accountHolder}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-mono text-lg mb-1">{option.accountNumber}</p>
                                <button
                                    onClick={() => handleCopy(option.accountNumber, index)}
                                    className="text-xs text-[var(--color-primary)] hover:underline"
                                >
                                    {copiedIndex === index ? "Tersalin!" : "Salin"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {shippingAddress && (
                    <div className="mt-8 pt-8 border-t border-gray-300">
                        <p className="font-bold mb-2">Alamat Pengiriman:</p>
                        <p className="text-sm text-gray-600">{shippingAddress.address}</p>
                        <p className="text-xs text-gray-500 mt-1">Penerima: {shippingAddress.recipient}</p>
                    </div>
                )}
            </section>
        )
    }

    return null;
}
