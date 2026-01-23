# 📊 Entity Relationship Diagram (ERD) - Nikahin App

Dokumen ini mendefinisikan struktur database untuk mendukung fitur MVP dan rencana pengembangan jangka panjang (SaaS, Agency, Affiliate, **Dynamic Feature Gating**).

---

## 1. Visual Relationship Map

```mermaid
erDiagram
    USERS ||--oN INVITATIONS : owns
    USERS ||--oN TRANSACTIONS : pays
    INVITATIONS ||--oN GUESTS : receives
    INVITATIONS ||--oN VISITOR_LOGS : tracked_by
    THEMES ||--oN INVITATIONS : applied_to
    PACKAGES ||--oN INVITATIONS : assigned_to
    PACKAGES ||--oN PACKAGE_FEATURES : defines
    FEATURES ||--oN PACKAGE_FEATURES : included_in
    PACKAGES ||--oN TRANSACTIONS : defined_by
```

---

## 2. Table Definitions

### 2.1. Tabel `users` (Core Account)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PK | Unique ID |
| `email` | VARCHAR | UNIQUE | Alamat email user |
| `password` | TEXT | | Hashed password |
| `name` | VARCHAR | | Nama Lengkap / Personalization |
| `phone` | VARCHAR | | No. WA untuk notifikasi |
| `wedding_date` | TIMESTAMP | | Tanggal pernikahan user |
| `role` | ENUM | | 'admin', 'customer', 'agency' |
| `package_id` | INTEGER | FK (packages.id) | Paket aktif user |
| `is_active` | BOOLEAN | | Status pembayaran/aktivasi |
| `referral_code` | VARCHAR | | Sistem Affiliate |
| `referred_by` | INTEGER | FK (users.id) | Melacak referral |
| `created_at` | TIMESTAMP | | |

### 2.2. Tabel `features` (Modular Modules)
Daftar kemampuan sistem yang bisa dikunci/dibuka.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PK | |
| `code` | VARCHAR | UNIQUE | E.g., 'gallery_unlimited', 'background_music', 'rsvp' |
| `name` | VARCHAR | | Label fitur |
| `is_core` | BOOLEAN | | Jika TRUE, fitur ini wajib ada di semua paket |

### 2.3. Tabel `packages` & `package_features` (Admin Control)
Sistem untuk menyusun paket secara dinamis.

| Table | Column | Description |
| :--- | :--- | :--- |
| **`packages`** | `id`, `slug`, `name`, `price`, `original_price` | `original_price` digunakan untuk display diskon |
| **`package_features`** | `package_id`, `feature_id` | **Pivot Table**: Admin menentukan fitur per paket |

### 2.4. Tabel `invitations` (The Core)
Menghubungkan konten dengan tema dan paket fitur yang aktif.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PK | |
| `user_id` | INTEGER | FK (users.id) | Owners |
| `theme_id` | INTEGER | FK (themes.id) | Selected Theme |
| `package_id` | INTEGER | FK (packages.id) | **Sistem Gating**: Menentukan fitur yang aktif |
| `slug` | VARCHAR | UNIQUE | URL unik (e.g., nikahin.id/rizka-ayu) |
| `content` | JSONB | NOT NULL | Data dinamis undangan (mempelai, acara, dll) |
| `is_published` | BOOLEAN | | Status tayang |
| `expired_at` | TIMESTAMP | | Masa aktif undangan |

### 2.5. Tabel `guests` (RSVP & Guestbook)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PK | |
| `invitation_id` | INTEGER | FK (invitations.id) | |
| `name` | VARCHAR | | Nama Tamu |
| `phone` | VARCHAR | | No. WA untuk WA Blast |
| `pax` | INTEGER | | Jumlah orang |
| `attendance` | ENUM | | 'hadir', 'tidak', 'ragu' |
| `message` | TEXT | | Ucapan doa |
| `is_invited` | BOOLEAN | | Status pengiriman WA Blast |

### 2.6. Tabel `themes` (Dynamic Engine)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PK | |
| `slug` | VARCHAR | UNIQUE | Identifier unik (e.g., 'minimal-gold') |
| `name` | VARCHAR | | Nama Display |
| `tier` | ENUM | | 'free', 'gold', 'platinum' |
| `config` | JSONB | | Struktur JSON untuk No-Code Builder (warna, font, seksi) |
| `is_active` | BOOLEAN | | Status tayang tema |

### 2.7. Tabel `transactions` (Financial)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PK | |
| `user_id` | INTEGER | FK (users.id) | |
| `package_id` | INTEGER | FK (packages.id) | |
| `amount` | INTEGER | | Nilai transaksi |
| `status` | VARCHAR | | 'pending', 'paid', 'expired' |
| `payment_proof` | TEXT | | Bukti transfer (untuk manual payment) |

### 2.8. Tabel `system_settings` (Global Configuration)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PK | |
| `key` | VARCHAR | UNIQUE | E.g., 'global_config' |
| `value` | JSONB | | Menyimpan semua pengaturan aplikasi (Mayar API, WA Token, dll) |

### 2.9. Tabel `visitor_logs` (Analytics)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PK | |
| `invitation_id` | INTEGER | FK (invitations.id) | |
| `device`, `browser`, `os` | VARCHAR | | Insight pengunjung |
| `ip_hash` | VARCHAR | | Unique visitor tracking (Privacy Focused) |

---

## 3. Relationship Logic & Rationale

1.  **Independent Feature System**: Semua fitur baru didaftarkan di tabel `features`. Admin cukup menghubungkan fitur itu ke paket tertentu di tabel `package_features`.
2.  **Core Features Logic**: Fitur dengan `is_core = TRUE` adalah fitur dasar yang selalu tersedia.
3.  **Global Settings**: Pengaturan sistem disimpan di `system_settings` dalam format JSON, memudahkan penambahan parameter baru (seperti API Key Mayar) tanpa menambah kolom database.
4.  **Security & Scalability**: Penggunaan `slug` unik dan `JSONB` untuk konten memastikan aplikasi sangat fleksibel untuk berbagai macam tema tanpa merubah struktur tabel inti.

---

**Source of Truth: Database Architecture v2.5 (Ready for Production)**
