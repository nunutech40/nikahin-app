# 🔐 Local Database Credentials

## Database Connection

```bash
Host: localhost
Port: 5432
Database: nikahin_db_local
User: nununugraha
Password: (empty)
```

## User Accounts

### 🔴 Super Admin
```
Email: admin@nikahin.app
Password: admin123
Role: admin
Package: Bronze
Status: Active
```

**Access:**
- `/admin` - Full admin dashboard
- `/dashboard` - User dashboard
- All features and permissions

**⚠️ IMPORTANT:** Change this password after first login!

---

### 👤 Sample Customer User
```
Email: nunu@example.com
Password: hashed_password_here (placeholder - needs to be set)
Role: admin (legacy from seed)
Package: Silver
Status: Active
```

**Sample Invitation:**
- Slug: `rizka-ayu`
- Theme: Standard Elegant
- Status: Published
- URL: `http://localhost:3000/rizka-ayu`

---

## Quick Commands

### Start PostgreSQL
```bash
brew services start postgresql@16
```

### Stop PostgreSQL
```bash
brew services stop postgresql@16
```

### Connect to Database
```bash
/opt/homebrew/opt/postgresql@16/bin/psql nikahin_db_local
```

### Reset Database
```bash
# Drop and recreate
/opt/homebrew/opt/postgresql@16/bin/dropdb nikahin_db_local
/opt/homebrew/opt/postgresql@16/bin/createdb nikahin_db_local

# Push schema
pnpm drizzle-kit push --force

# Seed data
pnpm db:seed

# Create admin
pnpm tsx src/db/create-admin.ts
```

### Create New Admin User
```bash
pnpm tsx src/db/create-admin.ts
```

---

## Database Tables

✅ **users** - User accounts (customers, admins, agencies)
✅ **packages** - Subscription packages (Demo, Bronze, Silver, Gold)
✅ **features** - Available features
✅ **package_features** - Feature-package mapping
✅ **themes** - Available themes
✅ **invitations** - User invitations
✅ **guests** - Guest list per invitation
✅ **transactions** - Payment transactions
✅ **visitor_logs** - Analytics tracking

---

## Seeded Data

### Packages
- **Demo** (Rp 0) - Try all features, no save/publish
- **Bronze** (Rp 0) - Free trial with basic features
- **Silver** (Rp 150,000) - Best value, most popular
- **Gold** (Rp 300,000) - Premium with all features

### Themes
- **Legacy Theme** (basic) - Old default theme
- **Standard Elegant** (standard) - New elegant design
- **Custom Theme** (custom_default) - No-code builder

### Features
**Core (All packages):**
- Basic Info
- Countdown Timer
- Google Maps
- Digital Guestbook

**Bronze+:**
- RSVP Basic
- Single Event

**Silver+:**
- RSVP Export CSV
- Unlimited Events
- Gallery 10 Photos
- Background Music
- Quotes

**Gold+:**
- Love Story Timeline
- Gift Registry
- Custom Colors & Fonts
- Gallery Unlimited
- Remove Branding

---

## Troubleshooting

### Can't connect to database
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Start if not running
brew services start postgresql@16
```

### Permission denied
```bash
# Check database owner
/opt/homebrew/opt/postgresql@16/bin/psql -l

# Grant permissions if needed
/opt/homebrew/opt/postgresql@16/bin/psql nikahin_db_local -c "GRANT ALL PRIVILEGES ON DATABASE nikahin_db_local TO nununugraha;"
```

### Reset admin password
```bash
# Run create-admin script again
pnpm tsx src/db/create-admin.ts
```

---

**Last Updated:** 2026-01-23
**PostgreSQL Version:** 16.11
