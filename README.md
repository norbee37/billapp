# billapp - Smart Receipt Manager

A beautiful, modern web application built with Nuxt 4 and Nuxt UI for scanning grocery receipts and managing your stock inventory.

![billapp](https://img.shields.io/badge/billapp-Smart_Receipt_Manager-2563eb?style=for-the-badge)
![Nuxt 4](https://img.shields.io/badge/Nuxt-4-00DC82?style=for-the-badge&logo=nuxt.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

## ✨ Features

- 📸 **Receipt Scanning**: Upload receipt images (JPG, PNG) or PDF files with drag-and-drop
- 🔍 **OCR Processing**: Automatic extraction of items from receipts (mock implementation)
- 📦 **Stock Management**: Track your grocery inventory in real-time
- 📊 **Dashboard Stats**: View total items, quantities, and values at a glance
- ✨ **Beautiful UI**: Modern design with blue/yellow color scheme and premium fonts
- 🚀 **Fast & Responsive**: Powered by Nuxt 4 with smooth animations
- 📱 **Mobile-First**: Fully responsive design for all devices

## 🎨 Design

billapp features a clean, modern interface with:
- **Color Scheme**: Blue primary, white background, yellow accents
- **Typography**: Poppins for headings, Inter for body text
- **Logo**: Custom receipt icon with yellow accent dot
- **Components**: Cards, buttons, and forms with hover effects and shadows
- **Animations**: Smooth transitions and loading states

See [DESIGN.md](DESIGN.md) for complete design system documentation.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key (free tier available)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY from https://aistudio.google.com/app/apikey

# Run development server
npm run dev
```

The app will be available at `http://localhost:3000`

**Note:** Without a Gemini API key, the app will use mock data for receipt parsing.

## Usage

1. **View Your Stock**: The home page displays all items in your inventory
2. **Scan Receipt**: Click "Scan Receipt" to upload a receipt image or PDF
3. **Review Parsed Items**: The app extracts items from your receipt (currently using mock data)
4. **Add to Stock**: Confirm and add all items to your inventory
5. **Manage Items**: Edit or delete items from your stock

## Project Structure

```
app/
├── pages/
│   ├── index.vue          # Stock overview page
│   └── scan.vue           # Receipt scanning page
├── composables/
│   └── useStock.ts        # Stock management composable
└── types/
    └── index.ts           # TypeScript type definitions

server/
└── api/
    ├── stock/
    │   ├── index.ts       # Stock CRUD operations
    │   └── [id].ts        # Individual item operations
    └── receipts/
        └── parse.ts       # Receipt parsing endpoint
```

## Next Steps (Future Enhancements)

- [ ] Add OpenAI GPT-4 Vision as alternative LLM provider
- [ ] Add UI toggle to switch between LLM providers
- [ ] Fine-tune prompts for better accuracy with cryptic receipts
- [ ] Add database persistence (MongoDB, PostgreSQL, etc.)
- [ ] Implement user authentication
- [ ] Add categories and filtering
- [ ] Expiration date tracking and notifications
- [ ] Shopping list generation based on stock levels
- [ ] Recipe suggestions based on available items
- [ ] Barcode scanning for quick item addition
- [ ] Export stock data (CSV, PDF)
- [ ] Multi-user support with sharing

## Technologies

- **Nuxt 4**: Vue.js framework
- **Nuxt UI**: Component library
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling (via Nuxt UI)
- **Google Gemini**: AI-powered receipt parsing

## Receipt Parsing

The app uses **Google Gemini 2.0 Flash** for intelligent receipt parsing:

1. Upload a receipt image (JPG, PNG)
2. Gemini analyzes the image and extracts:
   - Store name
   - Product names (expanded from abbreviations)
   - Quantities and units (kg, g, L, ml, pcs)
   - Individual item prices
3. Items are automatically categorized
4. Add to your stock with one click

**Prompting:** The parsing prompt is designed to handle cryptic receipt formats and can be iteratively improved. See `/server/api/receipts/parse.ts` to adjust the prompt for better accuracy.

**Free Tier:** Google Gemini offers 1M requests/day for free, perfect for personal use.

## Notes

**API Key Required**: Get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey) and add it to your `.env` file. Without it, the app will use mock data.

## License

MIT
