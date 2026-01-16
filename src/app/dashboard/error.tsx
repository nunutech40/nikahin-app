"use client";

import { useEffect } from "react";
import RoyalErrorState from "@/components/ui/RoyalErrorState";

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Dashboard Error:", error);
    }, [error]);

    return (
        <div className="flex items-center justify-center min-h-[70vh]">
            <RoyalErrorState
                title="Aplikasi sedang lelah"
                description="Ada kendala saat memuat pengaturan undangan kamu. Klik tombol di bawah untuk mencoba lagi."
                reset={reset}
            />
        </div>
    );
}
