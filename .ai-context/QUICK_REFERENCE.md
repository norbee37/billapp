# Quick Reference Card

> Ultra-fast lookup for common tasks

## 📂 Key Files

```
app/
  types/index.ts              → StockItem, ParsedItem interfaces
  pages/index.vue             → Stock inventory page
  pages/scan.vue              → Receipt scanning
  composables/useStock.ts     → Stock management logic
  
server/api/
  receipts/parse.ts           → Receipt parsing with Gemini
  stock/index.ts              → GET/POST stock items
  stock/[id].ts               → DELETE stock item
```

## 🔧 Common Tasks

### Add New API Endpoint
1. Create file in `server/api/`
2. Use `defineEventHandler()`
3. Update `api-endpoints.md`

### Add New Component
1. Create in `app/components/`
2. Use `<script setup lang="ts">`
3. Follow patterns in `ui-patterns.md`

### Modify Data Model
1. Update `app/types/index.ts`
2. Update backend handlers
3. Update `data-models.md`

### Change UI Styling
1. Use Tailwind classes
2. Follow design system in `ui-patterns.md`
3. Use Poppins for headings, Inter for body

## 🎨 Color Quick Reference

```typescript
// Waste Categories
'Plastic': 'bg-red-100 text-red-700 border-red-200'
'Glass': 'bg-cyan-100 text-cyan-700 border-cyan-200'
'Paper': 'bg-amber-100 text-amber-700 border-amber-200'
'Metal': 'bg-slate-100 text-slate-700 border-slate-200'
'Organic': 'bg-green-100 text-green-700 border-green-200'
'Mixed': 'bg-purple-100 text-purple-700 border-purple-200'
```

## 📊 Data Flow

```
Image → /api/receipts/parse → Gemini → ParsedItem[]
                                            ↓
                                    User reviews
                                            ↓
                                    /api/stock (POST)
                                            ↓
                                     StockItem[] (with IDs)
                                            ↓
                                    /api/stock (GET)
                                            ↓
                                  Frontend groups & displays
```

## 🔑 Key Concepts

**Grouping**: Items grouped by `nameEn.toLowerCase()_${unit}`  
**Languages**: All stored (EN/DE/HU), `nameEn` is canonical  
**Waste**: Array of categories (multi-material)  
**Storage**: In-memory (no persistence)  
**Multi-entry**: Separate entries, grouped in UI  

## 🚨 Common Gotchas

- ❌ Don't group by translated name → use `nameEn`
- ❌ Don't use `window` in SSR → check `process.client`
- ❌ Don't mutate arrays → create new objects
- ✅ Always use computed for reactive data
- ✅ Check `loading` state before displaying
- ✅ wasteCategories is ARRAY not string

## 📝 After Changes

```bash
# Always update:
.ai-context/changelog.md

# If relevant:
data-models.md         # Type changes
api-endpoints.md       # API changes
ui-patterns.md         # New patterns
implementation-notes.md # Important decisions
```

## 🧪 Testing

```bash
npm run dev              # Start dev server
npx tsc --noEmit        # Type check
# Manual testing in browser
```

## 🎯 Current State

- ✅ Receipt scanning (Gemini)
- ✅ Multi-language (EN/DE/HU)
- ✅ Stock management
- ✅ Multiple waste categories
- ❌ No database (in-memory only)
- ❌ No authentication
- ❌ No persistence
