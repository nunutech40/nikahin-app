---
description: Refactor Architecture - Clean, Maintainable & Scalable Structure
---

# 🏗️ Architecture Refactoring Plan

## 📊 Current State Analysis
- **Problem**: All code in single file (`[slug]/page.tsx` - 1424 lines)
- **Issues**: 
  - Hard to maintain
  - Difficult to test
  - Poor code reusability
  - No separation of concerns
  - Hard to collaborate

## 🎯 Target Architecture

```
src/
├── app/
│   ├── [slug]/
│   │   └── page.tsx (Main orchestrator - ~100 lines)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── invitation/
│   │   ├── HeroSection.tsx
│   │   ├── CoupleSection.tsx
│   │   ├── EventSection.tsx
│   │   ├── LoveStorySection.tsx
│   │   ├── GallerySection.tsx
│   │   ├── QuotesSection.tsx
│   │   ├── RSVPSection.tsx
│   │   └── GiftSection.tsx
│   ├── ui/
│   │   ├── BottomNavigation.tsx (REDESIGNED)
│   │   ├── MusicToggle.tsx
│   │   ├── CountdownTimer.tsx
│   │   ├── ConfettiAnimation.tsx
│   │   └── WelcomeMessage.tsx
│   └── shared/
│       ├── SectionTitle.tsx
│       └── Ornament.tsx
├── types/
│   └── invitation.ts
├── data/
│   └── mockData.ts
└── lib/
    └── utils.ts
```

## 📝 Implementation Steps

### Phase 1: Setup Structure
1. Create folder structure
2. Create type definitions
3. Move mock data to separate file

### Phase 2: Extract Components
1. Extract UI components (Bottom Nav, Music Toggle, etc)
2. Extract section components (Hero, Couple, Event, etc)
3. Extract shared components (SectionTitle, Ornament)

### Phase 3: Redesign Bottom Navigation
1. Improve visual design with glassmorphism
2. Add micro-animations
3. Better iconography
4. Improved active states

### Phase 4: Refactor Main Page
1. Clean up main page component
2. Import and compose components
3. Test functionality

## ✅ Success Criteria
- Main page < 150 lines
- Each component < 200 lines
- Clear separation of concerns
- Reusable components
- Type-safe code
- Better developer experience
