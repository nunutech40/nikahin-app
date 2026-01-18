import Link from "next/link";
import { ArrowRight, Heart, Music, MapPin, Users, Gift, Palette, Sparkles, Star, Check, Play, Zap, ShieldCheck } from "lucide-react";
import { PricingCard } from "@/components/PricingCard";
import { FloatingHearts } from "@/components/FloatingHearts";
import { ThemeShowcase } from "@/components/ThemeShowcase";
import { db } from "@/db";
import { themes } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function HomePage() {
  // Fetch active themes for showcase
  const availableThemes = await db.query.themes.findMany({
    where: eq(themes.isActive, true),
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/70 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-[#D4AF37] fill-current" />
            <span className="font-serif text-2xl font-black text-gray-900 tracking-tight">Nikahin</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-bold text-gray-600 hover:text-[#D4AF37] transition-colors">Fitur</a>
            <a href="#themes" className="text-sm font-bold text-gray-600 hover:text-[#D4AF37] transition-colors">Tema</a>
            <a href="#pricing" className="text-sm font-bold text-gray-600 hover:text-[#D4AF37] transition-colors">Harga</a>
            <Link href="/login" className="text-sm font-bold text-gray-600 hover:text-[#D4AF37] transition-colors">Login</Link>
          </div>
          <Link
            href="/register"
            className="px-6 py-2.5 bg-[#D4AF37] text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-amber-200 transition-all active:scale-95"
          >
            Mulai Sekarang
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Abstract Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-100 rounded-full blur-[120px] opacity-60 animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-100 rounded-full blur-[120px] opacity-60 animate-pulse delay-700" />
        </div>

        <FloatingHearts />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full border border-amber-100/50 text-[#D4AF37] font-bold text-[10px] uppercase tracking-[0.2em]">
              <Sparkles className="w-3 h-3" /> Undangan Digital Masa Kini
            </div>
          </div>

          <h1 className="font-serif text-5xl md:text-8xl font-black text-gray-900 mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            Buat Undangan Mewah
            <br />
            <span className="italic font-normal">dalam</span> <span className="bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#D4AF37] bg-clip-text text-transparent">Hitungan Menit.</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-400">
            Coba semua fitur premium secara gratis sebelum memutuskan. Platform undangan tercanggih dengan puluhan tema, integrasi RSVP WhatsApp, dan Amplop Digital.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-600">
            <Link
              href="/demo-register"
              className="group w-full sm:w-auto px-10 py-5 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-black hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
            >
              Uji Coba Demo Gratis
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>

            <Link
              href="/rizka-ayu"
              target="_blank"
              className="w-full sm:w-auto px-10 py-5 bg-white text-gray-900 border-2 border-slate-200 rounded-2xl font-black text-lg hover:border-[#D4AF37] hover:bg-amber-50/50 transition-all flex items-center justify-center gap-3"
            >
              <Play className="w-5 h-5 fill-current" />
              Lihat Demo Tema
            </Link>
          </div>

          {/* Social Proof Mini */}
          <div className="mt-16 flex flex-col items-center gap-4 opacity-60 animate-in fade-in duration-1000 delay-1000">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                  <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="User" />
                </div>
              ))}
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">❤️ Dipercayai 12.400+ Pasangan se-Indonesia</p>
          </div>
        </div>
      </section>

      {/* Feature highlight bar */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Zap, label: "Langsung Aktif" },
              { icon: ShieldCheck, label: "Aman & Privat" },
              { icon: Heart, label: "Desain Eksklusif" },
              { icon: Users, label: "Support 24/7" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 justify-center text-gray-500">
                <item.icon className="w-5 h-5 text-[#D4AF37]" />
                <span className="font-bold text-xs uppercase tracking-widest">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50 rounded-lg text-rose-500 font-bold text-[10px] uppercase tracking-wider mb-6">
                <Users className="w-3 h-3" /> Fitur Unggulan
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-black text-gray-900 mb-8 leading-tight">
                Undangan yang <br />
                <span className="text-[#D4AF37]">Bekerja untuk Anda.</span>
              </h2>
              <div className="space-y-10">
                {[
                  {
                    icon: Zap,
                    title: "RSVP WhatsApp Otomatis",
                    desc: "Tamu konfirmasi via WhatsApp, data langsung masuk ke inbox dashboard Anda secara real-time."
                  },
                  {
                    icon: Gift,
                    title: "Amplop & Kado Digital",
                    desc: "Terima kado pernikahan langsung ke rekening atau e-wallet tanpa biaya admin tambahan."
                  },
                  {
                    icon: Palette,
                    title: "Live Theme Customizer",
                    desc: "Ubah warna, font, dan urutan bagian undangan sesukamu dengan editor tanpa kode."
                  }
                ].map((f, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <f.icon className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-gray-900 mb-2">{f.title}</h4>
                      <p className="text-gray-600 leading-relaxed text-sm">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-200/20 to-rose-200/10 rounded-[40px] -rotate-3" />
              <div className="relative bg-white p-4 rounded-[40px] shadow-2xl shadow-amber-200/20 border border-gray-100">
                <div className="rounded-[30px] overflow-hidden bg-slate-100 aspect-[4/5] relative">
                  <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-black italic text-4xl opacity-20 uppercase tracking-tighter -rotate-12">
                    Modern Luxury
                  </div>
                  <img
                    src="/images/themes/rizka-ayu-preview.png"
                    alt="Feature Showcase"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Float Badge */}
              <div className="absolute -bottom-10 -right-10 bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 animate-bounce delay-1000 hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">Konfirmasi RSVP</p>
                    <p className="text-lg font-black text-slate-900">+12 Tamu Baru</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Theme Showcase Section */}
      <div id="themes">
        <ThemeShowcase themes={availableThemes} />
      </div>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 bg-slate-50 relative overflow-hidden">
        {/* Abstract shapes for pricing */}
        <div className="absolute top-0 right-0 w-1/4 h-1/4 bg-amber-200/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-200/20 blur-[100px] rounded-full" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="font-serif text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Investasi Terbaik untuk <span className="text-[#D4AF37]">Satu Kali Seumur Hidup</span>
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Satu harga, selamanya. Tidak ada biaya berlangganan bulanan.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard
              name="Essential"
              price={99000}
              originalPrice={199000}
              description="Simple & Elegan untuk budget minimalis"
              features={[
                { name: "Input Mempelai & 2 Acara", checked: true },
                { name: "Pilihan Tema Standard", checked: true },
                { name: "Tema Premium (Eksklusif)", checked: false },
                { name: "Max. 10 Galeri Foto", checked: true },
                { name: "RSVP & Ucapan Dasar", checked: true },
                { name: "Love Story & Musik", checked: false },
                { name: "Digital Envelope (QR Angpao)", checked: false },
                { name: "Tanpa Label Nikahin", checked: false },
                { name: "Masa Aktif 1 Tahun", checked: true },
                { name: "WhatsApp Blast Sender", checked: false },
                { name: "QR Check-in Tamu", checked: false },
              ]}
              packageSlug="silver"
              popular={false}
            />

            <PricingCard
              name="Premium"
              price={149000}
              originalPrice={349000}
              description="Favorit 90% Pasangan Happily Ever After"
              features={[
                { name: "Input Mempelai & 2 Acara", checked: true },
                { name: "Pilihan Tema Standard", checked: true },
                { name: "SEMUA Tema Premium", checked: true },
                { name: "Unlimited Photo Gallery", checked: true },
                { name: "RSVP & Ucapan Dasar", checked: true },
                { name: "Full Love Story & Musik", checked: true },
                { name: "Digital Envelope (QR Angpao)", checked: true },
                { name: "TANPA Watermark Nikahin", checked: true },
                { name: "Masa Aktif SELAMANYA", checked: true },
                { name: "WhatsApp Blast Sender", checked: false },
                { name: "QR Check-in Tamu", checked: false },
              ]}
              packageSlug="gold"
              popular={true}
            />

            <PricingCard
              name="Royal"
              price={299000}
              originalPrice={699000}
              description="Teknologi Resepsionis Digital Tercanggih"
              features={[
                { name: "Input Mempelai & 2 Acara", checked: true },
                { name: "Pilihan Tema Standard", checked: true },
                { name: "SEMUA Tema Premium", checked: true },
                { name: "Unlimited Photo Gallery", checked: true },
                { name: "RSVP & Ucapan Dasar", checked: true },
                { name: "Full Love Story & Musik", checked: true },
                { name: "Digital Envelope (QR Angpao)", checked: true },
                { name: "TANPA Watermark Nikahin", checked: true },
                { name: "Masa Aktif SELAMANYA", checked: true },
                { name: "WhatsApp Blast Automator", checked: true },
                { name: "QR Check-in Tamu Hari-H", checked: true },
              ]}
              packageSlug="platinum"
              popular={false}
            />
          </div>
        </div>
      </section>

      {/* FAQ / Trust Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div className="text-center md:text-left">
            <h3 className="font-black text-xl text-gray-900 mb-4">Ganti Tema Kapan Saja</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Bosan dengan desain saat ini? Cukup ganti sekali klik melalui dashboard tanpa harus mengisi data lagi.</p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="font-black text-xl text-gray-900 mb-4">Hosting & Server Selamanya</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Undangan Anda akan tetap aktif selamanya untuk kenangan indah di masa depan.</p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="font-black text-xl text-gray-900 mb-4">Ramah Mobile & Desktop</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Tampilan undangan yang responsif dan sangat cepat (loading kurang dari 2 detik).</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[#D4AF37]/5" />
          <FloatingHearts />
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="font-serif text-4xl md:text-6xl font-black text-white mb-8">
            Siap Menjadi Pasangan <br /> <span className="text-[#D4AF37]">Paling Berkesan?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Mulai buat undangan Anda sekarang secara gratis. <br className="hidden md:block" /> Hanya butuh 5 menit untuk hasil yang mewah.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-12 py-6 bg-[#D4AF37] text-white rounded-2xl font-black text-xl hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-1 transition-all"
            >
              Coba Gratis Sekarang
            </Link>
            <a href="https://wa.me/your-number" target="_blank" className="px-10 py-6 bg-white/10 text-white rounded-2xl font-black text-xl backdrop-blur-md hover:bg-white/20 transition-all">
              Hubungi Sales
            </a>
          </div>
          <p className="mt-8 text-xs text-gray-600 font-bold uppercase tracking-[0.3em]">Setup Instan • No Credit Card • Premium Quality</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-black text-gray-500 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 border-r border-white/5">
              <Link href="/" className="flex items-center gap-2 mb-6">
                <Heart className="w-8 h-8 text-[#D4AF37] fill-current" />
                <span className="font-serif text-2xl font-black text-white tracking-tight">Nikahin</span>
              </Link>
              <p className="text-xs leading-relaxed max-w-[200px]">Platform undangan digital #1 di Indonesia yang mengutamakan visual & kemudahan.</p>
            </div>
            <div>
              <p className="text-white font-bold text-sm mb-6 uppercase tracking-widest">Produk</p>
              <ul className="space-y-4 text-xs font-bold uppercase tracking-wider">
                <li><a href="#themes" className="hover:text-white transition-colors">Katalog Tema</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Fitur Premium</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Harga Paket</a></li>
              </ul>
            </div>
            <div>
              <p className="text-white font-bold text-sm mb-6 uppercase tracking-widest">Layanan</p>
              <ul className="space-y-4 text-xs font-bold uppercase tracking-wider">
                <li><a href="#" className="hover:text-white transition-colors">WA Blast Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Custom Domain</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Agency / Reseller</a></li>
              </ul>
            </div>
            <div>
              <p className="text-white font-bold text-sm mb-6 uppercase tracking-widest">Legal</p>
              <ul className="space-y-4 text-xs font-bold uppercase tracking-wider">
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="mailto:support@nikahin.app" className="hover:text-white transition-colors">Support Center</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] uppercase font-bold tracking-[0.2em]">© 2026 Nikahin Tech. All Rights Reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-xs hover:text-[#D4AF37] transition-colors"><Zap className="w-4 h-4" /></a>
              <a href="#" className="text-xs hover:text-[#D4AF37] transition-colors"><Heart className="w-4 h-4" /></a>
              <a href="#" className="text-xs hover:text-[#D4AF37] transition-colors"><Users className="w-4 h-4" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}