# 🚀 billapp - Quick Start Guide

## Get Started in 30 Seconds

```bash
cd /home/norbert/Code/billapp
npm run dev
```

Open your browser to: **http://localhost:3000**

That's it! 🎉

---

## What You'll See

### 1. Home Page - Stock Inventory
- Beautiful header with "billapp" logo
- Empty state message (no items yet)
- "Scan Receipt" button ready to use

### 2. Click "Scan Receipt"
- Upload zone for drag-and-drop
- Click or drag an image/PDF file
- Mock OCR will parse items automatically

### 3. Review Items
- See extracted items (random samples for now)
- Remove items you don't want
- Click "Add to Stock"

### 4. Back to Home
- See your items in beautiful cards
- View stats: total items, quantity, value
- Edit or delete items as needed

---

## Try These Features

### ✅ Upload a Receipt
1. Click "Scan Receipt" button
2. Drop any image file (or click to browse)
3. Wait for parsing (~1 second)
4. Review the mock items
5. Click "Add All to Stock"

### ✅ Manage Stock
1. View all items on home page
2. Click the ⋮ menu on any card
3. Select "Delete" to remove
4. See stats update automatically

### ✅ Test Responsive Design
1. Open dev tools (F12)
2. Toggle device toolbar
3. Try mobile, tablet, desktop views
4. See layout adapt beautifully

### ✅ Explore UI Features
- Hover over cards (shadow grows)
- Hover over buttons (lift effect)
- Drag file over upload zone (blue highlight)
- Click navigation links (smooth transitions)

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl+R` | Refresh page |
| `F12` | Open developer tools |
| `Tab` | Navigate between elements |
| `Enter` | Activate buttons/links |
| `Esc` | Close dialogs/menus |

---

## File Structure Quick Reference

```
app/
├── app.vue              # Main layout
├── components/
│   └── AppHeader.vue    # Header with logo
├── pages/
│   ├── index.vue        # Home page (stock)
│   └── scan.vue         # Upload page
├── composables/
│   └── useStock.ts      # State management
└── types/
    └── index.ts         # TypeScript types

server/api/
├── stock/
│   ├── index.ts         # GET/POST items
│   └── [id].ts          # PATCH/DELETE item
└── receipts/
    └── parse.ts         # Upload & parse receipt
```

---

## Common Tasks

### Add Custom Items Manually
Currently not implemented, but you can:
1. Upload any receipt image
2. Get mock items back
3. Add them to stock

### Clear All Stock
Restart the dev server:
```bash
# Press Ctrl+C in terminal
# Then: npm run dev
```

### Change Colors
Edit `/tailwind.config.ts`:
```typescript
colors: {
  blue: { /* your blue shades */ },
  yellow: { /* your yellow shades */ }
}
```

### Customize Logo
Edit `/app/components/AppHeader.vue`:
- Line 15-20: SVG icon
- Line 30-40: Text and tagline

---

## Documentation Files

| File | What's Inside |
|------|---------------|
| `README.md` | Project overview |
| `PROJECT_SUMMARY.md` | Complete feature list |
| `DESIGN.md` | Design system specs |
| `DESIGN_SUMMARY.md` | Design implementation |
| `VISUAL_GUIDE.md` | Visual examples |
| `BEFORE_AFTER.md` | Design comparison |
| `LOGO.md` | Logo guidelines |
| `DEVELOPMENT.md` | Technical docs |
| `QUICK_START.md` | This file! |

---

## Troubleshooting

### Port Already in Use?
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use different port
npm run dev -- --port 3001
```

### Module Not Found?
```bash
rm -rf node_modules
npm install
```

### TypeScript Errors?
```bash
npm run dev
# Nuxt will regenerate type definitions
```

### Page Not Loading?
1. Check terminal for errors
2. Clear browser cache (Ctrl+Shift+R)
3. Try incognito/private mode

---

## Next Steps

### Make It Real
1. **Add Real OCR**: Integrate Google Vision or AWS Textract
2. **Add Database**: Connect PostgreSQL or MongoDB
3. **Add Auth**: Implement user login/signup
4. **Deploy**: Push to Vercel or Netlify

### Customize Design
1. Change colors in `tailwind.config.ts`
2. Modify logo in `AppHeader.vue`
3. Adjust spacing/sizing as needed
4. Add your own components

### Add Features
1. Camera scanning on mobile
2. Barcode/QR scanning
3. Expiration notifications
4. Shopping lists
5. Recipe suggestions
6. Data export

---

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Utilities
npm run generate         # Generate static site
npm run analyze          # Analyze bundle size
```

---

## Design Highlights to Notice

### 🎨 Visual Polish
- Gradient background (blue → white → yellow)
- Custom logo with yellow accent dot
- Card shadows that grow on hover
- Button lift effects on hover
- Smooth 200ms transitions

### 📱 Responsive Magic
- 3 columns on desktop
- 2 columns on tablet
- 1 column on mobile
- Hamburger menu on small screens
- Touch-friendly sizes everywhere

### ✨ Micro-interactions
- Upload zone turns blue when dragging
- Numbers in blue badges
- Icons everywhere for context
- Loading spinners with animations
- Toast notifications for feedback

---

## Have Fun! 🎉

Your billapp is ready to use. Play around with it, test the features, and enjoy the beautiful design!

**Questions?** Check the other documentation files for detailed information.

---

**Quick Links:**
- Dev Server: http://localhost:3000
- Documentation: See other .md files
- Nuxt Docs: https://nuxt.com
- Nuxt UI Docs: https://ui.nuxt.com
