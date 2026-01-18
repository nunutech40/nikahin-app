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
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A1612]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/40 backdrop-blur-2xl border-b border-[#B48C5E]/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-[#B48C5E] fill-current" />
            <span className="font-serif text-2xl font-black text-[#1A1612] tracking-tighter italic">Nikahin</span>
          </Link>
          <div className="hidden md:flex items-center gap-10">
            <a href="#features" className="text-[11px] uppercase tracking-[0.2em] font-black text-[#1A1612]/60 hover:text-[#B48C5E] transition-colors">Fitur</a>
            <a href="#themes" className="text-[11px] uppercase tracking-[0.2em] font-black text-[#1A1612]/60 hover:text-[#B48C5E] transition-colors">Tema</a>
            <a href="#pricing" className="text-[11px] uppercase tracking-[0.2em] font-black text-[#1A1612]/60 hover:text-[#B48C5E] transition-colors">Harga</a>
            <Link href="/login" className="text-[11px] uppercase tracking-[0.2em] font-black text-[#1A1612]/60 hover:text-[#B48C5E] transition-colors">Login</Link>
          </div>
          <Link
            href="/demo-register"
            className="px-7 py-3 bg-[#1A1612] text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-[#B48C5E] transition-all active:scale-95 shadow-xl shadow-black/5"
          >
            Coba Demo Gratis
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Abstract Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-[#B48C5E]/5 rounded-full blur-[120px] opacity-60 animate-pulse" />
          <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-rose-200/5 rounded-full blur-[120px] opacity-60 animate-pulse delay-700" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/silk.png')] opacity-20 pointer-events-none" />
        </div>

        <FloatingHearts />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-[#B48C5E]/5 rounded-full border border-[#B48C5E]/20 text-[#B48C5E] font-black text-[10px] uppercase tracking-[0.25em]">
              <Sparkles className="w-3.5 h-3.5" /> Luxury Digital Invitation
            </div>
          </div>

          <h1 className="font-serif text-6xl md:text-9xl font-black text-[#1A1612] mb-10 leading-[0.95] tracking-tighter animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            Abadikan Momen <br />
            <span className="italic font-normal">dengan</span> <span className="text-[#B48C5E]">Kesempurnaan.</span>
          </h1>

          <p className="text-lg md:text-xl text-[#1A1612]/50 mb-14 max-w-2xl mx-auto leading-relaxed font-bold animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-400">
            Nikmati kebebasan kustomisasi penuh dengan puluhan tema premium, RSVP otomatis, dan gift digital tercanggih.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-600">
            <Link
              href="/demo-register"
              className="group w-full sm:w-auto px-12 py-6 bg-[#1A1612] text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#B48C5E] hover:shadow-[0_25px_50px_-12px_rgba(180,140,94,0.3)] hover:-translate-y-1 transition-all flex items-center justify-center gap-4"
            >
              Uji Coba Demo Gratis
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>

            <Link
              href="/rizka-ayu"
              target="_blank"
              className="w-full sm:w-auto px-12 py-6 bg-white text-[#1A1612] border-2 border-slate-100 rounded-full font-black text-xs uppercase tracking-widest hover:border-[#1A1612] hover:bg-slate-50 transition-all flex items-center justify-center gap-4"
            >
              <Play className="w-5 h-5 fill-current" />
              Lihat Demo Tema
            </Link>
          </div>

          {/* Social Proof Mini */}
          <div className="mt-20 flex flex-col items-center gap-5 opacity-40 animate-in fade-in duration-1000 delay-1000">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-[#FDFBF7] bg-slate-200 overflow-hidden shadow-xl">
                  <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="User" />
                </div>
              ))}
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1A1612]">❤️ 12.400+ Pasangan Bahagia</p>
          </div>
        </div>
      </section>

      {/* Feature highlight bar */}
      <section className="bg-white border-y border-[#B48C5E]/10">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {[
              { icon: Zap, label: "Aktif Seketika" },
              { icon: ShieldCheck, label: "Privasi Terjamin" },
              { icon: Heart, label: "Kualitas Butik" },
              { icon: Users, label: "Layanan 24 Jam" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-4 justify-center text-[#1A1612]/30 group hover:text-[#B48C5E] transition-all">
                <item.icon className="w-6 h-6 group-hover:scale-120 transition-transform" />
                <span className="font-black text-[9px] uppercase tracking-[0.3em]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 rounded-lg text-rose-500 font-black text-[10px] uppercase tracking-widest mb-8">
                <Users className="w-4 h-4" /> Solusi Lengkap
              </div>
              <h2 className="font-serif text-5xl md:text-7xl font-black text-[#1A1612] mb-10 leading-[1.1] tracking-tighter">
                Karena Setiap <br />
                <span className="text-[#B48C5E]">Detail Berarti.</span>
              </h2>
              <div className="space-y-12">
                {[
                  {
                    icon: Zap,
                    title: "RSVP Instan",
                    desc: "Sistem konfirmasi kehadiran paling akurat yang terhubung langsung ke WhatsApp Anda."
                  },
                  {
                    icon: Gift,
                    title: "Kado Digital",
                    desc: "Fitur angpao digital termudah tanpa potongan biaya sepeser pun."
                  },
                  {
                    icon: Palette,
                    title: "Customizer Tanpa Batas",
                    desc: "Ubah setiap elemen desain dengan bebas layaknya mengedit sebuah kanvas kosong."
                  }
                ].map((f, i) => (
                  <div key={i} className="flex gap-8 group">
                    <div className="w-16 h-16 bg-[#FDFBF7] rounded-3xl flex items-center justify-center flex-shrink-0 border border-transparent group-hover:border-[#B48C5E]/20 group-hover:bg-white transition-all duration-500">
                      <f.icon className="w-7 h-7 text-[#B48C5E]" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-[#1A1612] mb-3 tracking-tight">{f.title}</h4>
                      <p className="text-[#1A1612]/50 leading-relaxed text-sm font-medium">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-[#B48C5E]/5 rounded-[60px] translate-x-8 translate-y-8" />
              <div className="relative bg-white p-6 rounded-[60px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-50">
                <div className="rounded-[45px] overflow-hidden bg-slate-50 aspect-[4/5] relative">
                  <div className="absolute inset-0 flex items-center justify-center text-[#B48C5E] font-black italic text-5xl opacity-[0.03] uppercase tracking-tighter -rotate-12">
                    Contemporary Art
                  </div>
                  <img
                    src="/images/themes/rizka-ayu-preview.png"
                    alt="Feature Showcase"
                    className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
                  />
                </div>
              </div>

              {/* Float Badge */}
              <div className="absolute -bottom-10 -right-10 bg-[#1A1612] p-8 rounded-[32px] shadow-2xl animate-bounce delay-1000 hidden md:block">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-[#B48C5E] rounded-2xl flex items-center justify-center">
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-[9px] text-white/40 font-black uppercase tracking-[0.2em] mb-1">RSVP Success</p>
                    <p className="text-xl font-black text-white">+12 Tamu Konfirmasi</p>
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
      <section id="pricing" className="py-40 bg-[#FDFBF7] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <h2 className="font-serif text-5xl md:text-7xl font-black text-[#1A1612] mb-8 leading-tight tracking-tighter">
              Beri yang Terbaik untuk <br /> <span className="text-[#B48C5E]">Awal yang Baru.</span>
            </h2>
            <p className="text-lg text-[#1A1612]/40 max-w-2xl mx-auto font-bold">
              Sekali bayar untuk kenangan yang akan tetap hidup selamanya. <br /> Tanpa ada biaya tersembunyi.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-10 max-w-6xl mx-auto px-4">
            <PricingCard
              name="Essential"
              price={99000}
              originalPrice={199000}
              description="Esensial & Elegan untuk budget minimalis"
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
      <section className="py-24 bg-white border-t border-[#B48C5E]/5">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-16">
          <div className="text-center md:text-left">
            <h3 className="font-black text-xl text-[#1A1612] mb-4 tracking-tighter italic">Flexibility.</h3>
            <p className="text-[13px] text-[#1A1612]/40 leading-relaxed font-bold">Ubah tema sepuas hati tanpa harus mengisi data ulang. Satu platform untuk semua mimpi Anda.</p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="font-black text-xl text-[#1A1612] mb-4 tracking-tighter italic">Reliability.</h3>
            <p className="text-[13px] text-[#1A1612]/40 leading-relaxed font-bold">Hosting dan server kelas dunia menjamin undangan Anda dapat diakses kapan saja, selamanya.</p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="font-black text-xl text-[#1A1612] mb-4 tracking-tighter italic">Performance.</h3>
            <p className="text-[13px] text-[#1A1612]/40 leading-relaxed font-bold">Optimasi tingkat tinggi untuk loading secepat kilat di perangkat mobile maupun desktop.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 bg-[#1A1612] relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[#B48C5E]/5" />
          <FloatingHearts />
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="font-serif text-5xl md:text-8xl font-black text-white mb-10 tracking-tighter">
            Siap Menulis <br /> <span className="text-[#B48C5E] italic font-normal">Cerita Anda?</span>
          </h2>
          <p className="text-lg text-white/40 mb-16 max-w-xl mx-auto font-bold">
            Mulai uji coba demo gratis Anda hari ini. <br /> Hanya 5 menit untuk menciptakan kemewahan.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/demo-register"
              className="px-14 py-7 bg-[#B48C5E] text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#927519] hover:-translate-y-1 transition-all shadow-2xl shadow-[#B48C5E]/20"
            >
              Coba Demo Sekarang
            </Link>
            <a href="https://wa.me/your-number" target="_blank" className="px-12 py-7 bg-white/5 text-white rounded-full border border-white/10 font-black text-xs uppercase tracking-widest backdrop-blur-md hover:bg-white/10 transition-all">
              Hubungi Sales
            </a>
          </div>
          <p className="mt-12 text-[9px] text-white/20 font-black uppercase tracking-[0.5em]">Setup Instan • Tanpa Kartu Kredit • Premium Only</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 bg-[#1A1612] text-white/30 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-20 mb-20">
            <div className="col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-8">
                <Heart className="w-8 h-8 text-[#B48C5E] fill-current" />
                <span className="font-serif text-2xl font-black text-white tracking-tighter italic">Nikahin</span>
              </Link>
              <p className="text-[11px] leading-relaxed max-w-[200px] font-bold uppercase tracking-wider">Platform undangan digital butik #1 yang mengutamakan estetika & detail eksklusif.</p>
            </div>
            <div>
              <p className="text-white font-black text-[10px] mb-8 uppercase tracking-[0.3em]">Destinasi</p>
              <ul className="space-y-5 text-[10px] font-black uppercase tracking-[0.2em]">
                <li><a href="#themes" className="hover:text-[#B48C5E] transition-colors">Katalog Tema</a></li>
                <li><a href="#features" className="hover:text-[#B48C5E] transition-colors">Fiturnya</a></li>
                <li><a href="#pricing" className="hover:text-[#B48C5E] transition-colors">Harga Paket</a></li>
              </ul>
            </div>
            <div>
              <p className="text-white font-black text-[10px] mb-8 uppercase tracking-[0.3em]">Layanan</p>
              <ul className="space-y-5 text-[10px] font-black uppercase tracking-[0.2em]">
                <li><a href="#" className="hover:text-[#B48C5E] transition-colors">WhatsApp Blast</a></li>
                <li><a href="#" className="hover:text-[#B48C5E] transition-colors">Domain Khusus</a></li>
                <li><a href="#" className="hover:text-[#B48C5E] transition-colors">Kemitraan</a></li>
              </ul>
            </div>
            <div>
              <p className="text-white font-black text-[10px] mb-8 uppercase tracking-[0.3em]">Bantuan</p>
              <ul className="space-y-5 text-[10px] font-black uppercase tracking-[0.2em]">
                <li><a href="#" className="hover:text-[#B48C5E] transition-colors">Syarat & Ketentuan</a></li>
                <li><a href="#" className="hover:text-[#B48C5E] transition-colors">Kebijakan Privasi</a></li>
                <li><a href="mailto:support@nikahin.app" className="hover:text-[#B48C5E] transition-colors">Hubungi Kami</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[9px] uppercase font-black tracking-[0.4em]">© 2026 Nikahin Collective. Art of Wedding.</p>
            <div className="flex gap-10">
              <a href="#" className="hover:text-[#B48C5E] transition-all transform hover:scale-110"><Zap className="w-5 h-5" /></a>
              <a href="#" className="hover:text-[#B48C5E] transition-all transform hover:scale-110"><Heart className="w-5 h-5" /></a>
              <a href="#" className="hover:text-[#B48C5E] transition-all transform hover:scale-110"><Users className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}