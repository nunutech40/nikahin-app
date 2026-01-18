"use client";

import { useState } from "react";
import { Globe, Loader2 } from "lucide-react";
import { publishInvitation } from "@/app/actions/invitation";
import { PaymentRequiredModal } from "./PaymentRequiredModal";
import { toast } from "sonner";

interface PublishButtonProps {
    invitationId: number;
    isPublished: boolean;
    onPublishSuccess?: () => void;
}

export function PublishButton({ invitationId, isPublished, onPublishSuccess }: PublishButtonProps) {
    const [isPublishing, setIsPublishing] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState<{ packageName: string; packagePrice: number }>({
        packageName: "",
        packagePrice: 0
    });

    const handlePublish = async () => {
        setIsPublishing(true);

        try {
            const result = await publishInvitation(invitationId);

            if (result.success) {
                toast.success(result.message || "Undangan berhasil dipublish!");
                onPublishSuccess?.();
            } else {
                // Check if payment is required
                if (result.error === "payment_required") {
                    setPaymentInfo({
                        packageName: result.packageName || "",
                        packagePrice: result.packagePrice || 0
                    });
                    setShowPaymentModal(true);
                } else {
                    toast.error(result.error || "Gagal mempublish undangan");
                }
            }
        } catch (error) {
            console.error("Publish error:", error);
            toast.error("Terjadi kesalahan saat mempublish");
        } finally {
            setIsPublishing(false);
        }
    };

    if (isPublished) {
        return (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl border border-green-200 font-semibold text-sm">
                <Globe className="w-4 h-4" />
                Sudah Dipublish
            </div>
        );
    }

    return (
        <>
            <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-white rounded-xl font-bold hover:bg-[#b28f1f] transition-all shadow-lg shadow-amber-200/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPublishing ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Publishing...
                    </>
                ) : (
                    <>
                        <Globe className="w-5 h-5" />
                        Publish Undangan
                    </>
                )}
            </button>

            {/* Payment Required Modal */}
            <PaymentRequiredModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                packageName={paymentInfo.packageName}
                packagePrice={paymentInfo.packagePrice}
            />
        </>
    );
}
