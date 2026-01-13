# 💍 Nikahin - Digital Wedding Invitation Platform

> **Undangan pernikahan digital yang elegan, modern, dan mudah dikustomisasi**

Nikahin adalah platform SaaS untuk membuat undangan pernikahan digital dengan berbagai pilihan tema. Dibangun dengan teknologi modern untuk memberikan pengalaman terbaik bagi pengguna dan tamu undangan.

## ✨ Features

- 🎨 **Multiple Themes** - Berbagai pilihan tema yang dapat disesuaikan
- 📱 **Mobile-First Design** - Optimized untuk semua ukuran layar
- 🎵 **Background Music** - Musik latar yang dapat dikustomisasi
- 📸 **Photo Gallery** - Galeri foto dengan layout yang menarik
- 💌 **RSVP System** - Sistem konfirmasi kehadiran tamu
- 📝 **Guestbook** - Buku tamu digital untuk ucapan
- 🎁 **Gift Registry** - Informasi rekening untuk hadiah
- ⏱️ **Countdown Timer** - Hitung mundur menuju hari pernikahan
- 🌐 **Personalized URL** - URL unik untuk setiap undangan
- 👤 **Guest Personalization** - Sapaan personal untuk setiap tamu

## 🏗️ Architecture

Nikahin menggunakan **theme-based architecture** yang memisahkan data dari presentasi:

```
┌─────────────────────────────────────────────────────┐
│                   User Request                      │
│              /rizka-ayu?to=Budi                     │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│            Page Controller (page.tsx)               │
│  - Fetch invitation data from database              │
│  - Extract guest name from URL                      │
│  - Determine theme ID                               │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│           Theme Registry (themeRegistry.ts)         │
│  - Map theme ID to component                        │
│  - Return theme component                           │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│         Theme Component (BasicTheme.tsx)            │
│  - Receive InvitationData as props                  │
│  - Render UI based on data                          │
│  - Handle user interactions                         │
└─────────────────────────────────────────────────────┘
```

### Key Benefits

✅ **Separation of Concerns** - Data logic terpisah dari UI  
✅ **Reusability** - Satu tema dapat digunakan oleh banyak user  
✅ **Maintainability** - Mudah untuk update dan fix tema  
✅ **Scalability** - Tambah tema baru tanpa modifikasi core code  

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Database:** PostgreSQL (via Drizzle ORM) - *Coming Soon*
- **Authentication:** NextAuth.js - *Coming Soon*
- **Deployment:** Vercel - *Coming Soon*

## 📁 Project Structure

```
src/
├── app/
│   ├── [slug]/
│   │   └── page.tsx              # Invitation page controller
│   └── dashboard/                # User dashboard (Coming Soon)
├── components/
│   ├── themes/
│   │   └── BasicTheme.tsx        # Theme components
│   ├── BottomNavigation.tsx      # Shared components
│   └── MusicToggle.tsx
├── lib/
│   └── themeRegistry.ts          # Theme registration system
├── types/
│   └── invitation.ts             # TypeScript type definitions
└── data/
    └── mockData.ts               # Mock data for development
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nikahin-app
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Run the development server:
```bash
pnpm dev
# or
npm run dev
```

4. Open [http://localhost:3000/rizka-ayu?to=YourName](http://localhost:3000/rizka-ayu?to=YourName) in your browser

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database (Coming Soon)
DATABASE_URL=postgresql://user:password@localhost:5432/nikahin

# NextAuth (Coming Soon)
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

## 🎨 Creating Custom Themes

Nikahin memudahkan pembuatan tema kustom. Lihat [Theme Development Guide](./docs/THEME_DEVELOPMENT.md) untuk panduan lengkap.

### Quick Start

1. Create theme component:
```tsx
// src/components/themes/YourTheme.tsx
"use client";

import { ThemeProps } from "@/lib/themeRegistry";

export function YourTheme({ data, guestName }: ThemeProps) {
    return (
        <div className="min-h-screen">
            {/* Your theme UI */}
        </div>
    );
}
```

2. Register your theme:
```tsx
// src/lib/themeRegistry.ts
import { YourTheme } from "@/components/themes/YourTheme";

const THEME_REGISTRY = {
    yourtheme: {
        metadata: {
            id: "yourtheme",
            name: "Your Theme Name",
            description: "Beautiful wedding invitation theme",
            isFree: true,
            category: "modern",
        },
        component: YourTheme,
    },
};
```

## 📋 Development Roadmap

- [x] **Iterasi 1:** The Renderer (Public Page - Static) ✅
- [x] **Iterasi 2:** The Theme Engine (Decoupling) ✅
- [ ] **Iterasi 3:** User Dashboard (Data Entry) 🔄
- [ ] **Iterasi 4:** Database Integration (RSVP & Persistence)
- [ ] **Iterasi 5:** Auth & User Management
- [ ] **Iterasi 6:** Super Admin Panel

Lihat [todo.md](./todo.md) untuk detail lengkap roadmap.

## 🧪 Testing

```bash
# Run tests (Coming Soon)
pnpm test

# Run E2E tests (Coming Soon)
pnpm test:e2e

# Run Lighthouse audit
pnpm lighthouse
```

## 📖 Documentation

- [Theme Development Guide](./docs/THEME_DEVELOPMENT.md) - Panduan membuat tema kustom
- [PRD.md](./PRD.md) - Product Requirements Document
- [todo.md](./todo.md) - Development roadmap dan task tracking

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

Jika ada pertanyaan atau masalah:
- Buka issue di GitHub
- Lihat dokumentasi di folder `/docs`
- Check roadmap di `todo.md`

---

**Built with ❤️ by the Nikahin Team**

*Making wedding invitations beautiful and accessible for everyone*
