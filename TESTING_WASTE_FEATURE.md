# Testing the Waste Management Feature

## Quick Test Steps

### Option 1: Clear Stock and Scan New Receipt (Easiest)

1. **Restart your dev server:**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. **Open the app** at http://localhost:3001

3. **Clear existing stock:**
   - Go to your stock page
   - Delete all existing items (they don't have waste categories)

4. **Scan a new receipt OR use dummy provider:**
   - Go to `/scan` page
   - Upload any receipt image
   - Choose "Dummy Provider" from the dropdown
   - Submit

5. **Check the results:**
   - You should now see TWO badges on each product card:
     - First badge: Product category (e.g., "Fruits", "Dairy")
     - Second badge: Waste category (e.g., "Plastic", "Organic", "Paper")
   - Each waste category has unique colors and icons

### Option 2: Direct API Test

If you want to verify the API is working without the UI:

```bash
# Create a dummy image file
touch /tmp/test.jpg

# Test the API
curl -X POST "http://localhost:3001/api/receipts/parse?provider=dummy" \
  -F "file=@/tmp/test.jpg" | jq '.items[0]'
```

You should see output like:
```json
{
  "nameEn": "Organic Apples",
  "nameDe": "Bio Äpfel",
  "nameHu": "Bio Alma",
  "quantity": 1.5,
  "unit": "kg",
  "price": 4.99,
  "category": "Fruits",
  "wasteCategory": "Organic"  ← NEW FIELD!
}
```

## What to Look For

### Visual Indicators:
- **Two separate badges** on each product card
- **Product category badge** (existing):
  - Green for Vegetables
  - Orange for Fruits
  - Red for Meat
  - Blue for Dairy
  - etc.

- **Waste category badge** (NEW):
  - 🟡 Yellow with beaker icon = Plastic
  - 💚 Emerald with sparkles icon = Glass
  - 🟠 Amber with document icon = Paper
  - ⚫ Slate with cube icon = Metal
  - 🟢 Lime with leaf icon = Organic
  - 🟠 Orange with squares+ icon = Mixed

### In the Entries Modal:
- Click the "X entries" badge on any product
- You'll see waste category listed for each entry

## Troubleshooting

**Problem:** I don't see waste categories
**Solution:** 
- Make sure you restarted the dev server
- Clear your stock (old items don't have waste categories)
- Scan a new receipt or use dummy provider

**Problem:** Badges overlap or look weird
**Solution:**
- The badges should wrap properly on mobile
- Try resizing your browser window

**Problem:** API returns null for wasteCategory
**Solution:**
- Check that you're using the latest code
- Rebuild: `npm run build`
- Restart dev server

## Example Products from Dummy Provider

| Product | Category | Waste Category |
|---------|----------|----------------|
| Organic Apples | Fruits | Organic (loose) |
| Whole Milk | Dairy | Mixed (Tetra Pak) |
| Bread | Bakery | Paper (bag) |
| Eggs | Dairy | Paper (carton) |
| Chicken Breast | Meat | Plastic (tray) |
| Tomatoes | Vegetables | Organic (loose) |
| Orange Juice | Beverages | Mixed (Tetra Pak) |
| Butter | Dairy | Paper (wrapper) |
| Pasta | Pantry | Plastic (bag) |
| Cheese | Dairy | Plastic (wrapped) |
