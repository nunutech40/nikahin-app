# 💍 PRD: Nikahin - Digital Wedding Invitation SaaS

## 1. Project Overview & Value Proposition

Membangun platform **SaaS (Software as a Service)** untuk pembuatan undangan pernikahan digital berbasis tema yang elegan, modern, dan mudah digunakan.

*   **Core Value:** Pemisahan antara **Konten** dan **Tampilan**. Pengguna cukup mengisi data satu kali, namun bebas mengganti tema kapan saja tanpa perlu menginput ulang data.
*   **Target:** Memberikan solusi undangan digital yang profesional bagi pasangan pengantin dengan biaya terjangkau dan waktu pembuatan yang instan.

---

## 2. User Personas & Flows

### A. Super Admin (Owner Platform)
*   **Goal:** Mengelola bisnis, aktivasi akun, dan katalog tema.
*   **Flow:** Login → Dashboard Admin → Monitoring User → Validasi Pembayaran & Aktivasi Akun → Kelola Katalog Tema.

### B. User (Pasangan Pengantin)
*   **Goal:** Membuat undangan digital yang unik dan membagikannya ke tamu.
*   **Flow:** Registrasi → Akses Dashboard → Pilih Paket/Pilih Tema → Input Data Undangan (Mempelai, Acara, Galeri, dll) → Preview → Publish → Bagikan link unik (slug).

### C. Guest (Tamu Undangan)
*   **Goal:** Mendapatkan informasi detail acara dan merespons undangan.
*   **Flow:** Buka Link → Animasi Pembuka → Lihat Detail Acara & Lokasi → Isi Buku Tamu & Konfirmasi Kehadiran (RSVP).

---

### 1. Functional Requirements
1.  **Renderer Engine** (✅ Completed)
2.  **Theme Registry & Dynamic Styles** (✅ Completed)
3.  **RSVP & Data Persistence** (✅ Completed)
4.  **User Authentication & Authorization** (✅ Completed)
    -   Secure registration & login.
    -   Data isolation (User only sees their own data).
    -   Protected dashboard area.
5.  **User Dashboard** (🔄 In Progress)
    -   Split-screen editor with live preview (✅)
    -   Live Save/Update to Database (✅)
    -   RSVP Inbox & Guest Management (⏳ Planned)
6.  **Agency Portal & Seller Management** (✅ Completed)
    -   Dedicated Agency Dashboard (✅)
    -   Seller Provisioning for Super Admin (✅)
    -   Role-based Login Redirection (✅)
7.  **SaaS Gating System** (⏳ Planned)
*   Setiap tema memiliki estetika, animasi, dan tata letak yang berbeda-beda.

### 3.2. Manajemen Konten Undangan
*   **Data Mempelai:** Nama lengkap, nama panggilan, foto, dan informasi orang tua.
*   **Detail Acara:** Nama acara (Akad/Resepsi/Unduh Mantu), waktu, lokasi fisik, dan navigasi (Google Maps).
*   **Galeri Foto:** Unggah foto-foto momen spesial.
*   **Kutipan & Doa:** Menambahkan ayat suci atau kata-kata mutiara.
*   **Musik Latar:** Pilihan musik yang akan diputar saat undangan dibuka.

### 3.3. Dashboard Editor & Preview
*   Halaman editor bagi user untuk mengelola seluruh data undangan.
*   **Live Preview:** User dapat melihat perubahan tampilan secara *real-time* saat mengedit data atau mengganti pengaturan warna/font sebelum memutuskan untuk mempublish.

### 3.4. Interaksi Tamu (RSVP & Buku Tamu)
*   Form konfirmasi kehadiran bagi tamu.
*   Kolom ucapan dan doa yang akan tampil di halaman undangan.
*   **RSVP Inbox (MVP):** Halaman khusus di dashboard user untuk melihat data kehadiran tamu secara detail & mengunduh daftar tamu.
*   **Email Notifications (MVP):** Notifikasi otomatis ke email user setiap kali ada tamu yang mengisi RSVP, mendorong user untuk kembali membuka platform (Retention).
*   Statistik kehadiran tamu yang dapat dipantau oleh user di dashboard.

---

## 4. Non-Functional Requirements (Kualitas Layanan)

*   **Visual Excellence:** Tampilan undangan harus terasa premium, modern, dan eksklusif.
*   **Mobile-First:** Prioritas utama pada tampilan perangkat mobile (Smartphone), karena mayoritas tamu membuka link via WhatsApp/Media Sosial.
*   **Kecepatan Akses:** Undangan harus dimuat dengan cepat meskipun memiliki banyak foto dan animasi.
*   **SEO & Social Sharing:** Saat link dibagikan, harus muncul preview (Thumbnail, Judul, Pesan Personal) yang menarik di aplikasi chat.

---

## 5. Fitur SaaS & Roadmap Masa Depan

### 5.1. Kustomisasi Lanjutan (Appearance)
*   User diberikan kontrol untuk menyesuaikan palet warna hiasan dan jenis tipografi (font) agar sesuai dengan selera mereka, di luar desain standar dari tema yang dipilih.

### 5.2. Katalog & Marketplace Tema
*   Sistem katalog tema yang dikelompokkan berdasarkan kategori (Elegant, Modern, Floral, Vintage, dll).

### 5.3. Manajemen Bisnis & Dynamic Feature Gating (SaaS)
*   **Concept:** Setiap fitur dalam aplikasi bersifat independen dan dapat dikunci/dibuka berdasarkan paket yang dipilih.
*   **Feature Categories:**
    *   **Core Features:** Fitur wajib yang didapatkan oleh semua pengguna (misal: Data Mempelai, 1 Detail Acara Utama).
    *   **Add-on/Modular Features:** Fitur tambahan yang bisa ditugaskan ke paket tertentu oleh Admin (misal: Galeri Foto > 5, Musik kustom, RSVP, Google Maps, Font khusus).
*   **Admin Control:** Admin memiliki dashboard untuk menentukan secara manual fitur mana saja yang masuk ke Paket A, B, atau C.
*   **User Experience:** User akan melihat indikator "Locked" pada fitur yang tidak tersedia di paket mereka, dengan opsi untuk melakukan Upgrade.

### 5.4. Mode Agensi & Multi-tier Admin
Sistem manajemen berjenjang untuk mendukung skalabilitas bisnis melalui reseller atau vendor partner.
*   **Super Admin (Master):** Memiliki kontrol penuh atas seluruh platform, dapat melihat performa seluruh Agensi/Seller, mengelola tema global, dan mengatur konfigurasi sistem.
*   **Agency / Seller Role:** 
    *   Memiliki dashboard admin khusus yang terisolasi.
    *   Hanya dapat mengelola Customer yang terdaftar di bawah Agensi mereka.
    *   Dapat melihat statistik spesifik (Traffic, RSVP) untuk klien mereka sendiri.
*   **Customer Role:** Pengguna akhir yang membuat undangan, bisa berada di bawah pengelolaan Agensi tertentu atau langsung di bawah Super Admin.
*   **Self-Selling Super Admin:** Super Admin juga dapat bertindak sebagai Seller untuk mengelola portofolio penjualan langsung mereka sendiri dalam konteks yang sama dengan Agensi lain.

### 5.5. Referral & Afiliasi
*   Sistem bagi hasil bagi pengguna yang mempromosikan platform Nikahin kepada orang lain.