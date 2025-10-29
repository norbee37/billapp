# System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         BILLAPP SYSTEM                          │
└─────────────────────────────────────────────────────────────────┘

┌───────────────────────── FRONTEND (Nuxt 3) ────────────────────────┐
│                                                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────┐  │
│  │  Pages          │  │  Components     │  │  Composables     │  │
│  │  ─────────      │  │  ──────────     │  │  ───────────     │  │
│  │  • index.vue    │  │  • AppHeader    │  │  • useStock()    │  │
│  │  • scan.vue     │  │  • ConfirmDialog│  │  • useLanguage() │  │
│  │  • recipes.vue  │  │  • EntriesModal │  │                  │  │
│  │                 │  │  • ToastContainer│  │                  │  │
│  └─────────────────┘  └─────────────────┘  └──────────────────┘  │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐│
│  │                    Types (TypeScript)                         ││
│  │  • StockItem  • ParsedItem  • Receipt                         ││
│  └───────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
                                  ↕ HTTP
┌────────────────────── BACKEND (Nitro/h3) ─────────────────────────┐
│                                                                     │
│  ┌──────────────────────────── API Routes ─────────────────────┐  │
│  │                                                              │  │
│  │  POST /api/receipts/parse                                   │  │
│  │  ├─ Accepts: Image (multipart/form-data)                    │  │
│  │  └─ Returns: ParsedItem[]                                   │  │
│  │                                                              │  │
│  │  GET /api/stock                                             │  │
│  │  └─ Returns: StockItem[]                                    │  │
│  │                                                              │  │
│  │  POST /api/stock                                            │  │
│  │  ├─ Accepts: { items: ParsedItem[] }                        │  │
│  │  └─ Returns: StockItem[]                                    │  │
│  │                                                              │  │
│  │  DELETE /api/stock/:id                                      │  │
│  │  └─ Returns: { success: true }                              │  │
│  │                                                              │  │
│  │  POST /api/recipes/generate                                 │  │
│  │  ├─ Accepts: { ingredients: string[] }                      │  │
│  │  └─ Returns: { recipes: string }                            │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │              In-Memory Storage                               │ │
│  │              stockItems: StockItem[]                         │ │
│  └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                  ↕ API Calls
┌─────────────────────── EXTERNAL SERVICES ──────────────────────────┐
│                                                                     │
│  ┌───────────────────────────────────────────────────────────┐    │
│  │              Google Gemini API                            │    │
│  │              (2.0 Flash Exp)                              │    │
│  │  • Receipt image → structured JSON                        │    │
│  │  • Recipe generation                                      │    │
│  └───────────────────────────────────────────────────────────┘    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘


DATA FLOW - Receipt Scanning:
═══════════════════════════════

1. User uploads receipt image → scan.vue
2. Image sent to → POST /api/receipts/parse
3. Server sends image to → Google Gemini API
4. Gemini returns JSON with products
5. Server categorizes & adds waste info
6. Returns ParsedItem[] to → scan.vue
7. User reviews/edits items
8. Click "Add to Stock"
9. Send to → POST /api/stock
10. Server creates StockItem[] with IDs
11. Returns to frontend
12. Navigate to → index.vue (stock page)


DATA FLOW - Stock View:
═══════════════════════

1. index.vue loads → fetchStock()
2. GET /api/stock → returns StockItem[]
3. Frontend groups by nameEn + unit
4. Displays grouped items with totals
5. User can filter by category
6. User can delete items/groups


KEY FEATURES:
═════════════

✓ Multi-language (EN/DE/HU) - stored in every item
✓ Multiple waste categories per product
✓ Category auto-detection (keyword-based)
✓ Multi-entry support (separate entries, grouped display)
✓ No database (in-memory storage)
✓ Mobile-responsive UI
✓ Toast notifications
✓ Playful design with gradients
