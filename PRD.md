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

## 3. Functional Requirements

### 3.1. Sistem Tema Dinamis
*   Platform harus mendukung penggantian tema secara instan untuk satu data undangan yang sama.
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

### 5.3. Manajemen Bisnis (SaaS)
*   **Tiering Paket:** Perbedaan fitur antara paket Gratis dan Premium (misal: jumlah foto galeri, durasi aktif, musik kustom).
*   **Sistem Monitoring:** Admin dapat melihat statistik penggunaan platform secara keseluruhan.

### 5.4. Mode Agensi (White Label)
*   Fitur bagi vendor undangan fisik atau perencana pernikahan untuk mengelola banyak klien sekaligus di bawah satu akun agensi.

### 5.5. Referral & Afiliasi
*   Sistem bagi hasil bagi pengguna yang mempromosikan platform Nikahin kepada orang lain.