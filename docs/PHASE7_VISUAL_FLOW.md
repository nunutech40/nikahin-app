# 🎨 Phase 7 Visual Flow Diagram

## User Journey: Package-First Registration

```
┌─────────────────────────────────────────────────────────────────┐
│                      LANDING PAGE (/)                           │
│                                                                 │
│  Hero Section: "Buat Undangan Impian dalam 5 Menit"           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │           PRICING TABLE (NEW!)                          │  │
│  │                                                         │  │
│  │  ┌─────────┐    ┌─────────┐    ┌─────────┐           │  │
│  │  │ BRONZE  │    │ SILVER  │    │  GOLD   │           │  │
│  │  │ Rp 0    │    │ Rp 150k │    │ Rp 300k │           │  │
│  │  │         │    │ ⭐BEST  │    │ 👑PREMIUM│           │  │
│  │  └─────────┘    └─────────┘    └─────────┘           │  │
│  │      ↓              ↓              ↓                   │  │
│  │  [Pilih]       [Pilih]        [Pilih]                 │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│              REGISTER PAGE (/register?package=silver)           │
│                                                                 │
│  ┌──────────────────────────────────────────────────┐          │
│  │  Badge: "Paket Terpilih: 🥈 Silver - Rp 150k"   │          │
│  └──────────────────────────────────────────────────┘          │
│                                                                 │
│  [Nama Lengkap]                                                │
│  [Email]                                                       │
│  [WhatsApp]                                                    │
│  [Password]                                                    │
│                                                                 │
│  [Daftar Sekarang] → Auto-assign Silver package               │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE RECORD                              │
│                                                                 │
│  users {                                                       │
│    email: "user@example.com"                                   │
│    packageId: 2  (Silver)                                      │
│    isActive: false  ← KEY! (Unpaid)                           │
│  }                                                             │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                 DASHBOARD (First Time)                          │
│                                                                 │
│  "Selamat datang! Buat undangan pertama Anda"                 │
│                                                                 │
│  [Input Slug: "rizka-ayu"]                                     │
│  [Buat Undangan] → Create invitation with Silver package       │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                    EDITOR PAGE                                  │
│                                                                 │
│  ┌─────────────────────┐  ┌──────────────────────────┐        │
│  │   FORM SIDEBAR      │  │   LIVE PREVIEW           │        │
│  │                     │  │                          │        │
│  │ ✅ Info Mempelai    │  │   [Mobile Frame]         │        │
│  │ ✅ Acara (Unlimited)│  │   Rizka & Ayu            │        │
│  │ ✅ Galeri (10 foto) │  │   12 Feb 2026            │        │
│  │ ✅ Musik Latar      │  │   ...                    │        │
│  │ ✅ Quote & Doa      │  │                          │        │
│  │                     │  │                          │        │
│  │ ALL FEATURES OPEN!  │  │   Preview works!         │        │
│  │ (Testing Mode)      │  │                          │        │
│  └─────────────────────┘  └──────────────────────────┘        │
│                                                                 │
│  [Simpan] ✅  [Preview] ✅  [Publish] 🔒 LOCKED!              │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│              KLIK TOMBOL "PUBLISH" (Blocked!)                   │
│                                                                 │
│  ┌───────────────────────────────────────────────────────┐    │
│  │  ⚠️  Undangan Belum Bisa Dipublish                    │    │
│  │                                                       │    │
│  │  Untuk mempublish undangan, silakan lakukan          │    │
│  │  pembayaran terlebih dahulu.                          │    │
│  │                                                       │    │
│  │  Paket Anda: Silver - Rp 150.000                      │    │
│  │                                                       │    │
│  │  [Bayar Sekarang]  [Nanti Saja]                       │    │
│  └───────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                    PAYMENT PAGE                                 │
│                                                                 │
│  Paket: Silver - Rp 150.000                                    │
│                                                                 │
│  Metode Pembayaran:                                            │
│  ○ Transfer Bank (BCA, Mandiri)                                │
│  ○ E-Wallet (GoPay, OVO) - Coming Soon                         │
│                                                                 │
│  Upload Bukti Transfer:                                        │
│  [📎 Choose File]                                              │
│                                                                 │
│  [Kirim Bukti Pembayaran]                                      │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│              ADMIN PANEL - PENDING PAYMENTS                     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ User: user@example.com                                  │  │
│  │ Package: Silver (Rp 150k)                               │  │
│  │ Bukti: [View Image] 📷                                  │  │
│  │                                                         │  │
│  │ [✅ Approve & Activate]  [❌ Reject]                    │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                  ACTIVATION SUCCESS!                            │
│                                                                 │
│  Database Update:                                              │
│  users.isActive = true ✅                                      │
│                                                                 │
│  Email Notification:                                           │
│  "Pembayaran Anda telah dikonfirmasi!"                         │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                 DASHBOARD (After Payment)                       │
│                                                                 │
│  [Simpan] ✅  [Preview] ✅  [Publish] ✅ UNLOCKED!            │
│                                                                 │
│  Klik "Publish" → invitation.isPublished = true                │
│                                                                 │
│  🎉 Undangan Anda sudah live di:                               │
│  https://nikahin.app/rizka-ayu                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Feature Access Matrix

```
┌─────────────────────────────────────────────────────────────────┐
│                    TESTING MODE vs PAID MODE                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Feature Access:                                               │
│  ┌──────────────────┬──────────────┬──────────────┐           │
│  │ Feature          │ Testing Mode │ Paid Mode    │           │
│  ├──────────────────┼──────────────┼──────────────┤           │
│  │ Edit Data        │ ✅ Yes       │ ✅ Yes       │           │
│  │ Upload Gallery   │ ✅ Yes       │ ✅ Yes       │           │
│  │ Add Music        │ ✅ Yes       │ ✅ Yes       │           │
│  │ Customize Theme  │ ✅ Yes       │ ✅ Yes       │           │
│  │ Live Preview     │ ✅ Yes       │ ✅ Yes       │           │
│  │ Save Draft       │ ✅ Yes       │ ✅ Yes       │           │
│  │ PUBLISH          │ ❌ NO!       │ ✅ YES!      │           │
│  │ Public Access    │ ❌ NO!       │ ✅ YES!      │           │
│  └──────────────────┴──────────────┴──────────────┘           │
│                                                                 │
│  Gate: user.isActive                                           │
│  - false = Testing Mode (Cannot publish)                       │
│  - true  = Paid Mode (Can publish)                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Package Feature Comparison

```
┌─────────────────────────────────────────────────────────────────┐
│                   FEATURE COMPARISON TABLE                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Feature                    │ Bronze │ Silver │ Gold           │
│  ───────────────────────────┼────────┼────────┼──────          │
│  Info Mempelai & Orang Tua  │   ✅   │   ✅   │  ✅            │
│  Detail Acara               │   1    │   ∞    │  ∞             │
│  Tema Basic                 │   ✅   │   ✅   │  ✅            │
│  Tema Premium               │   ❌   │   ✅   │  ✅            │
│  RSVP System                │   ✅   │   ✅   │  ✅            │
│  RSVP Export CSV            │   ❌   │   ✅   │  ✅            │
│  Google Maps                │   ✅   │   ✅   │  ✅            │
│  Galeri Foto                │   ❌   │  10    │  30            │
│  Musik Latar                │   ❌   │   ✅   │  ✅            │
│  Quote & Doa                │   ❌   │   ✅   │  ✅            │
│  Love Story Timeline        │   ❌   │   ❌   │  ✅            │
│  Gift Registry              │   ❌   │   ❌   │  ✅            │
│  Custom Colors & Fonts      │   ❌   │   ❌   │  ✅            │
│  Remove Branding            │   ❌   │   ❌   │  ✅            │
│  ───────────────────────────┼────────┼────────┼──────          │
│  Harga                      │  Rp 0  │ 150k   │ 300k           │
│  ───────────────────────────┴────────┴────────┴──────          │
│                                                                 │
│  ⚠️ SEMUA PAKET: Testing Mode (Full Access, No Publish)       │
│  ✅ SETELAH BAYAR: Publish Unlocked                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementation Priority

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT PHASES                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🔥 CRITICAL PATH (Week 1)                                     │
│  ├─ Phase 7.1: Pricing Table                                   │
│  ├─ Phase 7.2: Package Registration                            │
│  └─ Phase 7.3: Testing Mode + Publish Block                    │
│                                                                 │
│  📦 IMPORTANT (Week 2)                                         │
│  ├─ Phase 7.4: Payment Upload                                  │
│  └─ Phase 7.4: Admin Verification                              │
│                                                                 │
│  ⭐ NICE TO HAVE (Week 3+)                                     │
│  ├─ Phase 7.5: Feature Matrix UI                               │
│  ├─ Phase 7.6: SEO Infrastructure                              │
│  └─ Midtrans Integration                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

**Created**: 2026-01-18  
**Purpose**: Visual reference for Phase 7 implementation  
**Status**: Ready for development
