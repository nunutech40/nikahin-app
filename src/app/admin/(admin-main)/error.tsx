"use client";

import { useEffect } from "react";
import RoyalErrorState from "@/components/ui/RoyalErrorState";

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service like Sentry
        console.error("Admin Dashboard Error:", error);
    }, [error]);

    return (
        <div className="flex items-center justify-center min-h-[70vh]">
            <RoyalErrorState
                title="Admin Dashboard Error"
                description="Terjadi kesalahan saat memproses data dashboard. Tim teknis sudah kami beri tahu."
                reset={reset}
                showHome={false}
            />
        </div>
    );
}
