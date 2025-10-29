# File Structure

## Root Directory

```
billapp/
├── .ai-context/           # AI assistant documentation (this folder)
├── app/                   # Frontend application code
├── docs/                  # Project documentation
├── node_modules/          # Dependencies (ignored)
├── public/               # Static assets
├── server/               # Backend API code
├── *.md                  # Various documentation files
├── nuxt.config.ts        # Nuxt configuration
├── package.json          # Dependencies & scripts
└── tsconfig.json         # TypeScript configuration
```

## Frontend (`app/`)

```
app/
├── components/
│   ├── AppHeader.vue          # Top navigation bar with language selector
│   ├── ConfirmDialog.vue      # Reusable confirmation modal
│   ├── EntriesModal.vue       # Shows multiple entries for same product
│   └── ToastContainer.vue     # Toast notifications system
│
├── composables/
│   ├── useLanguage.ts         # Language preference management
│   └── useStock.ts            # Stock data management & API calls
│
├── pages/
│   ├── index.vue              # Home - Stock inventory view
│   ├── recipes.vue            # Recipe generation page
│   └── scan.vue               # Receipt scanning & review page
│
├── types/
│   └── index.ts               # TypeScript interfaces (StockItem, ParsedItem, etc.)
│
└── app.vue                    # Root component with layout structure
```

## Backend (`server/`)

```
server/
└── api/
    ├── receipts/
    │   └── parse.ts           # POST /api/receipts/parse - Parse receipt images
    │
    ├── recipes/
    │   └── generate.ts        # POST /api/recipes/generate - Generate recipe suggestions
    │
    └── stock/
        ├── index.ts           # GET/POST /api/stock - List & add items
        └── [id].ts            # DELETE /api/stock/:id - Remove item
```

## Key Files Description

### Configuration

- **`nuxt.config.ts`**
  - Nuxt modules: `@nuxt/ui`, `@nuxt/fonts`, `@nuxt/icon`
  - TypeScript strict mode enabled
  - App configuration (title, meta tags)

- **`package.json`**
  - Scripts: dev, build, preview
  - Dependencies: nuxt, vue, @google/generative-ai
  - Dev dependencies: typescript, vue-tsc

- **`tsconfig.json`**
  - Extends Nuxt's TypeScript config
  - Strict mode enabled

### Frontend Components

- **`AppHeader.vue`** (Layout)
  - Gradient header with app logo
  - Navigation links (Stock, Scan, Recipes)
  - Language selector dropdown (EN/DE/HU)
  - Mobile-responsive hamburger menu

- **`ConfirmDialog.vue`** (Modal)
  - Reusable confirmation dialog
  - Props: isOpen, title, message
  - Emits: confirm, cancel
  - Used for delete confirmations

- **`EntriesModal.vue`** (Modal)
  - Shows all entries for a grouped product
  - Displays quantity, price, dates, categories per entry
  - Allows deleting individual entries
  - Calculates totals

- **`ToastContainer.vue`** (Notifications)
  - Fixed position toast notification system
  - Auto-dismiss after 5 seconds
  - Color-coded: green (success), red (error), blue (info)
  - Global instance accessible via `window.__toastInstance`

### Frontend Pages

- **`app/pages/index.vue`** (Home/Stock Page)
  - Main inventory view
  - Groups items by nameEn + unit
  - Category filter buttons
  - Stats overview (items, quantity, value)
  - Product cards with waste badges
  - Delete functionality with confirmation

- **`app/pages/scan.vue`** (Receipt Scanning)
  - File upload area (drag & drop)
  - Provider selector (Gemini/ChatGPT/Dummy)
  - Receipt preview
  - Editable items table after parsing
  - Add to stock functionality
  - Progress indicators

- **`app/pages/recipes.vue`** (Recipe Generation)
  - Experimental feature
  - Lists stock ingredients
  - Sends to Gemini for recipe suggestions
  - Shows AI-generated recipes

### Frontend Composables

- **`useStock.ts`**
  - Reactive stock array
  - `fetchStock()` - GET from API
  - `addToStock(items)` - POST to API
  - `deleteStockItem(id)` - DELETE from API
  - `getItemName(item, lang)` - Get translated name
  - Error handling with toast notifications

- **`useLanguage.ts`**
  - Reactive language ref ('en' | 'de' | 'hu')
  - Persists to localStorage
  - Provides language switching

### Backend API Endpoints

- **`server/api/receipts/parse.ts`**
  - Accepts multipart form data (image file)
  - Query param: `provider` (gemini/chatgpt/dummy)
  - Sends to Gemini Vision API
  - Parses JSON response
  - Adds categories and waste info
  - Returns ParsedItem[]

- **`server/api/recipes/generate.ts`**
  - Accepts JSON body with ingredients
  - Sends to Gemini for recipe generation
  - Returns recipe suggestions

- **`server/api/stock/index.ts`**
  - GET: Returns all stock items
  - POST: Adds items to stock (creates new entries, doesn't merge)
  - Uses in-memory array `stockItems`

- **`server/api/stock/[id].ts`**
  - DELETE: Removes item by ID from stock array

### Types

- **`app/types/index.ts`**
  - `StockItem` - Inventory item with ID, names, quantity, dates, categories
  - `ParsedItem` - Parsed receipt item (no ID, no dates)
  - `Receipt` - Receipt metadata with items array

## Static Assets (`public/`)

Currently empty - could contain:
- App icons/logos
- Sample receipt images
- Manifest files

## Documentation

- **Root level `.md` files**
  - `README.md` - Main project documentation
  - `DESIGN.md` - Design decisions and UI philosophy
  - `DEVELOPMENT.md` - Development setup guide
  - `GEMINI_INTEGRATION.md` - AI integration details
  - `WASTE_CATEGORIES_IMPROVEMENTS.md` - Recent waste feature changes
  - Various other documentation files

## Generated/Ignored

- `node_modules/` - NPM packages
- `.nuxt/` - Nuxt build cache
- `.output/` - Production build output
- `.env` - Environment variables (not committed)
