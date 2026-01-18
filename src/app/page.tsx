import Link from "next/link";
import { ArrowRight, Heart, Music, MapPin, Users, Gift, Palette, Sparkles, Star, Check, Play } from "lucide-react";
import { PricingCard } from "@/components/PricingCard";
import { FloatingHearts } from "@/components/FloatingHearts";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFBF5] via-white to-[#FFF5F0]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>

        {/* Floating Hearts Animation */}
        <FloatingHearts />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
          {/* Logo/Brand */}
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-[#D4AF37]/20">
              <Heart className="w-6 h-6 text-[#D4AF37] fill-current" />
              <span className="font-serif text-2xl font-black text-[#D4AF37] tracking-tight">Nikahin</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Undangan Pernikahan Digital
            <br />
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#D4AF37] bg-clip-text text-transparent">
              Yang Memukau Hati
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Buat momen spesialmu jadi tak terlupakan dengan undangan digital yang elegan, interaktif, dan penuh cinta
          </p>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-2 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-[#FFD700] fill-current" />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-700">4.9/5 dari 1000+ pasangan bahagia</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
            <Link
              href="/demo-register"
              className="group w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-[#D4AF37] to-[#b28f1f] text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all shadow-xl shadow-[#D4AF37]/30 flex items-center justify-center gap-3"
            >
              <Sparkles className="w-6 h-6" />
              Coba Gratis Sekarang
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>

            <Link
              href="#preview"
              className="w-full sm:w-auto px-10 py-5 bg-white text-gray-700 border-2 border-gray-200 rounded-2xl font-bold text-lg hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all flex items-center justify-center gap-3"
            >
              <Play className="w-6 h-6" />
              Lihat Contoh
            </Link>
          </div>

          {/* Trust Badge */}
          <p className="mt-8 text-sm text-gray-500 animate-in fade-in duration-700 delay-500">
            ✨ Gratis mencoba • Tidak perlu kartu kredit • Setup dalam 5 menit
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Fitur yang Bikin Tamu <span className="text-[#D4AF37]">Terpukau</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Semua yang kamu butuhkan untuk undangan pernikahan yang sempurna
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Galeri Foto Romantis",
                description: "Tampilkan kenangan indah kalian dalam galeri yang memukau",
                color: "from-pink-500 to-rose-500"
              },
              {
                icon: Music,
                title: "Musik Latar Menyentuh",
                description: "Sambut tamu dengan lagu favorit yang penuh makna",
                color: "from-purple-500 to-indigo-500"
              },
              {
                icon: MapPin,
                title: "Petunjuk Lokasi Akurat",
                description: "Tamu tidak akan tersesat dengan Google Maps terintegrasi",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Users,
                title: "RSVP Otomatis",
                description: "Kelola kehadiran tamu dengan mudah dan real-time",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Gift,
                title: "Amplop Digital",
                description: "Terima kado dengan mudah melalui transfer bank",
                color: "from-yellow-500 to-orange-500"
              },
              {
                icon: Palette,
                title: "Kustomisasi Penuh",
                description: "Atur warna dan font sesuai tema pernikahan kalian",
                color: "from-red-500 to-pink-500"
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-8 bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-100 hover:border-[#D4AF37] hover:shadow-2xl transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gradient-to-b from-white to-[#FFFBF5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Pilih Paket yang Sesuai dengan <span className="text-[#D4AF37]">Impian Kalian</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Semua paket sudah termasuk hosting selamanya dan support 24/7
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard
              name="Silver"
              price={150000}
              description="Perfect untuk pernikahan intimate"
              features={[
                "10 Foto galeri",
                "Musik latar",
                "RSVP unlimited",
                "Google Maps",
                "Countdown timer",
                "Quotes & doa"
              ]}
              packageSlug="silver"
              popular={false}
            />

            <PricingCard
              name="Gold"
              price={300000}
              description="Untuk pernikahan yang berkesan"
              features={[
                "Semua fitur Silver",
                "20 Foto galeri",
                "Love story timeline",
                "Gift registry",
                "Multi acara",
                "Priority support"
              ]}
              packageSlug="gold"
              popular={true}
            />

            <PricingCard
              name="Platinum"
              price={500000}
              description="Untuk pernikahan yang sempurna"
              features={[
                "Semua fitur Gold",
                "Unlimited foto",
                "Custom colors & fonts",
                "Remove branding",
                "VIP support",
                "Custom domain"
              ]}
              packageSlug="platinum"
              popular={false}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Cerita dari <span className="text-[#D4AF37]">Pasangan Bahagia</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah & Budi",
                text: "Tamu-tamu kami terpukau dengan undangannya! Sangat mudah digunakan dan hasilnya luar biasa cantik.",
                rating: 5
              },
              {
                name: "Dina & Andi",
                text: "Worth it banget! Fitur RSVP-nya membantu kami mengatur kehadiran tamu dengan sangat mudah.",
                rating: 5
              },
              {
                name: "Putri & Rizki",
                text: "Undangan digital terbaik yang pernah kami pakai. Customer service-nya juga sangat responsif!",
                rating: 5
              }
            ].map((testimonial, i) => (
              <div key={i} className="p-8 bg-gradient-to-br from-[#FFFBF5] to-white rounded-3xl border border-gray-100 shadow-lg">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-[#FFD700] fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">&quot;{testimonial.text}&quot;</p>
                <p className="font-bold text-gray-900">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-r from-[#D4AF37] to-[#b28f1f] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-black mb-6">
            Siap Membuat Undangan Impian?
          </h2>
          <p className="text-xl mb-10 opacity-90">
            Mulai gratis sekarang, tidak perlu kartu kredit
          </p>
          <Link
            href="/demo-register"
            className="inline-flex items-center gap-3 px-12 py-6 bg-white text-[#D4AF37] rounded-2xl font-black text-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            <Sparkles className="w-7 h-7" />
            Coba Gratis Sekarang
            <ArrowRight className="w-7 h-7" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-[#D4AF37] fill-current" />
            <span className="font-serif text-xl font-bold text-white">Nikahin</span>
          </div>
          <p className="text-sm">© 2024 Nikahin. Dibuat dengan ❤️ untuk pasangan bahagia di Indonesia</p>
        </div>
      </footer>
    </div>
  );
}