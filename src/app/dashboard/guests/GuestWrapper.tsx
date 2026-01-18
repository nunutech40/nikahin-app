"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import AddGuestModal from "./AddGuestModal";

interface GuestWrapperProps {
    invitationId: number;
}

export default function GuestWrapper({ invitationId }: GuestWrapperProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-[#B48C5E] text-white rounded-2xl font-black text-sm hover:shadow-xl hover:shadow-[#B48C5E]/20 transition-all active:scale-95"
            >
                <Plus className="w-4 h-4" />
                TAMBAH TAMU
            </button>

            <AddGuestModal
                invitationId={invitationId}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
