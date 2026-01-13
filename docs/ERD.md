# 📊 Entity Relationship Diagram (ERD) - Nikahin App

Dokumen ini mendefinisikan struktur database untuk mendukung fitur MVP dan rencana pengembangan jangka panjang (SaaS, Agency, Affiliate).

---

## 1. Visual Relationship Map

```mermaid
erDiagram
    USERS ||--|| PROFILES : has
    USERS ||--oN INVITATIONS : owns
    USERS ||--oN TRANSACTIONS : pays
    USERS ||--oN SUBSCRIPTIONS : subscribe
    THEMES ||--oN INVITATIONS : applied_to
    INVITATIONS ||--oN GUESTS : receives
    PACKAGES ||--oN TRANSACTIONS : defined_by
    PACKAGES ||--oN SUBSCRIPTIONS : grants
```

---

## 2. Table Definitions

### 2.1. Tabel `users` (Core Account)
Menyimpan data autentikasi dan peran dalam sistem.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PK | Unique ID |
| `email` | VARCHAR | UNIQUE, NOT NULL | Alamat email user |
| `password` | TEXT | NOT NULL | Hashed password |
| `role` | ENUM | DEFAULT 'customer' | 'admin', 'customer', 'agency' |
| `referral_code` | VARCHAR | UNIQUE | Kode unik untuk sistem Affiliate |
| `referred_by` | INTEGER | FK (users.id) | ID pengajak (Affiliate) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Waktu pendaftaran |

### 2.2. Tabel `invitations` (The Meat)
Menghubungkan data konten dengan tema terpilih.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PK | Unique ID |
| `user_id` | INTEGER | FK (users.id) | Pemilik undangan |
| `theme_id` | INTEGER | FK (themes.id) | Tema yang aktif |
| `slug` | VARCHAR | UNIQUE, INDEX | URL unik (e.g. 'rizka-budi') |
| `content` | JSONB | NOT NULL | **Konten dinamis** (Groom, Bride, Events, Gallery) |
| `is_published` | BOOLEAN | DEFAULT FALSE | Status publikasi |
| `music_url` | TEXT | | Link background music |
| `expired_at` | TIMESTAMP | | Batas aktif undangan (SaaS tiering) |

> **Note on JSONB `content`**: Dipilih agar fleksibel. Jika di masa depan Tema X butuh field baru (misal: Live Streaming link), kita tidak perlu migrasi tabel, cukup update field di dalam JSONB.

### 2.3. Tabel `themes` (Theme Catalog)
Daftar tema yang tersedia di sistem/marketplace.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PK | Unique ID |
| `slug` | VARCHAR | UNIQUE | Nama unik tema (e.g. 'basic-modern') |
| `name` | VARCHAR | NOT NULL | Nama label tema |
| `category` | VARCHAR | | E.g. 'floral', 'elegant' |
| `is_free` | BOOLEAN | DEFAULT TRUE | Gratis atau Premium |
| `preview_url` | TEXT | | URL screenshot tema |

### 2.4. Tabel `guests` (Interactions)
Menyimpan data RSVP dan ucapan dari tamu.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PK | Unique ID |
| `invitation_id` | INTEGER | FK (invitations.id) | Link ke undangan terkait |
| `name` | VARCHAR | NOT NULL | Nama tamu |
| `attendance` | VARCHAR | | 'hadir', 'tidak', 'ragu' |
| `guest_count` | INTEGER | DEFAULT 1 | Jumlah orang yang dibawa |
| `message` | TEXT | | Ucapan/Buku tamu |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Waktu kirim |

### 2.5. Tabel `transactions` & `subscriptions` (Monetization)
Mendukung alur SaaS (Pembayaran & Aktivasi fitur).

| Table | Column | Description |
| :--- | :--- | :--- |
| **`packages`** | `name`, `price`, `limit_details` | Definisi paket harga (Bronze, Gold, Platinum) |
| **`transactions`** | `user_id`, `amount`, `status`, `snap_token` | Log pembayaran (Pending, Paid, Failed) |
| **`subscriptions`** | `user_id`, `package_id`, `active_until` | Record masa aktif fitur premium user |

---

## 3. Relationship Logic & Rationale

1.  **Users to Invitations (1:N)**: Seorang `User` bisa memiliki banyak undangan (misal: acara yang berbeda atau model bisnis Agency).
2.  **Invitations to Guests (1:N)**: Satu undangan memiliki banyak data RSVP.
3.  **Themes to Invitations (1:N)**: Satu desain tema bisa digunakan oleh ribuan undangan yang berbeda.
4.  **Affiliate (Self-Reference)**: Tabel `users` memiliki `referred_by` yang merujuk ke `users.id` lain untuk melacak siapa yang mengajak siapa.
5.  **Agency Mode**: `User` dengan role `agency` dapat mengelola banyak `invitations` milik klien mereka. Logika ini cukup dicover dengan relasi User -> Invitation (1:N).

---

**Source of Truth: Database Architecture v1.0**
