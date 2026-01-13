# 🎨 Theme Development Guide

Welcome to the Nikahin Theme Development Guide! This document will help you create custom wedding invitation themes for the Nikahin platform.

## 📚 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Getting Started](#getting-started)
4. [Creating a New Theme](#creating-a-new-theme)
5. [Theme Interface](#theme-interface)
6. [Best Practices](#best-practices)
7. [Testing Your Theme](#testing-your-theme)
8. [Publishing Your Theme](#publishing-your-theme)

---

## 🎯 Overview

Nikahin uses a **theme-based architecture** where:
- **Data** is separated from **presentation**
- Themes are **React components** that receive data via props
- Themes are **dynamically loaded** based on user selection
- Multiple themes can coexist without conflicts

### Key Benefits

✅ **Separation of Concerns** - Data logic separate from UI  
✅ **Reusability** - One theme can be used by many users  
✅ **Maintainability** - Easy to update and fix themes  
✅ **Scalability** - Add new themes without modifying core code  

---

## 🏗️ Architecture

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

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Next.js 14+ knowledge
- TypeScript basics
- Tailwind CSS familiarity
- Framer Motion (optional, for animations)

### Project Structure

```
src/
├── components/
│   └── themes/
│       ├── BasicTheme.tsx          # Example theme
│       └── YourTheme.tsx           # Your new theme
├── lib/
│   └── themeRegistry.ts            # Theme registration
├── types/
│   └── invitation.ts               # Type definitions
└── data/
    └── mockData.ts                 # Sample data for testing
```

---

## 🎨 Creating a New Theme

### Step 1: Create Theme Component

Create a new file in `/src/components/themes/YourTheme.tsx`:

```typescript
"use client";

import { ThemeProps } from "@/lib/themeRegistry";

export function YourTheme({ data, guestName }: ThemeProps) {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold">
                        {data.groom.name} & {data.bride.name}
                    </h1>
                    {guestName && (
                        <p className="mt-4 text-lg">
                            Kepada Yth. {guestName}
                        </p>
                    )}
                </div>
            </section>

            {/* Add more sections here */}
        </div>
    );
}
```

### Step 2: Register Your Theme

Add your theme to `/src/lib/themeRegistry.ts`:

```typescript
import { YourTheme } from "@/components/themes/YourTheme";

const THEME_REGISTRY: Record<string, ThemeRegistration> = {
    // ... existing themes
    
    yourtheme: {
        metadata: {
            id: "yourtheme",
            name: "Your Theme Name",
            description: "Beautiful and elegant wedding invitation theme",
            isFree: true, // or false for premium
            category: "modern",
            previewImage: "/images/themes/yourtheme-preview.png",
        },
        component: YourTheme,
    },
};
```

### Step 3: Test Your Theme

Update mock data to use your theme:

```typescript
// In getInvitationThemeId() function
return "yourtheme"; // Instead of "basic"
```

Run the dev server:

```bash
npm run dev
```

Visit: `http://localhost:3000/rizka-ayu?to=TestUser`

---

## 📋 Theme Interface

### ThemeProps

All themes receive these props:

```typescript
interface ThemeProps {
    data: InvitationData;  // Complete invitation data
    guestName?: string;     // Guest name from URL (?to=Name)
}
```

### InvitationData Structure

```typescript
interface InvitationData {
    slug: string;                    // URL slug
    weddingDate: string;             // ISO format for countdown
    groom: Person;                   // Groom info
    bride: Person;                   // Bride info
    events: Event[];                 // Wedding events
    loveStory: LoveStoryItem[];      // Timeline
    gallery: string[];               // Image paths
    quotes: Quotes;                  // Religious quote
    musicUrl: string;                // Background music
    giftOptions: GiftOption[];       // Bank accounts
    shippingAddress: ShippingInfo;   // Physical gift address
}
```

See `/src/types/invitation.ts` for complete type definitions.

---

## ✨ Best Practices

### 1. **Mobile-First Design**

Always design for mobile first (360px - 430px), then scale up:

```css
/* Mobile first */
.container {
    padding: 1rem;
}

/* Desktop */
@media (min-width: 768px) {
    .container {
        padding: 2rem;
    }
}
```

### 2. **Use Tailwind CSS**

Leverage Tailwind for consistent styling:

```tsx
<div className="bg-gradient-to-b from-blue-50 to-white">
    <h1 className="text-3xl md:text-5xl font-serif text-gold-600">
        {data.groom.name} & {data.bride.name}
    </h1>
</div>
```

### 3. **Optimize Images**

Use Next.js Image component:

```tsx
import Image from "next/image";

<Image
    src={data.groom.photo}
    alt={data.groom.name}
    width={400}
    height={400}
    className="rounded-full"
/>
```

### 4. **Add Smooth Animations**

Use Framer Motion for animations:

```tsx
import { motion } from "framer-motion";

<motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
>
    {/* Content */}
</motion.div>
```

### 5. **Accessibility**

- Use semantic HTML
- Add proper ARIA labels
- Ensure sufficient color contrast
- Support keyboard navigation

```tsx
<button
    aria-label="Open invitation"
    className="px-6 py-3 bg-gold-500 text-white rounded-lg"
>
    Buka Undangan
</button>
```

### 6. **Performance**

- Lazy load images
- Use CSS animations for simple effects
- Minimize JavaScript bundle size
- Optimize fonts

---

## 🧪 Testing Your Theme

### 1. **Visual Testing**

Test on multiple devices:
- Mobile (360px, 375px, 414px)
- Tablet (768px, 1024px)
- Desktop (1280px, 1920px)

### 2. **Data Validation**

Test with different data scenarios:
- Long names
- Multiple events
- Many gallery images
- Missing optional fields

### 3. **Browser Testing**

Test on:
- Chrome (Desktop & Mobile)
- Safari (iOS)
- Firefox
- Edge

### 4. **Performance Testing**

Use Lighthouse to check:
- Performance score > 90
- Accessibility score > 95
- Best Practices score > 90
- SEO score > 90

---

## 📦 Publishing Your Theme

### 1. **Create Preview Image**

Capture a screenshot of your theme and save it to:
```
/public/images/themes/yourtheme-preview.png
```

Recommended size: 1200x800px

### 2. **Update Metadata**

Ensure your theme metadata is complete:

```typescript
{
    id: "yourtheme",
    name: "Elegant Gold",
    description: "Undangan pernikahan dengan nuansa emas yang mewah",
    isFree: false,
    category: "elegant",
    previewImage: "/images/themes/yourtheme-preview.png",
}
```

### 3. **Documentation**

Document any special features or requirements:

```typescript
/**
 * Elegant Gold Theme
 * 
 * Features:
 * - Parallax scrolling effects
 * - Custom countdown timer
 * - Interactive RSVP form
 * 
 * Requirements:
 * - Minimum 3 gallery images
 * - Background music recommended
 */
```

### 4. **Submit for Review**

Create a pull request with:
- Theme component file
- Registry entry
- Preview image
- Documentation updates

---

## 🎨 Theme Examples

### Minimal Theme

Simple, clean design with essential sections only.

### Elegant Theme

Premium design with animations, glassmorphism, and parallax effects.

### Classic Theme

Traditional wedding invitation with formal typography and colors.

### Modern Theme

Contemporary design with bold colors and geometric shapes.

---

## 📚 Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

### Design Inspiration
- [Dribbble - Wedding Invitations](https://dribbble.com/tags/wedding-invitation)
- [Behance - Wedding Design](https://www.behance.net/search/projects?search=wedding+invitation)

### Tools
- [Figma](https://figma.com) - Design mockups
- [Coolors](https://coolors.co) - Color palette generator
- [Google Fonts](https://fonts.google.com) - Typography

---

## 🆘 Need Help?

If you encounter issues or have questions:

1. Check existing themes for examples
2. Review type definitions in `/src/types/invitation.ts`
3. Test with mock data in `/src/data/mockData.ts`
4. Open an issue on GitHub

---

## 📝 License

All themes must be compatible with the project license.

---

**Happy Theme Building! 🎉**

Created with ❤️ by the Nikahin Team
