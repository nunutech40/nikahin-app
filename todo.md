# 📋 Nikahin App - Development Roadmap

> **Project Goal:** Build a SaaS platform for digital wedding invitations with theme customization
> 
> **Architecture:** Next.js 14 + Drizzle ORM + PostgreSQL + Tailwind CSS + Framer Motion

---

## 🎯 Progress Overview

- [x] **Iterasi 1:** The Renderer (Public Page - Static) - ✅ **COMPLETED**
- [x] **Iterasi 2:** The Theme Engine (Decoupling) - ✅ **COMPLETED**
- [ ] **Iterasi 3:** User Dashboard (Data Entry) - 🔄 **IN PROGRESS**
- [ ] **Iterasi 4:** Database Integration (RSVP & Persistence)
- [ ] **Iterasi 5:** Auth & User Management
- [ ] **Iterasi 6:** Super Admin Panel

---

## ✅ Iterasi 1: The Renderer (Public Page - Static)

### 📝 Feature Definition
Create a pixel-perfect, mobile-first wedding invitation page that can be shown to potential clients. Focus on visual excellence and user experience without backend integration.

### 🎯 Acceptance Criteria
- [x] Mobile-first responsive design (360px - 430px optimized)
- [x] Premium UI with modern aesthetics (glassmorphism, animations)
- [x] All sections implemented (Hero, Couple, Event, Gallery, RSVP, Quotes)
- [x] Smooth animations using Framer Motion
- [x] Bottom navigation for easy section access
- [x] Music toggle functionality
- [x] Personalized greeting (query param `?to=Name`)

### ✅ Tasks Completed
- [x] **T1.1** - Setup Next.js 14 project with App Router
- [x] **T1.2** - Install dependencies (Tailwind, Framer Motion, Lucide Icons)
- [x] **T1.3** - Create route `app/[slug]/page.tsx`
- [x] **T1.4** - Define MOCK_DATA structure with all required fields
- [x] **T1.5** - Implement Hero section with couple photo
- [x] **T1.6** - Implement Couple section (Groom & Bride profiles)
- [x] **T1.7** - Implement Event section with date/time/location
- [x] **T1.8** - Implement Gallery section with image grid
- [x] **T1.9** - Implement RSVP form (UI only, no backend)
- [x] **T1.10** - Implement Guestbook section
- [x] **T1.11** - Implement Quotes section
- [x] **T1.12** - Add Bottom Navigation component with glassmorphism
- [x] **T1.13** - Add Music Toggle component
- [x] **T1.14** - Add entrance animations (fade-in, slide-up)
- [x] **T1.15** - Test mobile compatibility (iOS Safari, Android Chrome)
- [x] **T1.16** - Optimize images with next/image

### 📊 Status: ✅ **COMPLETED** (100%)

---

## 🔄 Iterasi 2: The Theme Engine (Decoupling)

### 📝 Feature Definition
Refactor the codebase to separate data from presentation, enabling users to switch themes without losing their data. Implement a dynamic theme engine that loads theme components based on database configuration.

### 🎯 Acceptance Criteria
- [ ] `[slug]/page.tsx` acts as controller (fetch data only)
- [ ] Theme component receives data via single prop
- [ ] Multiple themes can be created without modifying core logic
- [ ] Theme switching works seamlessly
- [ ] All existing features preserved after refactor

### 📦 Tasks Breakdown

#### **Phase 2.1: Extract Theme Component**
- [x] **T2.1.1** - Create `/src/components/themes/` directory
- [x] **T2.1.2** - Create `BasicTheme.tsx` component
- [x] **T2.1.3** - Move all UI sections from `page.tsx` to `BasicTheme.tsx`
  - [x] Hero section
  - [x] Couple section
  - [x] Event section
  - [x] Gallery section
  - [x] Quotes section
  - [x] RSVP section
  - [x] Guestbook section
- [x] **T2.1.4** - Define TypeScript interface for theme props (`InvitationData`)
- [x] **T2.1.5** - Test: Verify UI still works after extraction

**Rollback Point:** If issues occur, revert `BasicTheme.tsx` and restore original `page.tsx`

#### **Phase 2.2: Refactor Page Controller**
- [x] **T2.2.1** - Move `MOCK_DATA` to `/src/data/mockData.ts`
- [x] **T2.2.2** - Simplify `[slug]/page.tsx` to only:
  - Fetch data based on slug
  - Determine theme to use
  - Render theme component with data
- [x] **T2.2.3** - Import and use `BasicTheme` in `page.tsx`
- [x] **T2.2.4** - Test: Verify data flows correctly to theme component

**Rollback Point:** Keep backup of original `page.tsx` as `page.tsx.backup`

#### **Phase 2.3: Create Theme Registry**
- [x] **T2.3.1** - Create `/src/lib/themeRegistry.ts`
- [x] **T2.3.2** - Implement theme mapping logic (slug → component)
- [x] **T2.3.3** - Add theme metadata (name, description, isFree)
- [x] **T2.3.4** - Test: Verify theme loading works

**Rollback Point:** Theme registry is additive, safe to remove if needed

#### **Phase 2.4: Cleanup & Documentation**
- [x] **T2.4.1** - Remove unused code from `page.tsx`
- [x] **T2.4.2** - Add JSDoc comments to theme interface
- [x] **T2.4.3** - Create `/docs/THEME_DEVELOPMENT.md` guide
- [x] **T2.4.4** - Update README with new architecture

### 📊 Status: ✅ **COMPLETED** (100%)

---

## 📝 Iterasi 3: User Dashboard (Data Entry)

### 📝 Feature Definition
Build a user-facing dashboard where users can input their wedding data through forms. Implement live preview functionality so users can see changes in real-time before publishing.

### 🎯 Acceptance Criteria
- [ ] Form for all invitation data (couple info, events, gallery)
- [ ] Live preview in split-screen layout (desktop)
- [ ] Mobile-optimized form layout
- [ ] Form validation with error messages
- [ ] Temporary state management (no DB yet)
- [ ] Preview uses actual theme component

### 📦 Tasks Breakdown

#### **Phase 3.1: Dashboard Layout**
- [x] **T3.1.1** - Create `/src/app/dashboard/page.tsx`
- [x] **T3.1.2** - Create dashboard layout component
- [x] **T3.1.3** - Implement split-screen layout (form left, preview right)
- [x] **T3.1.4** - Add responsive breakpoints (stack on mobile)
- [x] **T3.1.5** - Test: Verify layout works on all screen sizes

**Rollback Point:** Dashboard is separate route, safe to delete

#### **Phase 3.2: Form Components**
- [x] **T3.2.1** - Create `/src/components/dashboard/forms/` directory
- [x] **T3.2.2** - Build `CoupleInfoForm.tsx` (groom & bride details)
- [x] **T3.2.3** - Build `EventForm.tsx` (date, time, location)
- [x] **T3.2.4** - Build `GalleryForm.tsx` (image upload placeholder)
- [x] **T3.2.5** - Build `QuotesForm.tsx` (verse and source)
- [x] **T3.2.6** - Build `MusicForm.tsx` (music URL input)
- [x] **T3.2.7** - Test: Each form component independently

**Rollback Point:** Each form is independent, can be removed individually

#### **Phase 3.3: State Management**
- [ ] **T3.3.1** - Setup React Context for invitation data
- [ ] **T3.3.2** - Create `InvitationProvider` component
- [ ] **T3.3.3** - Implement state update handlers
- [ ] **T3.3.4** - Add form validation logic
- [ ] **T3.3.5** - Test: State updates work correctly

**Rollback Point:** Context is isolated, can revert to local state

#### **Phase 3.4: Live Preview**
- [x] **T3.4.1** - Create preview container component
- [x] **T3.4.2** - Connect preview to form state
- [x] **T3.4.3** - Add mobile device frame for preview
- [x] **T3.4.4** - Implement preview refresh on state change
- [x] **T3.4.5** - Test: Preview updates in real-time

**Rollback Point:** Preview is read-only, safe to modify

#### **Phase 3.5: Form Validation**
- [x] **T3.5.1** - Install validation library (Zod)
- [x] **T3.5.2** - Create validation schemas for each form
- [x] **T3.5.3** - Add error message display
- [x] **T3.5.4** - Implement field-level validation
- [x] **T3.5.5** - Test: All validations work correctly

**Rollback Point:** Validation is additive, can be disabled


#### **Phase 3.6: Appearance & Theme Settings**
- [x] **T3.6.1** - Update `InvitationData` types for `themeConfig`
- [x] **T3.6.2** - Create `ThemeSettingsForm` component (Color & Font picker)
- [x] **T3.6.3** - Implement dynamic theme variable injection in `BasicTheme`
- [x] **T3.6.4** - Add dynamic Google Fonts loading in theme
- [x] **T3.6.5** - Test: Visual changes apply in real-time in preview

**Rollback Point:** Theme config is optional, can revert to hardcoded values

### 📊 Status: 🔄 **IN PROGRESS** (25%)

**Current State:**
- ✅ Phase 3.1: Dashboard Layout - **COMPLETED**
- [x] Phase 3.2: Form Components - **COMPLETED**
- ⏳ Phase 3.3: State Management - **PENDING**
- [x] Phase 3.4: Live Preview - **COMPLETED**
- [x] Phase 3.5: Form Validation - **COMPLETED**
- [x] Phase 3.6: Appearance & Theme Settings - **COMPLETED**

**Completed:**
- ✅ Dashboard page created with split-screen layout
- ✅ Form sidebar with responsive design
- ✅ Live preview with mobile/desktop modes
- ✅ Form validation with Zod (Error messages & styling)
- ✅ Custom Theme Config (Primary/Secondary Colors, Heading/Body Fonts)
- ✅ Adaptive Hero Cover Image
- ✅ Premium UI styling with glassmorphism effects


---

## 🗄️ Iterasi 4: Database Integration (RSVP & Persistence)

### 📝 Feature Definition
Connect the application to PostgreSQL database using Drizzle ORM. Implement data persistence for invitations and RSVP functionality for guests.

### 🎯 Acceptance Criteria
- [ ] Database connection via SSH tunnel (port 5433)
- [ ] Drizzle ORM configured and working
- [ ] Invitation data saved to `invitations` table (JSONB)
- [ ] RSVP data saved to `guests` table
- [ ] Server Actions for form submissions
- [ ] Error handling for database operations

### 📦 Tasks Breakdown

#### **Phase 4.1: Database Setup**
- [ ] **T4.1.1** - Install Drizzle ORM dependencies
  ```bash
  npm install drizzle-orm postgres
  npm install -D drizzle-kit
  ```
- [ ] **T4.1.2** - Create `/src/db/schema.ts` with table definitions
- [ ] **T4.1.3** - Create `/src/db/index.ts` for database connection
- [ ] **T4.1.4** - Setup environment variables for DB connection
- [ ] **T4.1.5** - Configure SSH tunnel connection
- [ ] **T4.1.6** - Test: Verify database connection works

**Rollback Point:** Database config is isolated, can be disabled via env vars

#### **Phase 4.2: Schema Migration**
- [ ] **T4.2.1** - Create `drizzle.config.ts`
- [ ] **T4.2.2** - Generate migration files
  ```bash
  npx drizzle-kit generate:pg
  ```
- [ ] **T4.2.3** - Review migration SQL
- [ ] **T4.2.4** - Run migration to database
  ```bash
  npx drizzle-kit push:pg
  ```
- [ ] **T4.2.5** - Verify tables created correctly

**Rollback Point:** Keep migration files, can rollback via SQL

#### **Phase 4.3: Seed Data**
- [ ] **T4.3.1** - Create `/src/db/seed.ts` script
- [ ] **T4.3.2** - Convert MOCK_DATA to database format
- [ ] **T4.3.3** - Insert seed data to `invitations` table
- [ ] **T4.3.4** - Test: Verify data inserted correctly
- [ ] **T4.3.5** - Create npm script for seeding

**Rollback Point:** Seed is separate script, can be re-run

#### **Phase 4.4: Data Fetching**
- [ ] **T4.4.1** - Create `/src/lib/queries.ts` for database queries
- [ ] **T4.4.2** - Implement `getInvitationBySlug()` function
- [ ] **T4.4.3** - Update `[slug]/page.tsx` to fetch from database
- [ ] **T4.4.4** - Add error handling for not found
- [ ] **T4.4.5** - Test: Verify invitation loads from DB

**Rollback Point:** Keep MOCK_DATA as fallback

#### **Phase 4.5: RSVP Server Actions**
- [ ] **T4.5.1** - Create `/src/app/actions/rsvp.ts`
- [ ] **T4.5.2** - Implement `submitRSVP()` Server Action
- [ ] **T4.5.3** - Add validation for RSVP data
- [ ] **T4.5.4** - Insert RSVP to `guests` table
- [ ] **T4.5.5** - Return success/error response
- [ ] **T4.5.6** - Test: RSVP submission works

**Rollback Point:** Server Actions are isolated, can be disabled

#### **Phase 4.6: Connect RSVP Form**
- [ ] **T4.6.1** - Update RSVP form to use Server Action
- [ ] **T4.6.2** - Add loading state during submission
- [ ] **T4.6.3** - Show success message after submit
- [ ] **T4.6.4** - Handle error cases gracefully
- [ ] **T4.6.5** - Test: End-to-end RSVP flow

**Rollback Point:** Form can revert to mock submission

#### **Phase 4.7: Dashboard Data Persistence**
- [ ] **T4.7.1** - Create `/src/app/actions/invitation.ts`
- [ ] **T4.7.2** - Implement `saveInvitation()` Server Action
- [ ] **T4.7.3** - Update dashboard to save to database
- [ ] **T4.7.4** - Implement `updateInvitation()` for edits
- [ ] **T4.7.5** - Test: Dashboard save/update works

**Rollback Point:** Dashboard can use local state only

### 📊 Status: ⏳ **NOT STARTED** (0%)

---

## 🔐 Iterasi 5: Auth & User Management

### 📝 Feature Definition
Implement authentication system to secure user data. Users can only access and edit their own invitations. Implement session management and protected routes.

### 🎯 Acceptance Criteria
- [ ] User registration and login
- [ ] Session management with NextAuth.js
- [ ] Protected dashboard routes
- [ ] User can only edit own invitations
- [ ] Logout functionality
- [ ] Password reset (optional)

### 📦 Tasks Breakdown

#### **Phase 5.1: NextAuth Setup**
- [ ] **T5.1.1** - Install NextAuth.js
  ```bash
  npm install next-auth
  ```
- [ ] **T5.1.2** - Create `/src/app/api/auth/[...nextauth]/route.ts`
- [ ] **T5.1.3** - Configure credentials provider
- [ ] **T5.1.4** - Setup session strategy (JWT)
- [ ] **T5.1.5** - Add environment variables for auth
- [ ] **T5.1.6** - Test: Auth API routes work

**Rollback Point:** Auth is separate API route, can be disabled

#### **Phase 5.2: User Registration**
- [ ] **T5.2.1** - Create `/src/app/register/page.tsx`
- [ ] **T5.2.2** - Build registration form
- [ ] **T5.2.3** - Create `registerUser()` Server Action
- [ ] **T5.2.4** - Hash passwords with bcrypt
- [ ] **T5.2.5** - Insert user to `users` table
- [ ] **T5.2.6** - Test: User registration works

**Rollback Point:** Registration is separate route

#### **Phase 5.3: Login Flow**
- [ ] **T5.3.1** - Create `/src/app/login/page.tsx`
- [ ] **T5.3.2** - Build login form
- [ ] **T5.3.3** - Implement signIn with NextAuth
- [ ] **T5.3.4** - Add redirect after login
- [ ] **T5.3.5** - Test: Login flow works

**Rollback Point:** Login is separate route

#### **Phase 5.4: Protected Routes**
- [ ] **T5.4.1** - Create middleware for auth check
- [ ] **T5.4.2** - Protect `/dashboard` routes
- [ ] **T5.4.3** - Redirect unauthenticated users to login
- [ ] **T5.4.4** - Add session provider to layout
- [ ] **T5.4.5** - Test: Protection works correctly

**Rollback Point:** Middleware can be disabled

#### **Phase 5.5: User Authorization**
- [ ] **T5.5.1** - Add `userId` check in invitation queries
- [ ] **T5.5.2** - Filter invitations by current user
- [ ] **T5.5.3** - Prevent editing other users' invitations
- [ ] **T5.5.4** - Add 403 error handling
- [ ] **T5.5.5** - Test: Authorization works correctly

**Rollback Point:** Authorization checks can be commented out

#### **Phase 5.6: User Profile**
- [ ] **T5.6.1** - Create `/src/app/dashboard/profile/page.tsx`
- [ ] **T5.6.2** - Display user information
- [ ] **T5.6.3** - Add logout button
- [ ] **T5.6.4** - Implement logout functionality
- [ ] **T5.6.5** - Test: Profile and logout work

**Rollback Point:** Profile is separate route

### 📊 Status: ⏳ **NOT STARTED** (0%)

---

## 👑 Iterasi 6: Super Admin Panel

### 📝 Feature Definition
Build an admin dashboard for system owner to manage users, activate accounts after payment, and manage theme templates.

### 🎯 Acceptance Criteria
- [ ] Admin-only access to `/admin` routes
- [ ] View all users list
- [ ] Toggle user `is_active` status
- [ ] View all invitations
- [ ] CRUD operations for themes
- [ ] Analytics dashboard (optional)

### 📦 Tasks Breakdown

#### **Phase 6.1: Admin Authentication**
- [ ] **T6.1.1** - Add `role` field to user session
- [ ] **T6.1.2** - Create admin middleware
- [ ] **T6.1.3** - Protect `/admin` routes
- [ ] **T6.1.4** - Add 403 page for non-admins
- [ ] **T6.1.5** - Test: Admin protection works

**Rollback Point:** Admin routes are isolated

#### **Phase 6.2: Admin Layout**
- [ ] **T6.2.1** - Create `/src/app/admin/layout.tsx`
- [ ] **T6.2.2** - Build admin sidebar navigation
- [ ] **T6.2.3** - Add admin header with user info
- [ ] **T6.2.4** - Style admin interface
- [ ] **T6.2.5** - Test: Admin layout renders correctly

**Rollback Point:** Layout is separate component

#### **Phase 6.3: User Management**
- [ ] **T6.3.1** - Create `/src/app/admin/users/page.tsx`
- [ ] **T6.3.2** - Fetch all users from database
- [ ] **T6.3.3** - Display users in table format
- [ ] **T6.3.4** - Add toggle for `is_active` status
- [ ] **T6.3.5** - Implement `toggleUserStatus()` Server Action
- [ ] **T6.3.6** - Test: User activation works

**Rollback Point:** User management is separate route

#### **Phase 6.4: Invitation Management**
- [ ] **T6.4.1** - Create `/src/app/admin/invitations/page.tsx`
- [ ] **T6.4.2** - Fetch all invitations
- [ ] **T6.4.3** - Display invitations with user info
- [ ] **T6.4.4** - Add view/edit/delete actions
- [ ] **T6.4.5** - Test: Invitation management works

**Rollback Point:** Invitation management is separate route

#### **Phase 6.5: Theme Management**
- [ ] **T6.5.1** - Create `/src/app/admin/themes/page.tsx`
- [ ] **T6.5.2** - Display all themes
- [ ] **T6.5.3** - Add create theme form
- [ ] **T6.5.4** - Implement theme CRUD Server Actions
- [ ] **T6.5.5** - Test: Theme management works

**Rollback Point:** Theme management is separate route

#### **Phase 6.6: Analytics (Optional)**
- [ ] **T6.6.1** - Create `/src/app/admin/analytics/page.tsx`
- [ ] **T6.6.2** - Show total users count
- [ ] **T6.6.3** - Show total invitations count
- [ ] **T6.6.4** - Show RSVP statistics
- [ ] **T6.6.5** - Add charts (optional)

**Rollback Point:** Analytics is optional feature

### 📊 Status: ⏳ **NOT STARTED** (0%)

---

## 📚 Additional Tasks

### 🎨 Polish & Optimization
- [ ] **TP.1** - Add loading skeletons for async data
- [ ] **TP.2** - Implement error boundaries
- [ ] **TP.3** - Add toast notifications for user actions
- [ ] **TP.4** - Optimize images with next/image
- [ ] **TP.5** - Add meta tags for SEO
- [ ] **TP.6** - Implement Open Graph tags for social sharing
- [ ] **TP.7** - Add favicon and app icons
- [ ] **TP.8** - Test performance with Lighthouse

### 🧪 Testing
- [ ] **TT.1** - Setup testing framework (Jest + React Testing Library)
- [ ] **TT.2** - Write unit tests for components
- [ ] **TT.3** - Write integration tests for Server Actions
- [ ] **TT.4** - Write E2E tests for critical flows
- [ ] **TT.5** - Test on real iOS device
- [ ] **TT.6** - Test on real Android device

### 📖 Documentation
- [ ] **TD.1** - Update README with setup instructions
- [ ] **TD.2** - Document environment variables
- [ ] **TD.3** - Create API documentation
- [ ] **TD.4** - Write theme development guide
- [ ] **TD.5** - Create user manual for dashboard

### 🚀 Deployment
- [ ] **TDep.1** - Setup production database
- [ ] **TDep.2** - Configure environment variables for production
- [ ] **TDep.3** - Deploy to Vercel/Railway
- [ ] **TDep.4** - Setup custom domain
- [ ] **TDep.5** - Configure SSL certificate
- [ ] **TDep.6** - Setup monitoring (Sentry)

---

## 🔄 How to Use This Roadmap

### ✅ Marking Tasks Complete
1. Check the box when task is done: `- [x]`
2. Update the progress percentage in each iteration
3. Move to next task in sequence

### 🔙 Rollback Strategy
Each phase has a **Rollback Point** that explains how to undo changes if issues occur:
- Keep backup files before major refactors
- Use git commits for each completed phase
- Test thoroughly before moving to next phase

### 📝 Task Naming Convention
- **T[Iteration].[Phase].[Task]** - Example: T2.1.3 = Iterasi 2, Phase 1, Task 3
- **TP** = Polish tasks
- **TT** = Testing tasks
- **TD** = Documentation tasks
- **TDep** = Deployment tasks

### 🎯 Best Practices
1. **Complete tasks sequentially** within each phase
2. **Test after each phase** before moving forward
3. **Commit to git** after each completed phase
4. **Update progress** regularly
5. **Document blockers** if stuck on a task

---

## 📊 Overall Project Status

**Current Phase:** Iterasi 3 - User Dashboard (Data Entry)

**Overall Progress:** ~40% Complete (approx based on T1, T2 completion)

**Next Milestone:** Complete state management and form validation integration

**Estimated Completion:** 
- Iterasi 3: 3-4 days
- Iterasi 4: 4-5 days
- Iterasi 5: 3-4 days
- Iterasi 6: 2-3 days

**Total Estimated Time:** 12-16 days (assuming 4-6 hours/day)

---

## 🆘 Need Help?

If stuck on any task:
1. Check the rollback point for that phase
2. Review the feature definition and acceptance criteria
3. Consult the PRD.md for architecture details
4. Ask for help with specific task number (e.g., "stuck on T4.2.3")

---

**Last Updated:** 2026-01-13
**Maintained By:** Development Team