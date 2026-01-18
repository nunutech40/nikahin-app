# 💍 PRD: Nikahin - Wedding SaaS Platform
> **Status:** Commercial Launch Preparation  
> **Version:** 2.0 (Commercial Focus)  
> **Last Updated:** Jan 2026

## 1. Vision & Objective

### 1.1. Definisi Produk
**Nikahin** adalah platform SaaS (Software as a Service) yang memungkinkan calon pengantin membuat undangan pernikahan digital premium secara mandiri (self-service).
*   **USP (Unique Selling Point):** Pemisahan total antara *Data* dan *Visual*. User input data sekali, bisa ganti tema berkali-kali tanpa re-entry.
*   **Target Market:** Pasangan muda (Gen-Z/Millennial) yang menginginkan undangan *aesthetic*, cepat (instan), dan harga terjangkau.

### 1.2. Strategi Bisnis (Immediate Goal)
Fokus saat ini adalah **Go-to-Market** secepatnya untuk memvalidasi *revenue stream*.
*   **Goal:** Publish ke production, index di Google (SEO), dan mendapatkan transaksi pertama.
*   **Monetisasi:** Penjualan langsung paket undangan (One-time purchase atau Subscription aktif 3/6/12 bulan).

---

## 2. Current Status: MVP Features (✅ Ready)

Fitur-fitur berikut **SUDAH SELESAI** dikembangkan dan siap digunakan:

| Kategori | Fitur Ready |
| :--- | :--- |
| **Renderer Engine** | Dynamic Theme Loading, Mobile-First View, Premium Animations (Framer Motion). |
| **Data Management** | Input Mempelai, Acara, Love Story, Galeri, Quote, Music. |
| **Interactive** | Live Preview Editor (Split Screen), RSVP System, RSVP Inbox (Export CSV). |
| **Gating System** | Dynamic Feature Matrix (Admin can toggle features per package), `lib/featureGating` helper for backend/frontend restriction. |
| **Admin Ops** | User Management (Paket View), Feature Matrix Configuration UI, Activation User. |
| **Sharing** | Dynamic OG Tags (SEO Friendly Links for WhatsApp). |

---

## 3. Phase 7: Commercial Launch Strategy (🚀 The Next Focus)

Ini adalah prioritas pengembangan berikutnya untuk mengejar target "Jualan & Rank 1 Google".

### 3.1. Landing Page & Sales Funnel
Halaman depan publik (`/`) yang berfungsi sebagai *Sales Page*.
1.  **Hero Section:** Headline memikat ("Buat Undangan Pernikahan Impian dalam 5 Menit").
2.  **Theme Showcase:** Carousel/Grid yang menampilkan *screenshot* tema premium.
3.  **Features Grid:** Penjelasan keunggulan (Musik, Galeri, RSVP WA).
4.  **Pricing Table:** Perbandingan 3 Paket (Bronze, Silver, Gold).
5.  **CTA (Call to Action):** Tombol "Buat Undangan Sekarang" yang mengarah ke Register/Login.

### 3.2. SEO & Organic Traffic Strategy
Target: Masuk pencarian Google untuk keyword "undangan digital", "undangan nikah online".
1.  **Sitemap & Robots.txt:** Generate otomatis agar Google bisa crawl semua halaman tema.
2.  **Structured Data (LD+JSON):** Schema `Product` dan `Event` agar muncul rich snippet di Google.
3.  **Performance (Core Web Vitals):** Halaman harus load < 2 detik (sudah tercover oleh Next.js + Optimasi gambar).
4.  **Dynamic Slug Indexing:** Halaman contoh tema (`/demo/tema-a`, `/demo/tema-b`) harus bisa diakses publik untuk SEO.

### 3.3. Payment & Order Integration
Berahlih dari verifikasi manual Admin ke Otomatisasi.
1.  **Payment Gateway:** Integrasi **Midtrans Snap** (QRIS, VA, E-Wallet).
2.  **Order Flow:** 
    *   User pilih Paket di Dashboard -> Checkout -> Muncul Popup Payment -> Bayar -> Webhook Midtrans -> Auto Active.

### 3.4. Super Admin: Feature Matrix Configuration
Admin membutuhkan kontrol penuh untuk menentukan "Mana Fitur Gratis, Mana Fitur Berbayar" tanpa koding ulang.
*   **UI Matrix:** Tabel di Admin Panel berisi baris (Fitur) dan kolom (Paket).
*   **Flow:** Admin mencentang checkbox.
    *   *Global/Core Features:* Dicentang di semua paket (Wajib ada).
    *   *Premium Features:* Hanya dicentang di Paket Silver/Gold.

---

## 4. Packaging Structure

Platform akan diluncurkan dengan **3 Tier Paket** sederhana:

### 🥉 Paket Bronze (Basic/Free Trial)
*   **Target:** User yang ingin mencoba sistem / Budget minim.
*   **Fitur:**
    *   Info Mempelai & Orang Tua
    *   1 Detail Acara (Akad saja)
    *   Tema Basic (Terbatas 1-2 opsi)
    *   RSVP Basic (Tanpa Export)
    *   Masa Aktif: 3 Hari / Watermarked (TBD)

### 🥈 Paket Silver (Best Value)
*   **Target:** Mayoritas pengguna.
*   **Fitur:**
    *   *Semua fitur Bronze*
    *   **Unlimited Acara** (Akad + Resepsi)
    *   **Petunjuk Peta** (Google Maps & Link)
    *   **Galeri Foto** (Max 10 Foto)
    *   **Musik Latar** (Pilihan Library)
    *   **Quote & Doa**
    *   **Love Story Timeline**
    *   Tema Premium (Akses semua tema standar)

### 🥇 Paket Gold (Exclusive)
*   **Target:** Pengguna yang ingin undangan sangat personal.
*   **Fitur:**
    *   *Semua fitur Silver*
    *   **Gift Registry** (Amplop Digital)
    *   **Custom Colors & Fonts** (Theme Config)
    *   **Gallery Unlimited** (Max 20/30)
    *   **Remove "Powered By" Branding**

### 💎 Paket Platinum (Ultra Premium)
*   **Target:** Pengguna yang menginginkan segalanya.
*   **Fitur:**
    *   *Semua fitur Gold*
    *   **Custom Domain** (andi-siti.com)
    *   **WhatsApp Blast / RSVP Manager**
    *   **Video Background**
    *   **Live Streaming Integration**
    *   **Prioritas Support**

---

### 🧪 Testing Mode Strategy (MVP Conversion Booster)

Untuk meningkatkan konversi dan mengurangi friction, platform menggunakan strategi **"Try Before You Buy"**:

#### Konsep:
*   **User bisa pilih paket** (Bronze/Silver/Gold) **saat registrasi**.
*   Setelah register, user **langsung dapat akses PENUH** ke semua fitur sesuai paket yang dipilih.
*   User bisa **edit, preview, test** semua fungsi tanpa batasan.
*   **TIDAK BISA PUBLISH** sampai melakukan pembayaran (`isActive = false`).

#### Benefit:
*   ✅ User bisa **merasakan value** sebelum bayar (mengurangi keraguan).
*   ✅ Mengurangi **buyer's remorse** (sudah tahu persis apa yang didapat).
*   ✅ Meningkatkan **conversion rate** (user sudah invest waktu untuk setup).
*   ✅ Admin bisa **verifikasi payment** manual sebelum aktivasi.

#### Implementation:
*   Field `users.isActive` sebagai gate untuk publish.
*   Feature gating **TIDAK BERLAKU** di editor (semua fitur terbuka).
*   Publish button check: `if (!user.isActive) { showPaymentModal() }`

---

## 5. User Flows (Revised)

### 5.1. Customer Flow (Package-First Registration)
1.  **Visit Landing Page** -> Lihat **Pricing Table** (Bronze, Silver, Gold).
2.  **Pilih Paket** -> Klik "Pilih Paket [Silver]" -> Redirect ke `/register?package=silver`.
3.  **Register/Login** -> Form register sudah tahu package yang dipilih, tampilkan badge "Paket Terpilih: Silver".
4.  **Dashboard Onboarding**:
    *   User diminta input "Slug" dan nama pasangan.
    *   Sistem membuat Undangan Draft dengan package yang dipilih saat register.
5.  **Testing Mode (Unpaid User)**:
    *   User bisa **akses SEMUA fitur** sesuai package yang dipilih (termasuk premium features).
    *   User bisa **edit, preview, dan test** semua fungsi.
    *   **TIDAK BISA PUBLISH** -> Tombol "Publish" disabled dengan pesan "Bayar dulu untuk publish".
6.  **Payment & Activation**:
    *   Klik tombol "Bayar Sekarang" -> Pilih metode pembayaran -> Upload bukti/Midtrans.
    *   Setelah Admin approve (atau webhook Midtrans) -> `isActive = true`.
    *   Tombol "Publish" terbuka -> User bisa publish undangan.
7.  **Upgrade Flow (Optional)**: User dengan Bronze bisa upgrade ke Silver/Gold kapan saja.

### 5.2. Super Admin Flow (Configuration)
1.  **Manage Features**: Admin melihat list fitur (`code`: `gallery`, `music`, etc).
2.  **Manage Packages**: Admin membuat paket baru atau mengedit harga paket.
3.  **Feature Assignment**: Admin mengatur pemetaan fitur ke paket via checkbox.
4.  **Transaction Monitor**: Admin melihat pemasukan real-time dari Payment Gateway.

---

## 6. Future Roadmap (Post-Launch)

Fitur ini disimpan untuk pengembangan fase berikutnya (v2.1+):
*   **Agency System Advanced:** White-label domain untuk reseller.
*   **Marketplace Tema:** Desainer luar bisa upload tema dan bagi hasil.
*   **Guest Blast:** Kirim link undangan ke banyak nomor WA sekaligus (WhatsApp API).
*   **Check-in System:** Scan QR Code tamu saat hari-H.