# 📊 Entity Relationship Diagram (ERD) - Nikahin App

Dokumen ini mendefinisikan struktur database untuk mendukung fitur MVP dan rencana pengembangan jangka panjang (SaaS, Agency, Affiliate, **Dynamic Feature Gating**).

---

## 1. Visual Relationship Map

```mermaid
erDiagram
    USERS ||--oN INVITATIONS : owns
    USERS ||--oN TRANSACTIONS : pays
    INVITATIONS ||--oN GUESTS : receives
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
| `role` | ENUM | | 'admin', 'customer', 'agency' |
| `referral_code` | VARCHAR | | Sistem Affiliate |
| `referred_by` | INTEGER | FK (users.id) | Melacak referral |

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
| **`packages`** | `id`, `slug`, `name`, `price` | E.g., Bronze, Gold, Platinum |
| **`package_features`** | `package_id`, `feature_id` | **Pivot Table**: Admin menentukan fitur per paket |

### 2.4. Tabel `invitations` (The Core)
Menghubungkan konten dengan tema dan paket fitur yang aktif.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PK | |
| `user_id` | INTEGER | FK (users.id) | |
| `theme_id` | INTEGER | FK (themes.id) | |
| `package_id` | INTEGER | FK (packages.id) | **Sistem Gating**: Menentukan fitur apa yang bisa diakses |
| `slug` | VARCHAR | UNIQUE | URL unik |
| `content` | JSONB | NOT NULL | Data dinamis undangan |
| `is_published` | BOOLEAN | | |
| `expired_at` | TIMESTAMP | | Masa aktif undangan |

### 2.5. Tabel `guests` (Interactions)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PK | |
| `invitation_id` | INTEGER | FK (invitations.id) | |
| `name` | VARCHAR | | |
| `attendance` | VARCHAR | | 'hadir', 'tidak', 'ragu' |
| `message` | TEXT | | |

---

## 3. Relationship Logic & Rationale

1.  **Independent Feature System**: Semua fitur baru (misal: Live Streaming Link) didaftarkan di tabel `features`. Admin cukup menghubungkan fitur itu ke Paket Gold di tabel `package_features`, dan otomatis semua pemilik Paket Gold bisa mengaksesnya.
2.  **Core Features Logic**: Fitur dengan `is_core = TRUE` akan dilewati saat pengecekan izin fitur (selalu tersedia), sehingga User tidak akan pernah kehilangan fungsionalitas dasar.
3.  **Admin Manual Selection**: Admin bisa menciptakan paket baru sewaktu-waktu dan memilih kombinasi fitur apa pun tanpa mengubah kode program.
4.  **Upselling Flow**: Di Dashboard Editor, aplikasi akan membandingkan `package_id` pada undangan dengan daftar fitur di `package_features`. Jika kode fitur yang diminta tidak ada, tampilkan UI "Premium Upgrade".

---

**Source of Truth: Database Architecture v2.0 (Dynamic Feature Gating)**
