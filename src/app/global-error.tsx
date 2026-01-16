"use client";

import RoyalErrorState from "@/components/ui/RoyalErrorState";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <div className="flex items-center justify-center min-h-screen bg-slate-50">
                    <RoyalErrorState
                        title="Terjadi Kesalahan Fatal"
                        description="Mohon maaf atas ketidaknyamanannya. Sistem kami sedang mengalami gangguan total. Kami akan segera kembali."
                        reset={reset}
                    />
                </div>
            </body>
        </html>
    );
}
