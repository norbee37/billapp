# Project Overview

## Project Name
**BillApp** - Grocery Inventory Management with AI Receipt Parsing

## Description
A Nuxt 3 web application that helps users manage their grocery inventory by scanning receipts. Uses AI (Google Gemini) to extract items from receipt images and automatically categorizes them with waste management information.

## Tech Stack

### Frontend
- **Nuxt 3** (v4.1.3) - Vue.js meta-framework
- **Vue 3** (v3.5.22) - Composition API with TypeScript
- **TypeScript** - Full type safety
- **Nuxt UI** - Component library (built on Radix Vue)
- **Tailwind CSS** - Utility-first styling
- **Google Fonts** - Poppins (headings), Inter (body)

### Backend
- **Nuxt Server (Nitro)** - API routes with h3
- **Google Generative AI** - Gemini 2.0 Flash for receipt parsing
- **In-memory storage** - StockItems array (no database yet)

### Development
- **Vite** - Build tool and dev server
- **ESLint** - Code linting
- **TypeScript Compiler** - Type checking

## Core Features

1. **Receipt Scanning**
   - Upload receipt images (JPEG, PNG, HEIC)
   - AI extracts products with names, quantities, prices, categories
   - Multi-language support (English, German, Hungarian)
   - Automatic waste category detection

2. **Stock Management**
   - View all inventory items grouped by product
   - Filter by product category
   - Track quantities, prices, expiration dates
   - Multi-entry support (same product from different receipts)

3. **Waste Management**
   - Multiple waste categories per product
   - Visual badges with color coding
   - 6 waste types: Plastic, Glass, Paper, Metal, Organic, Mixed

4. **Multi-language**
   - Products stored in 3 languages (EN, DE, HU)
   - User can switch language preference
   - UI adapts to show correct translation

5. **Recipe Generation** (experimental)
   - AI suggests recipes based on available ingredients
   - Uses Google Gemini to generate ideas

## Architecture

### Frontend Structure
```
app/
├── components/       # Vue components
├── composables/      # Reusable logic (useStock, useLanguage)
├── pages/            # Route pages (index, scan, recipes)
├── types/            # TypeScript interfaces
└── app.vue           # Root component with layout
```

### Backend Structure
```
server/
└── api/
    ├── receipts/
    │   └── parse.ts      # POST - Parse receipt image
    ├── recipes/
    │   └── generate.ts   # POST - Generate recipes
    └── stock/
        ├── index.ts      # GET/POST - List/add items
        └── [id].ts       # DELETE - Remove item
```

## Data Flow

1. **User uploads receipt** → `/scan` page
2. **Image sent to** → `/api/receipts/parse`
3. **Gemini processes** → Returns structured JSON
4. **Backend categorizes** → Adds category + waste info
5. **User reviews items** → Can edit before saving
6. **Items saved to** → In-memory stock array
7. **View inventory** → `/` (home) page

## Environment Variables

```bash
GEMINI_API_KEY=your_key_here  # Required for AI features
```

## Development Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Build for production
npm run preview      # Preview production build
npx tsc --noEmit     # Type check without building
```

## Design Philosophy

- **Playful & Modern** - Colorful gradients, rounded corners, smooth animations
- **Mobile-first** - Responsive design that works on all devices
- **Clear Hierarchy** - Bold headings (Poppins), readable body (Inter)
- **Visual Feedback** - Toasts, loading states, hover effects
- **Accessibility** - Semantic HTML, keyboard navigation, ARIA labels

## Key Patterns

- **Composables** for shared logic (useStock, useLanguage)
- **Type-safe** API calls with TypeScript interfaces
- **Component-based** UI with reusable pieces
- **Optimistic updates** for better UX
- **Error handling** with user-friendly messages

## Current Limitations

- **No persistence** - Data lost on server restart (in-memory only)
- **No authentication** - Single user assumed
- **No image storage** - Receipts not saved after parsing
- **Basic recipe feature** - Not fully integrated with stock

## Future Considerations

- Add database (SQLite, PostgreSQL, or Supabase)
- User authentication
- Receipt history
- Better recipe integration
- Shopping list feature
- Waste analytics/statistics
- Export functionality
