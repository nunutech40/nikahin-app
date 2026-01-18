import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Heart, Stars, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { PricingCard } from "@/components/PricingCard";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navbar Minimalist */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37] flex items-center justify-center text-white shadow-lg shadow-[#D4AF37]/20">
                <Heart className="w-6 h-6 fill-current" />
              </div>
              <span className="font-serif text-2xl font-bold text-[#b28f1f]">Nikahin</span>
            </div>

            <div className="flex items-center gap-4">
              {session ? (
                <Link
                  href="/dashboard"
                  className="px-6 py-2.5 bg-[#D4AF37] text-white rounded-full font-semibold hover:bg-[#b28f1f] transition-all"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="text-gray-600 font-medium hover:text-[#D4AF37] transition-colors">
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className="px-6 py-2.5 bg-[#D4AF37] text-white rounded-full font-semibold hover:bg-[#b28f1f] transition-all shadow-lg shadow-[#D4AF37]/20"
                  >
                    Mulai Sekarang
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 relative">
        {/* Background Decors */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-amber-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-50 rounded-full blur-3xl opacity-50" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full text-[#D4AF37] text-sm font-semibold mb-8 border border-amber-100 animate-bounce">
              <Stars className="w-4 h-4" />
              Platform Undangan Digital No. 1 di Indonesia
            </div>

            <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 leading-tight mb-8">
              Abadikan Momen <span className="text-[#D4AF37] italic">Bahagiamu</span> Dengan Elegan.
            </h1>

            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Buat undangan pernikahan digital yang modern, interaktif, dan memukau hanya dalam hitungan menit. Tanpa ribet, langsung live!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/demo-register"
                className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-[#D4AF37] to-[#b28f1f] text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all shadow-xl shadow-[#D4AF37]/30 flex items-center justify-center gap-3 group"
              >
                <Sparkles className="w-6 h-6" />
                Coba Gratis Sekarang
              </Link>

              <Link
                href="/register"
                className="w-full sm:w-auto px-10 py-5 bg-white text-gray-700 border-2 border-gray-200 rounded-2xl font-bold text-lg hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all flex items-center justify-center gap-3 group"
              >
                Buat Akun
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>

              <Link
                href="/rizka-ayu"
                className="w-full sm:w-auto px-10 py-5 bg-gray-50 text-gray-600 border border-gray-200 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-3"
              >
                Lihat Contoh
              </Link>
            </div>

            {/* Features Preview */}
            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {[
                { title: "Tema Premium", desc: "Berbagai pilihan desain eksklusif yang bisa disesuaikan.", icon: <Sparkles /> },
                { title: "RSVP Real-time", desc: "Pantau tamu yang akan hadir secara langsung lewat dashboard.", icon: <CheckCircle2 /> },
                { title: "Buku Tamu Digital", desc: "Terima ucapan doa dari orang terkasih secara digital.", icon: <Heart /> }
              ].map((f, i) => (
                <div key={i} className="p-8 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100/20 hover:border-[#D4AF37] transition-colors group">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-[#D4AF37] mb-6 group-hover:bg-[#D4AF37] group-hover:text-white transition-all">
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{f.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Pricing Section */}
      <section className="py-24 bg-gradient-to-b from-white to-amber-50/30 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-100 rounded-full blur-3xl opacity-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-[#D4AF37] text-sm font-semibold mb-6 border border-amber-100 shadow-lg">
              <Sparkles className="w-4 h-4" />
              Pilih Paket Terbaik untuk Anda
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
              Harga yang <span className="text-[#D4AF37] italic">Transparan</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Test semua fitur gratis, bayar hanya saat publish. Tanpa biaya tersembunyi!
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Bronze Package */}
            <PricingCard
              name="Bronze"
              slug="bronze"
              price={0}
              description="Coba dulu sebelum bayar"
              isFree={true}
              features={[
                "Info Mempelai & Orang Tua",
                "1 Detail Acara (Akad)",
                "Tema Basic",
                "RSVP Basic",
                "Google Maps",
                "Countdown Timer",
                "Buku Tamu Digital",
              ]}
            />

            {/* Silver Package */}
            <PricingCard
              name="Silver"
              slug="silver"
              price={150000}
              description="Paling populer & best value"
              isPopular={true}
              features={[
                "Semua fitur Bronze",
                "Unlimited Acara (Akad + Resepsi)",
                "Galeri Foto (10 foto)",
                "Musik Latar",
                "Quote & Doa",
                "RSVP Export CSV",
                "Tema Premium",
              ]}
            />

            {/* Gold Package */}
            <PricingCard
              name="Gold"
              slug="gold"
              price={300000}
              description="Fitur lengkap eksklusif"
              features={[
                "Semua fitur Silver",
                "Love Story Timeline",
                "Gift Registry (Amplop Digital)",
                "Custom Colors & Fonts",
                "Gallery Unlimited (30 foto)",
                "Remove Branding",
                "Prioritas Support",
              ]}
            />
          </div>

          {/* Trust Badge */}
          <div className="mt-16 text-center">
            <p className="text-sm text-gray-500 font-semibold mb-4">
              ✨ Semua paket: Test full features gratis, bayar hanya saat publish
            </p>
            <div className="flex items-center justify-center gap-8 text-gray-400 text-xs">
              <span>✓ Tanpa Biaya Tersembunyi</span>
              <span>✓ Refund 100% Jika Tidak Puas</span>
              <span>✓ Support 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-slate-50 py-20 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-10">Dipercayai oleh ribuan pasangan bahagia</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
            {/* Logo placeholders */}
            <h2 className="text-2xl font-serif font-bold italic">Weddingku</h2>
            <h2 className="text-2xl font-serif font-bold italic">Bridestory</h2>
            <h2 className="text-2xl font-serif font-bold italic">VowBox</h2>
            <h2 className="text-2xl font-serif font-bold italic">LoveTie</h2>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-gray-100">
        <div className="text-center text-gray-400 text-sm">
          &copy; 2026 Nikahin. Dibuat dengan cinta untuk hari bahagiamu.
        </div>
      </footer>
    </div>
  );
}