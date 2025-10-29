# Waste Categories Improvements

## Summary
Enhanced waste category prediction and UI to support multiple waste labels per product, improving accuracy for real-world packaging that often consists of multiple materials.

## Key Changes

### 1. **Multiple Waste Categories Support**
- Changed `wasteCategory` (string) to `wasteCategories` (string array) in types
- Products can now have multiple waste labels (e.g., plastic wrap + paper label)
- Updated both `StockItem` and `ParsedItem` interfaces

### 2. **Improved LLM Prompt**
Enhanced the Gemini prompt with:
- **Detailed packaging examples** for common products
- **Emphasis on multiple packaging components** (outer box, inner wrap, lids, labels)
- **Real-world scenarios** like:
  - Milk cartons: ["mixed", "plastic"] (Tetra Pak + cap)
  - Cheese: ["plastic", "paper"] (wrap + label)
  - Beer bottles: ["glass", "metal", "paper"] (bottle + cap + label)
  - Yogurt: ["plastic", "paper"] (cup + lid)
- **Product type hints** to help LLM infer typical packaging
- **Clear instruction format** to return packaging as arrays

### 3. **Enhanced UI Design**

#### Product Cards (Main Stock View)
- **Visual grouping** for waste categories in a dedicated section
- **Gray background box** with border to group waste badges
- **Better layout**: 
  - Product name on its own line
  - Badges (entries count, category) in a separate row
  - Waste categories in their own contained section below
- **Distinctive colors** for each waste type:
  - 🔴 **Plastic**: Red tones
  - 🔵 **Glass**: Cyan tones  
  - 🟡 **Paper**: Amber tones
  - ⚫ **Metal**: Slate tones
  - 🟢 **Organic**: Green tones
  - 🟣 **Mixed**: Purple tones
- **Icons** for each waste category type
- **Borders** on badges for better definition

#### Entries Modal
- Shows all waste categories for each entry
- Similar visual grouping with gray background
- Displays multiple badges with icons
- Consistent color scheme

### 4. **Backend Updates**

#### `categorizeWaste()` Function
- Now returns an array of waste categories
- Collects ALL matching categories (not just first match)
- Better handles products with multiple packaging types

#### Stock Grouping Logic
- Merges waste categories when grouping items
- Ensures unique categories only
- Maintains all waste types across multiple entries

#### Backward Compatibility
- Stock API handles both old `wasteCategory` (string) and new `wasteCategories` (array)
- Gracefully migrates old data format

## Testing Recommendations

1. **Scan receipts** with various products:
   - Dairy items (milk, cheese, yogurt)
   - Beverages (juice cartons, glass bottles, cans)
   - Meat/fish (plastic trays with labels)
   - Bakery (paper bags with plastic windows)
   - Loose produce (organic - no packaging)

2. **Verify UI**:
   - Multiple waste badges display correctly
   - Colors are distinctive and easy to read
   - Visual grouping makes waste section stand out
   - Icons are appropriate for each waste type

3. **Check LLM predictions**:
   - Products should have realistic packaging arrays
   - Complex products (like beer bottles) should show multiple types
   - Simple products (like loose apples) should show single type

## Benefits

✅ **More accurate waste tracking** - reflects real-world packaging complexity
✅ **Better LLM guidance** - detailed examples improve predictions
✅ **Clearer UI** - visual grouping and distinctive colors
✅ **Better UX** - easier to see all waste components at a glance
✅ **Recyclability insights** - users can see if products have mixed materials (harder to recycle)

## Future Enhancements

- Add waste statistics (% of each waste type in stock)
- Filter/search by waste category
- Waste disposal tips per category
- Warnings for products with excessive packaging
- Track waste reduction over time
