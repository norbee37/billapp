# Implementation Notes

## Important Patterns & Decisions

### 1. Multi-Entry Stock Management

**Decision**: Don't merge items when adding to stock. Create separate entries.

**Rationale**: 
- Preserves purchase history
- Tracks expiration dates per entry
- Allows deleting specific entries
- Frontend groups items for display

**Implementation**:
```typescript
// Backend: Always create new entry
const newItem = { 
  ...item, 
  id: crypto.randomUUID(), 
  purchaseDate: item.purchaseDate || new Date(),
  createdAt: new Date() 
}
stockItems.push(newItem)

// Frontend: Group by nameEn + unit
const key = `${item.nameEn.toLowerCase()}_${item.unit}`
grouped.set(key, { ...item, ids: [...], totalQuantity: sum })
```

### 2. Multi-Language Support

**Decision**: Store all three translations in every item.

**Rationale**:
- No need for translation API calls
- Works offline
- Fast language switching
- LLM generates all at once

**Gotcha**: `nameEn` is the canonical ID - use it for grouping, not translated names.

```typescript
// ✅ Correct - group by English name
const key = `${item.nameEn.toLowerCase()}_${unit}`

// ❌ Wrong - different languages won't group
const key = `${getItemName(item, language)}_${unit}`
```

### 3. Multiple Waste Categories

**Decision**: Store as array, even for single category.

**Rationale**:
- Real products have multi-material packaging
- More accurate waste tracking
- Better recycling insights
- LLM can identify all components

**Migration**: Backend handles old `wasteCategory` string:
```typescript
wasteCategories: item.wasteCategories || 
                 (item.wasteCategory ? [item.wasteCategory] : undefined)
```

### 4. Category Auto-Detection

**Decision**: Keyword-based categorization on backend, not LLM.

**Rationale**:
- Faster (no extra API call)
- Consistent results
- LLM sometimes unreliable for categories
- Cheap fallback

**Implementation**: Priority-based keyword matching:
```typescript
const priorityOrder = [
  'Frozen',        // Check first (frozen vegetables vs vegetables)
  'Meat',
  'Fish & Seafood',
  'Dairy',
  // ...
  'Other'          // Fallback
]
```

### 5. Toast Notification System

**Decision**: Global instance on window object.

**Rationale**:
- Accessible from anywhere (composables, components)
- No need to pass refs through props
- Simple API

**Usage**:
```typescript
if (process.client && (window as any).__toastInstance) {
  (window as any).__toastInstance.addToast({ ... })
}
```

**Gotcha**: Check `process.client` to avoid SSR errors.

### 6. Gemini Prompt Strategy

**Decision**: Very detailed prompt with 30+ examples.

**Rationale**:
- LLMs need concrete examples
- Multi-language is complex
- Packaging detection is nuanced
- Better examples = better output

**Key Techniques**:
- Explicit format requirements (JSON only, no markdown)
- Multiple real-world examples per pattern
- Product type hints to guide inference
- Emphasis on multiple packaging components

### 7. Unit Standardization

**Decision**: Let LLM standardize units, convert g→kg in frontend display.

**Rationale**:
- LLM handles variety (grams, kg, l, ml, pieces)
- Backend stores as-is
- Frontend normalizes for display

**Display Logic**:
```typescript
if (unit === 'g') {
  displayQuantity = quantity / 1000
  displayUnit = 'kg'
}
```

### 8. No Database (Yet)

**Decision**: In-memory array for MVP.

**Rationale**:
- Simplest possible start
- No database setup required
- Easy to test and iterate
- Can migrate later

**Limitations**:
- Data lost on restart
- No persistence
- Single user only
- No query optimization

**Migration Path**: 
- Add SQLite (easy, file-based)
- Or Supabase (hosted, free tier)
- Or PostgreSQL (production-ready)

## Common Gotchas

### 1. SSR vs Client-Only Code

**Issue**: `window`, `localStorage`, browser APIs don't exist during SSR.

**Solution**: Check `process.client`:
```typescript
if (process.client) {
  localStorage.setItem('language', language.value)
}
```

Or use `onMounted()`:
```typescript
onMounted(() => {
  // Safe to use browser APIs here
})
```

### 2. Reactive Array Mutations

**Issue**: Direct mutations don't trigger reactivity.

**Solution**: Create new objects/arrays:
```typescript
// ❌ Don't mutate
grouped.get(key).totalQuantity += item.quantity

// ✅ Create new object
grouped.set(key, {
  ...existing,
  totalQuantity: existing.totalQuantity + item.quantity
})
```

### 3. Async Composable Initialization

**Issue**: `fetchStock()` is async, but components render immediately.

**Solution**: Use `loading` ref:
```typescript
const { stock, loading, fetchStock } = useStock()

onMounted(() => {
  fetchStock()  // Sets loading = true, then false
})

// In template:
<div v-if="loading">Loading...</div>
<div v-else>{{ stock }}</div>
```

### 4. Date Serialization

**Issue**: Dates become strings when sent over network.

**Solution**: Convert back to Date objects:
```typescript
purchaseDate: new Date(item.purchaseDate),
createdAt: new Date(item.createdAt)
```

Or use Date strings consistently.

### 5. File Upload MIME Types

**Issue**: HEIC images from iPhone need special handling.

**Current**: Backend accepts any `mimeType`, passes to Gemini.

**Gotcha**: Gemini may not support all formats - test with real receipts.

### 6. Language Switch Timing

**Issue**: Language changes but displayed names don't update immediately.

**Solution**: Use computed property:
```typescript
const displayName = computed(() => getItemName(item, language.value))
```

Not:
```typescript
const displayName = getItemName(item, language.value)  // Won't react
```

### 7. Grouped Items Waste Categories

**Issue**: When grouping items, waste categories need to be merged carefully.

**Solution**: Use Set to avoid duplicates:
```typescript
const mergedWasteCategories = existing.wasteCategories || []
if (item.wasteCategories) {
  item.wasteCategories.forEach(cat => {
    if (!mergedWasteCategories.includes(cat)) {
      mergedWasteCategories.push(cat)
    }
  })
}
```

## Performance Considerations

### 1. Stock Grouping
- Computed property recalculates on every stock change
- O(n) operation where n = total items
- Fine for < 1000 items, consider optimization if more

### 2. Gemini API Calls
- Can be slow (2-5 seconds)
- Show loading indicator
- Consider timeout handling
- Rate limits apply (free tier: 15 requests/minute)

### 3. Image Uploads
- Large images = slow uploads
- Consider client-side compression
- Show upload progress

### 4. Re-renders
- Category filter triggers re-computation
- Uses `computed()` - should be efficient
- Avoid unnecessary watchers

## Security Considerations

### 1. API Key Exposure
- ✅ `GEMINI_API_KEY` in `.env` (server-only)
- ❌ Don't put API keys in frontend code
- ❌ Don't commit `.env` file

### 2. File Upload Validation
- Currently: Trusts client-provided MIME type
- TODO: Validate file size, type on backend
- TODO: Scan for malicious content

### 3. Input Sanitization
- Currently: Trusts LLM output
- TODO: Validate/sanitize product names
- TODO: Limit string lengths

### 4. Rate Limiting
- No rate limiting implemented
- Could abuse Gemini API quota
- TODO: Add per-IP rate limits

## Testing Strategy

### Manual Testing
1. **Receipt scanning**:
   - Test with real receipt images
   - Verify multi-language extraction
   - Check category assignments
   - Validate waste categories

2. **Stock operations**:
   - Add items
   - View grouped items
   - Filter by category
   - Delete items (single & grouped)

3. **Language switching**:
   - Switch language
   - Verify names update
   - Check localStorage persistence

4. **Edge cases**:
   - Empty stock
   - Single item
   - Same item multiple times
   - Missing fields (no price, no unit)

### Automated Testing
- None currently
- Could add: Vitest for unit tests, Playwright for E2E

## Code Style Conventions

### Vue Components
- Composition API (not Options API)
- TypeScript with full types
- Props/Emits with TypeScript interfaces
- `<script setup>` syntax

### Naming
- Components: PascalCase (`AppHeader.vue`)
- Composables: camelCase starting with `use` (`useStock.ts`)
- Files: kebab-case or PascalCase (match component name)
- Variables: camelCase
- Constants: UPPER_SNAKE_CASE

### Code Organization
```vue
<template>
  <!-- Template -->
</template>

<script setup lang="ts">
// 1. Imports
// 2. Props/Emits definitions
// 3. Composables
// 4. Refs/Reactive state
// 5. Computed properties
// 6. Methods/Functions
// 7. Lifecycle hooks
// 8. Watchers
</script>

<style scoped>
/* Component-specific styles */
</style>
```

### Styling
- Tailwind utility classes (inline)
- Avoid `<style>` blocks unless necessary
- Use design system patterns (see ui-patterns.md)
- Inline `font-family` for Poppins/Inter

## Debugging Tips

### 1. Check Browser Console
- Vue DevTools for component state
- Network tab for API calls
- Console for errors

### 2. Backend Logs
- Server logs show in terminal
- Check Gemini API responses
- Verify stock array contents

### 3. Common Issues

**Items not grouping?**
- Check `nameEn` values (case-sensitive)
- Verify units match exactly

**Language not switching?**
- Check computed property usage
- Verify localStorage in DevTools

**API failing?**
- Check `GEMINI_API_KEY` in `.env`
- Verify API key is valid
- Check rate limits

**Styling broken?**
- Tailwind classes misspelled?
- Missing Nuxt UI component import?
- Font not loading?

## Future Improvements

### High Priority
- [ ] Add database persistence
- [ ] Image compression before upload
- [ ] Better error handling & validation
- [ ] Unit tests for critical logic

### Medium Priority
- [ ] User authentication
- [ ] Receipt history
- [ ] Expiration date warnings
- [ ] Waste statistics dashboard
- [ ] Shopping list feature

### Low Priority
- [ ] Dark mode
- [ ] PWA/offline support
- [ ] Export data (CSV, PDF)
- [ ] Barcode scanning
- [ ] Multiple stores support
