## Agentic AI Execution Plan: The "Visual First" Path

### Iterasi 1: The Renderer (Public Page - Static)

**Goal:** Validasi visual. AI harus bikin halaman undangan yang *pixel-perfect* di mobile.

- **Instruksi AI:** "Bikin satu route `app/[slug]/page.tsx`. Jangan sentuh database. Gunakan konstanta `MOCK_DATA` di dalam file. Fokus pada UI/UX undangan pernikahan yang elegan menggunakan Tailwind CSS. Gunakan Google Fonts (Playfair Display & Montserrat). Harus Mobile-First (Max-width 480px untuk container utama di layar desktop)."
- **Output:** Halaman undangan cantik yang bisa lo tunjukin ke calon klien.

### Iterasi 2: The Theme Engine (Decoupling)

**Goal:** Memastikan struktur kode siap untuk multi-tema.

- **Instruksi AI:** "Refactor `app/[slug]/page.tsx`. Pindahkan UI ke `@/components/themes/BasicTheme.tsx`. Buat agar `page.tsx` hanya bertugas mengirim data ke komponen tema. Siapkan folder themes untuk tema-tema berikutnya."
- **Output:** Arsitektur yang bersih. Ganti tema tinggal ganti import komponen.

### Iterasi 3: User Dashboard (The Data Entry)

**Goal:** User bisa input data sendiri (Tanpa DB dulu, pakai State).

- **Instruksi AI:** "Bikin route `app/dashboard/edit/page.tsx`. Buat form input (Nama Pengantin, Tanggal, Alamat). Implementasi 'Live Preview' di mana input dari form langsung mengubah tampilan undangan di sisi sebelah (split screen)."
- **Output:** Pengalaman "What You See Is What You Get" (WYSIWYG) untuk user.

### Iterasi 4: Database Integration (RSVP & Persistence)

**Goal:** Menghubungkan form ke PostgreSQL server lo via Drizzle.

- **Instruksi AI:** "Sekarang koneksikan Dashboard dan Page Renderer ke PostgreSQL menggunakan Drizzle ORM melalui SSH Tunnel (port 5433). Simpan input dashboard ke tabel `invitations` (kolom JSONB). Buat form RSVP di halaman undangan yang menyimpan data ke tabel `guests`."
- **Output:** Aplikasi fungsional yang datanya tersimpan permanen.

### Iterasi 5: Auth & User Management

**Goal:** Keamanan dan sistem akun.

- **Instruksi AI:** "Implementasi NextAuth.js. Batasi akses Dashboard hanya untuk user yang login. User hanya bisa mengedit undangan milik mereka sendiri (`user_id` match)."

### Iterasi 6: Super Admin

**Goal:** Kontrol penuh di tangan lo.

- **Instruksi AI:** "Bikin folder `app/admin/`. Buat dashboard untuk melihat list semua user dan tombol toggle `is_active` untuk aktivasi manual setelah mereka bayar."

---

## System Prompt untuk AI Agent (Khusus Iterasi 1)

Kalau lo mau mulai **Step 1** sekarang, kasih prompt ini ke AI lo:

> "Act as a Senior Frontend Engineer. Your task is to execute Step 1: The Renderer.
> 
> 1. Create a Next.js 14 route at `app/[slug]/page.tsx`.
> 2. Use a hardcoded `MOCK_DATA` object containing: groom & bride names, wedding date, location address, Google Maps link, and an array of 3 image URLs for the gallery.
> 3. Build a stunning, elegant wedding invitation UI.
> 4. **Strict Requirement:** Use Tailwind CSS. It MUST be mobile-first (optimized for 360px-430px width). On desktop, center the content in a mobile-frame.
> 5. Typography is key: use 'Playfair Display' for headings and 'Montserrat' for body text.
> 6. Sections needed: Hero (Cover), Groom & Bride Profile, Event Details (Date/Time/Location), Photo Gallery, and a placeholder for RSVP form.
> 7. Do not use any database or authentication yet. Pure UI/UX focus."