# 🔒 Demo Package Restrictions

## 📋 **Demo Package Rules (Final)**

### **✅ ALLOWED (Biar user liat bagusnya):**

| Feature | Status | Notes |
|---------|--------|-------|
| Edit Info Mempelai | ✅ | Full access |
| Edit Acara | ✅ | Full access |
| Edit Cerita Cinta | ✅ | **Max 2 items** |
| Edit Quotes | ✅ | Full access |
| Edit Musik | ✅ | Full access |
| Edit Theme Config | ✅ | Full access |
| Preview di Editor | ✅ | Mobile/Desktop frame |

### **❌ BLOCKED (Harus upgrade):**

| Feature | Status | Reason |
|---------|--------|--------|
| Upload Galeri Foto | ❌ | Premium feature |
| Live Preview (External Link) | ❌ | Requires paid package |
| Salin Link Undangan | ❌ | Requires paid package |
| Share WhatsApp | ❌ | Requires paid package |
| Save Undangan | ❌ | Demo data not persisted |
| Publish Undangan | ❌ | Requires paid package |

---

## 🔧 **Implementation**

### **1. Helper Functions**
```typescript
// src/lib/demoRestrictions.ts

isDemoPackage(packageSlug) → boolean
canUploadGallery(packageSlug) → boolean
canAccessLivePreview(packageSlug) → boolean
canCopyLink(packageSlug) → boolean
canShareWhatsApp(packageSlug) → boolean
canSaveInvitation(packageSlug) → boolean
canPublishInvitation(packageSlug, isActive) → boolean
getMaxLoveStoryItems(packageSlug) → number (2 for demo, 999 for others)
```

### **2. Upgrade Modal**
```typescript
// src/components/UpgradeModal.tsx

<UpgradeModal
  isOpen={showUpgrade}
  onClose={() => setShowUpgrade(false)}
  feature="Upload Galeri Foto"
  message="Upgrade untuk upload foto"
/>
```

### **3. Usage in Dashboard**
```typescript
// Check before allowing action
if (!canUploadGallery(user.package.slug)) {
  setShowUpgradeModal(true);
  return;
}

// Limit love story items
const maxItems = getMaxLoveStoryItems(user.package.slug);
if (loveStory.length >= maxItems) {
  toast.error(`Demo users can only add ${maxItems} love story items`);
  return;
}
```

---

## 🎯 **User Experience**

### **Scenario 1: Upload Galeri**
```
User klik "Upload Foto"
    ↓
Check: canUploadGallery(demo) → false
    ↓
Show UpgradeModal
    ↓
"Upgrade untuk upload foto"
    ↓
User pilih Silver → Register → Upload works ✅
```

### **Scenario 2: Live Preview**
```
User klik "Live Preview" button
    ↓
Check: canAccessLivePreview(demo) → false
    ↓
Show UpgradeModal
    ↓
"Upgrade untuk akses live preview"
    ↓
User pilih package → Register → Preview works ✅
```

### **Scenario 3: Love Story (Max 2)**
```
User add love story item #1 → ✅ Works
User add love story item #2 → ✅ Works
User add love story item #3 → ❌ Blocked
    ↓
Toast: "Demo users can only add 2 love story items"
    ↓
Show UpgradeModal
```

---

## 📊 **Conversion Funnel**

```
Demo User (100%)
    ↓
Try to upload gallery (60%)
    ↓
See upgrade modal (60%)
    ↓
Click package option (40%)
    ↓
Register & pay (20%)
    ↓
CONVERTED! 🎉
```

**Expected Conversion**: 20% Demo → Paid

---

## 🔧 **Next Steps (Implementation)**

### **Priority 1: Dashboard Integration**
- [ ] Add `user.package.slug` to DashboardClient props
- [ ] Import demo restriction helpers
- [ ] Add UpgradeModal state
- [ ] Block gallery upload button
- [ ] Block live preview button
- [ ] Block copy link button
- [ ] Block share WhatsApp button
- [ ] Limit love story to 2 items

### **Priority 2: UI Updates**
- [ ] Show "🔒 Upgrade" badge on locked features
- [ ] Disable buttons with tooltip
- [ ] Show upgrade modal on click

### **Priority 3: Testing**
- [ ] Test gallery upload block
- [ ] Test live preview block
- [ ] Test love story limit
- [ ] Test upgrade modal flow

---

## 💡 **Business Logic**

### **Why These Restrictions?**

1. **Gallery Upload** ❌
   - Premium feature
   - Encourages upgrade
   - Most users want photos

2. **Live Preview** ❌
   - Prevents sharing without paying
   - Creates urgency to upgrade

3. **Copy/Share** ❌
   - Prevents free distribution
   - Forces upgrade to share

4. **Love Story (Max 2)** ⚠️
   - Shows value of feature
   - Creates desire for more
   - Soft limit (not hard block)

5. **Save/Publish** ❌
   - Core monetization gate
   - Clear upgrade path

---

## 📝 **Files Created**

1. ✅ `/src/lib/demoRestrictions.ts` - Helper functions
2. ✅ `/src/components/UpgradeModal.tsx` - Upgrade modal
3. ✅ `/docs/PHASE7_DEMO_RESTRICTIONS.md` - This doc

---

**Status**: ✅ **Helpers & Modal Created!**  
**Next**: Integrate into Dashboard  
**Timeline**: 1-2 hours for full integration
