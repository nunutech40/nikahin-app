import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { packages, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Heart, Check, Sparkles, CreditCard, ShieldCheck, ArrowRight, Zap } from "lucide-react";

export default async function BillingPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");

    const userId = Number((session.user as any).id);

    // Get user and their current package
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        with: {
            package: true,
        }
    });

    if (!user) redirect("/login");

    // Get all available packages except demo
    const availablePackages = await db.query.packages.findMany({
        where: (packages, { eq, ne, and }) => and(eq(packages.isActive, true), ne(packages.slug, "demo")),
        orderBy: (packages, { asc }) => [asc(packages.id)]
    });

    const isPaid = user.isActive;
    const currentPkg = user.package;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header Area */}
            <div className="bg-white border-b border-slate-200 py-12">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <p className="text-[#D4AF37] font-black uppercase tracking-widest text-xs mb-2">Billing & Subscription</p>
                            <h1 className="text-4xl font-serif font-black text-slate-900">Pembayaran & Paket</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/dashboard"
                                className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                            >
                                Kembali ke Dashboard
                            </Link>
                        </div>
                    </div>

                    {/* Current Status Card */}
                    <div className="mt-10 p-8 rounded-[32px] bg-slate-900 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] opacity-10 blur-[100px] -mr-32 -mt-32" />

                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                    <Zap className={`w-10 h-10 ${isPaid ? 'text-[#D4AF37]' : 'text-slate-400'}`} />
                                </div>
                                <div>
                                    <p className="text-slate-400 text-sm font-medium mb-1">Paket Saat Ini</p>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-3xl font-black">{currentPkg?.name || 'Bronze'}</h2>
                                        {isPaid ? (
                                            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-black uppercase tracking-widest">Aktif</span>
                                        ) : (
                                            <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-xs font-black uppercase tracking-widest">Belum Aktif</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {!isPaid && (
                                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm max-w-sm">
                                    <div className="flex gap-4 items-start">
                                        <ShieldCheck className="w-6 h-6 text-[#D4AF37] shrink-0" />
                                        <div>
                                            <p className="text-sm font-bold text-white mb-1">Butuh Aktivasi?</p>
                                            <p className="text-xs text-slate-400 leading-relaxed">
                                                Undangan Anda belum bisa dipublish. Silakan pilih paket di bawah untuk mengaktifkan fitur sharing & link kustom.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Price Grid */}
            <div className="max-w-6xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h3 className="text-3xl font-serif font-black text-slate-900">Upgrade Paket Anda</h3>
                    <p className="text-slate-500 mt-2">Dapatkan fitur premium untuk undangan yang lebih berkesan</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {availablePackages.map((pkg) => (
                        <div
                            key={pkg.id}
                            className={`relative bg-white rounded-[40px] p-10 border-2 transition-all group ${currentPkg?.id === pkg.id
                                ? 'border-[#D4AF37] shadow-xl shadow-amber-900/5 ring-4 ring-[#D4AF37]/5'
                                : 'border-slate-100 hover:border-slate-200'
                                }`}
                        >
                            {currentPkg?.id === pkg.id && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#D4AF37] text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                                    Paket Anda
                                </div>
                            )}

                            <div className="mb-8">
                                <h4 className="text-2xl font-black text-slate-800 mb-1">{pkg.name}</h4>
                                <p className="text-sm text-slate-400">Lifetime Access</p>
                            </div>

                            <div className="mb-10">
                                {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                                    <div className="text-sm line-through text-slate-400 font-bold mb-1">
                                        Rp {(pkg.originalPrice / 1000)}k
                                    </div>
                                )}
                                <span className="text-4xl font-black text-slate-900">
                                    {pkg.price === 0 ? 'Gratis' : `Rp ${(pkg.price / 1000)}k`}
                                </span>
                            </div>

                            <ul className="space-y-4 mb-10">
                                <li className="flex items-center gap-3 text-sm text-slate-600">
                                    <Check className="w-5 h-5 text-[#D4AF37] shrink-0" />
                                    <span>Template Premium</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-slate-600">
                                    <Check className="w-5 h-5 text-[#D4AF37] shrink-0" />
                                    <span>Guestbook & RSVP</span>
                                </li>
                                {pkg.slug !== 'bronze' && (
                                    <>
                                        <li className="flex items-center gap-3 text-sm text-slate-600 font-bold">
                                            <Check className="w-5 h-5 text-[#D4AF37] shrink-0" />
                                            <span>Love Story & Galeri</span>
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-slate-600">
                                            <Check className="w-5 h-5 text-[#D4AF37] shrink-0" />
                                            <span>Musik Latar</span>
                                        </li>
                                    </>
                                )}
                                {pkg.slug === 'gold' && (
                                    <li className="flex items-center gap-3 text-sm text-slate-600">
                                        <Check className="w-5 h-5 text-[#D4AF37] shrink-0" />
                                        <span>No Branding</span>
                                    </li>
                                )}
                            </ul>

                            <button
                                disabled={currentPkg?.id === pkg.id && isPaid}
                                className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3 ${currentPkg?.id === pkg.id && isPaid
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-slate-900 text-white hover:bg-black shadow-xl shadow-slate-200 active:scale-[0.98]'
                                    }`}
                            >
                                {currentPkg?.id === pkg.id && !isPaid ? 'Bayar Sekarang' :
                                    currentPkg?.id === pkg.id && isPaid ? 'Sudah Aktif' : 'Pilih Paket'}
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Manual Payment Section (If not paid) */}
                {!isPaid && (
                    <div className="mt-20 max-w-4xl mx-auto">
                        <div className="bg-amber-50 rounded-[40px] p-12 border-2 border-amber-100 relative overflow-hidden">
                            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                                <div>
                                    <h3 className="text-3xl font-serif font-black text-amber-900 mb-6">Instruksi Pembayaran</h3>
                                    <p className="text-amber-800/70 text-sm leading-relaxed mb-8">
                                        Silakan lakukan pembayaran sesuai harga paket yang dipilih ke rekening di bawah ini:
                                    </p>

                                    <div className="space-y-4">
                                        <div className="bg-white/60 backdrop-blur-sm p-6 rounded-3xl border border-amber-200 flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Bank Central Asia (BCA)</p>
                                                <p className="text-xl font-black text-amber-950">1234567890</p>
                                                <p className="text-xs text-amber-800/60 font-medium">a.n. Nunu Nugraha</p>
                                            </div>
                                            <CreditCard className="w-8 h-8 text-amber-200" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-amber-900/5">
                                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-amber-400" />
                                        Konfirmasi Otomatis
                                    </h4>
                                    <p className="text-sm text-slate-500 leading-relaxed mb-6">
                                        Setelah membayar, kirim bukti transfer ke WhatsApp admin untuk aktivasi instan (kurang dari 5 menit).
                                    </p>
                                    <a
                                        href="https://wa.me/628123456789?text=Halo%20Admin%2C%20saya%20sudah%20melakukan%20pembayaran%20untuk%20paket%20undangan."
                                        target="_blank"
                                        className="w-full py-4 bg-[#25D366] text-white rounded-2xl font-black text-center shadow-lg shadow-green-200 hover:bg-[#1ebd5b] transition-all block"
                                    >
                                        Konfirmasi via WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
