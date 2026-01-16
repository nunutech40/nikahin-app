"use client";

import React, { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { updateTransactionStatus } from "@/app/actions/billing";
import { toast } from "sonner";

interface BillingClientActionsProps {
    transactionId: number;
}

export default function BillingClientActions({ transactionId }: BillingClientActionsProps) {
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    const handleAction = async (status: "approved" | "rejected") => {
        setIsUpdating(status);
        try {
            const result = await updateTransactionStatus(transactionId, status);
            if (result.success) {
                toast.success(`Transaction ${status === 'approved' ? 'Approved' : 'Rejected'}!`, {
                    description: status === 'approved' ? "Customer account has been activated." : "Transaction marked as rejected."
                });
            } else {
                toast.error("Action failed: " + result.error);
            }
        } catch (err) {
            toast.error("An unexpected error occurred.");
        } finally {
            setIsUpdating(null);
        }
    };

    return (
        <div className="flex items-center justify-end gap-2">
            <button
                onClick={() => handleAction("rejected")}
                disabled={!!isUpdating}
                className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50 border border-transparent hover:border-red-100"
                title="Reject Payment"
            >
                {isUpdating === "rejected" ? <Loader2 className="w-5 h-5 animate-spin" /> : <X className="w-5 h-5" />}
            </button>
            <button
                onClick={() => handleAction("approved")}
                disabled={!!isUpdating}
                className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-95 disabled:opacity-50 flex items-center gap-2"
                title="Approve & Activate"
            >
                {isUpdating === "approved" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                        <Check className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest px-1">Approve</span>
                    </>
                )}
            </button>
        </div>
    );
}
