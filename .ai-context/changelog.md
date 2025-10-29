# Changelog

## Format
Each entry should include:
- **Date**: When the change was made
- **Type**: Feature / Fix / Refactor / Docs / Chore
- **Component**: What part was affected
- **Description**: What changed and why
- **Files**: Key files modified

---

## 2025-10-29 - Purchase Date Implementation

**Type**: Feature  
**Component**: Receipt Parsing, Stock Management, UI

**Changes**:
- Replaced `addedAt` with two separate date fields:
  - `purchaseDate`: Date from the receipt/bill (displayed to user)
  - `createdAt`: System timestamp when entry was created (for auditing)
- Updated AI prompt to extract purchase date from receipt
- Updated all UI components to display purchase date instead of creation date
- Changed icon from clock to calendar and label from "Added" to "Purchased"

**Rationale**:
Users want to see when items were actually purchased (from receipt), not when they were scanned into the system.

**Files Modified**:
- `app/types/index.ts` - Updated StockItem and ParsedItem interfaces
- `server/api/receipts/parse.ts` - Extract purchase date from receipt
- `server/api/stock/index.ts` - Store both dates
- `server/api/stock/[id].ts` - Preserve both dates on update
- `app/composables/useStock.ts` - Updated type signature
- `app/pages/index.vue` - Display purchaseDate
- `app/components/EntriesModal.vue` - Display purchaseDate
- `.ai-context/data-models.md` - Updated documentation
- `.ai-context/api-endpoints.md` - Updated API examples
- `.ai-context/implementation-notes.md` - Updated code examples

**Result**: Product cards now show the actual purchase date from the receipt, making it more accurate for expiration tracking and inventory management.

---

## 2025-10-29 - Unified Badge Styling

**Type**: Fix  
**Component**: Stock View UI

**Changes**:
- Made all badge types use identical styling (same padding, border, shadow, shape)
- Fixed right alignment of waste/packaging badges using flex spacer
- Distinguished badge types by color scheme only:
  - Category badges: Various colors (green, orange, red, etc.)
  - Waste badges: Different colors (red, cyan, amber, etc.)
- Updated tooltip from "Waste:" to "Packaging:"

**Layout**:
```
[Entries] [Category]  <-- flex-1 spacer -->  [Plastic] [Paper]
```

**Badge Style** (unified):
- Padding: `px-2.5 py-1`
- Shape: `rounded-lg`
- Text: `text-xs font-bold`
- Effects: `border shadow-sm`

**Files Modified**:
- `app/pages/index.vue` - Unified badge styling and alignment
- `app/pages/scan.vue` - Unified badge styling
- `app/components/EntriesModal.vue` - Unified badge styling

**Result**: All badges have identical visual weight, waste badges properly aligned to right edge, cleaner appearance.

---

## 2025-10-29 - Waste Labels Final Layout Fix

**Type**: Fix  
**Component**: Stock View UI

**Changes**:
- Removed trash icon separator before waste badges
- Moved waste category badges to the right side of the badge row
- Changed Organic icon from 'leaf' (not available) to 'sparkles'
- Added flex spacer to push waste badges to right

**Layout**:
```
Product Name
[3 entries] [Category]              [Plastic] [Paper]
                    └── spacer ──┘
```

**Files Modified**:
- `app/pages/index.vue` - Layout changes and icon fix

**Result**: Cleaner layout with waste badges grouped on the right side, all icons now display correctly.

---

## 2025-10-29 - Waste Labels Critical Bug Fix

**Type**: Fix (Critical)  
**Component**: Stock API

**Changes**:
- Fixed critical operator precedence bug in stock API
- wasteCategories was being set to `[undefined]` instead of the actual array

**The Bug**:
```typescript
// WRONG - operator precedence issue
wasteCategories: item.wasteCategories || item.wasteCategory ? [item.wasteCategory] : undefined
// This evaluates as: (item.wasteCategories || item.wasteCategory) ? [item.wasteCategory] : undefined
// Result: Always [undefined] when wasteCategories exists
```

**The Fix**:
```typescript
// CORRECT - proper parentheses
wasteCategories: item.wasteCategories || (item.wasteCategory ? [item.wasteCategory] : undefined)
// This evaluates as: item.wasteCategories || (item.wasteCategory ? [item.wasteCategory] : undefined)
// Result: Uses wasteCategories array if present, otherwise migrates old format
```

**Files Modified**:
- `server/api/stock/index.ts` - Fixed operator precedence

**Impact**: This was causing ALL waste categories to show as `null` in the UI, showing only trash icons without labels.

---

## 2025-10-29 - Waste Labels UI Fix (v2)

**Type**: Fix  
**Component**: Stock View UI & Backend

**Changes**:
- Fixed waste category keywords not matching properly
- Added 'organic' and 'mixed' to keyword lists
- Changed waste badge elements from `<div>` to `<span>` for proper inline display
- Added migration logic for old data format

**Files Modified**:
- `server/api/receipts/parse.ts` - Updated keyword matching
- `app/pages/index.vue` - Changed to span elements, added migration

**Bug**: 
- 'organic' packaging wasn't being recognized (missing from keywords)
- 'mixed' alone wasn't matching (needed in keyword list)
- Badges using `<div>` weren't displaying inline properly

**Fix**:
- Added 'organic' to Organic keywords
- Added 'mixed' to Mixed keywords  
- Changed to `<span>` elements for inline flow

---

## 2025-10-29 - Waste Labels UI Fix

**Type**: Fix  
**Component**: Stock View UI

**Changes**:
- Fixed waste category badges not displaying properly on product cards
- Moved waste badges to same row as category badge (inline display)
- Replaced "Waste:" text with trash icon separator
- All badges now on one line with proper wrapping
- Better visual hierarchy and spacing

**Files Modified**:
- `app/pages/index.vue` - Simplified badge layout structure

**Before**: 
- Waste categories in separate gray box below
- "Waste:" text label
- Took up extra vertical space

**After**:
- All badges inline: [Entries] [Category] 🗑️ [Plastic] [Paper]
- Icon separator instead of text
- Cleaner, more compact layout

---

## 2025-10-29 - Documentation Organization

**Type**: Chore  
**Component**: Project Documentation

**Changes**:
- Cleaned up root directory - only 3 .md files remain
- Moved user/developer docs to `docs/` folder
- Moved session notes and feature docs to `.ai-context/`
- Renamed old/redundant files with `_OLD` suffix
- Created organized structure for better maintainability

**Files Moved to docs/**:
- `DESIGN.md`, `DESIGN_SUMMARY.md`
- `DEVELOPMENT.md`
- `GEMINI_INTEGRATION.md`, `GEMINI_SETUP.md`
- `QUICK_START.md`, `VISUAL_GUIDE.md`
- `PROVIDER_SELECTOR.md`, `LOGO.md`
- `INDEX.md` → `INDEX_OLD.md` (reference)

**Files Moved to .ai-context/**:
- `PROJECT_SUMMARY.md`
- `WASTE_MANAGEMENT.md`, `WASTE_CATEGORIES_IMPROVEMENTS.md`
- `SESSION_SUMMARY.md`, `TESTING_WASTE_FEATURE.md`
- `BEFORE_AFTER.md`
- `CHANGELOG.md` → `CHANGELOG_OLD.md` (reference)

**Root Structure (Final)**:
```
root/
├── README.md                   (main project readme)
├── AI_ASSISTANT_README.md      (AI quick start)
└── AI_CONTEXT_SUMMARY.md       (context system explanation)
```

**Rationale**: Clean root directory improves professional appearance, makes main README easy to find, and organizes documentation by audience (users/devs vs AI assistants).

---

## 2025-10-29 - Multiple Waste Categories Support

**Type**: Feature + Refactor  
**Component**: Waste Management System

**Changes**:
1. **Data Model Update**:
   - Changed `wasteCategory: string` → `wasteCategories: string[]`
   - Updated `StockItem` and `ParsedItem` interfaces
   - Backward compatibility added (handles old format)

2. **LLM Prompt Enhancement**:
   - Added 30+ detailed packaging examples
   - Emphasized multi-material packaging detection
   - Included product type hints for better inference
   - Made packaging field an array in output format

3. **Backend Logic**:
   - `categorizeWaste()` now returns array of categories
   - Collects ALL matching waste types (not just first)
   - Stock grouping merges waste categories (unique values)

4. **UI Improvements**:
   - Visual grouping for waste badges (gray box with border)
   - Distinctive colors per waste type with borders
   - Icons for each waste category
   - Better layout: product name → badges → waste section
   - Updated both product cards and EntriesModal

5. **Color Scheme**:
   - Plastic: Red tones
   - Glass: Cyan tones
   - Paper: Amber tones
   - Metal: Slate tones
   - Organic: Green tones
   - Mixed: Purple tones

**Files Modified**:
- `app/types/index.ts` - Interface updates
- `server/api/receipts/parse.ts` - Prompt & logic changes
- `server/api/stock/index.ts` - Backward compatibility
- `app/pages/index.vue` - UI updates, grouping logic
- `app/components/EntriesModal.vue` - UI updates

**Rationale**: Real-world products have multiple packaging materials (e.g., glass bottle + metal cap + paper label). Supporting multiple categories provides more accurate waste tracking.

---

## 2025-10-29 - AI Context Documentation Created

**Type**: Docs  
**Component**: Project Documentation

**Changes**:
- Created `.ai-context/` folder for AI assistant documentation
- Added structured reference files:
  - `README.md` - Overview of context system
  - `project-overview.md` - Tech stack, features, architecture
  - `file-structure.md` - Directory layout and key files
  - `data-models.md` - TypeScript interfaces and data flow
  - `api-endpoints.md` - All API routes with examples
  - `ui-patterns.md` - Component patterns and design system
  - `implementation-notes.md` - Important decisions and gotchas
  - `changelog.md` - This file

**Files Created**:
- `.ai-context/README.md`
- `.ai-context/project-overview.md`
- `.ai-context/file-structure.md`
- `.ai-context/data-models.md`
- `.ai-context/api-endpoints.md`
- `.ai-context/ui-patterns.md`
- `.ai-context/implementation-notes.md`
- `.ai-context/changelog.md`

**Rationale**: Helps AI assistants (and human developers) quickly understand the project in new sessions. Reduces context-gathering time and ensures consistency.

---

## Previous Development (Before Changelog)

### Multi-Language Support
- Added English, German, Hungarian translations
- LLM generates all three names simultaneously
- Language selector in header
- localStorage persistence

### Receipt Scanning
- Google Gemini integration
- Image upload with preview
- Editable items table
- Category auto-detection

### Stock Management
- In-memory storage
- Multi-entry support (separate entries, not merged)
- Grouping by product + unit
- Category filtering
- Delete functionality

### UI/UX
- Playful design with gradients
- Product cards with hover effects
- Modals (confirm, entries view)
- Toast notifications
- Empty states

### Basic Features
- Home page (stock view)
- Scan page (receipt upload)
- Recipes page (experimental)
- AppHeader navigation
- Mobile responsive

---

## Update Instructions

When making changes to the codebase, **always update this changelog**:

1. Add new entry at the top (reverse chronological)
2. Include date, type, component
3. Describe what changed and why
4. List affected files
5. Update other context files if needed:
   - Types changed? → Update `data-models.md`
   - API modified? → Update `api-endpoints.md`
   - New UI pattern? → Update `ui-patterns.md`
   - Important decision? → Update `implementation-notes.md`
