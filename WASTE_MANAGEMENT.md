# Waste Management Feature

## Overview
The billapp now includes smart waste management categorization based on packaging types. This helps users track and manage waste generated from their grocery purchases.

## Features

### Waste Categories
The system categorizes products into 6 waste types:
- **Plastic** (Yellow badge) - bottles, bags, wrapped items, trays
- **Glass** (Emerald badge) - glass bottles, jars
- **Paper** (Amber badge) - cardboard boxes, paper bags, egg cartons
- **Metal** (Slate badge) - cans, aluminum foil
- **Organic** (Lime badge) - loose fresh produce without packaging
- **Mixed** (Orange badge) - Tetra Pak, composite materials

### Visual Design
Each waste category has:
- **Color-coded badges** with distinct colors and borders
- **Unique icons**:
  - Plastic: Beaker icon
  - Glass: Sparkles icon
  - Paper: Document icon
  - Metal: Cube icon
  - Organic: Leaf icon
  - Mixed: Squares-plus icon

### Integration

#### 1. LLM Detection
The LLM now analyzes:
- Store name and type
- Product name and description
- Common packaging patterns

Example prompts include:
- "Milk 1L" → Plastic or Mixed (Tetra Pak)
- "Cheese sliced 200g" → Plastic
- "Tomatoes 500g" → Organic (loose) or Plastic
- "Beer bottle" → Glass
- "Tuna can" → Metal

#### 2. Display Locations
Waste categories appear:
- On product cards in the main stock view (next to product category)
- In the entries modal when viewing multiple entries of the same item

#### 3. Default Behavior
If the LLM cannot determine packaging, the system defaults to "Plastic" as it's the most common packaging type.

## Technical Implementation

### Type Definitions
```typescript
interface StockItem {
  wasteCategory?: string
}

interface ParsedItem {
  wasteCategory?: string
}
```

### Backend Processing
- `categorizeWaste()` function processes packaging info from LLM
- Keywords-based fallback for consistent categorization
- Integrated with existing receipt parsing pipeline

### Frontend Display
- Badge components with conditional styling
- Icon mapping for visual clarity
- Separated from main category badges to avoid confusion

## Usage
When scanning a receipt, the system automatically:
1. LLM analyzes product and store context
2. Determines packaging type
3. Categorizes into waste type
4. Displays badge on product cards

No user action required - fully automatic!
