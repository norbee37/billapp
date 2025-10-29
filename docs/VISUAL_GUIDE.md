# billapp - Visual Showcase

## 🎨 Brand Identity

### Logo Design
```
┌────────────────────────────────┐
│  ┌──────┐                      │
│  │ 📄 ●  │  billapp            │
│  └──────┘  Smart Receipt Mgr   │
└────────────────────────────────┘

Icon: Receipt document in gradient blue (2563eb → 1d4ed8)
Accent: Yellow dot (#facc15) top-right
Font: Poppins Bold for "billapp"
      Inter Medium for tagline
```

## 🎨 Color Palette

### Primary - Blue
```
┌─────────┬─────────┬─────────┬─────────┐
│ #eff6ff │ #dbeafe │ #2563eb │ #1e3a8a │
│  50     │  100    │  600    │  900    │
│ Light   │ Cards   │ Primary │ Headings│
└─────────┴─────────┴─────────┴─────────┘
```

### Secondary - Yellow
```
┌─────────┬─────────┬─────────┐
│ #fef9c3 │ #facc15 │ #eab308 │
│  100    │  400    │  500    │
│ Light   │ Accent  │ Badges  │
└─────────┴─────────┴─────────┘
```

### Background
```
Gradient: blue-50 → white → yellow-50
Direction: ↘️ (bottom-right)
```

## 📱 UI Components

### Header
```
┌─────────────────────────────────────────────────┐
│ [📄●] billapp          [Stock] [Scan]  [+ Scan] │
│      Smart Receipt Mgr                          │
└─────────────────────────────────────────────────┘
Height: 80px
Background: White with shadow
Logo: Receipt icon + wordmark
```

### Stock Card
```
┌────────────────────────────────┐
│  Organic Apples          [⋮]  │
│  🏷️ Fruits                     │
│                                │
│  📦 Quantity: 1.5 kg           │
│  💵 Price: $4.99               │
│  📅 Expires: Dec 25, 2024      │
│  🕐 Added: Dec 20, 2024        │
└────────────────────────────────┘
Background: White
Border: Gray-100 → Blue-200 (hover)
Shadow: Small → Large (hover)
```

### Stat Cards
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ 📦 12       │ │ 🛍️  45      │ │ 💵 $89.50   │
│ Total Items │ │ Total Qty   │ │ Total Value │
└──────────────┘ └──────────────┘ └──────────────┘
Icons: Blue-100 bg, Blue-600 color
Text: Poppins bold for numbers
```

### Upload Zone
```
┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐
│                                 │
│         📷●                     │
│                                 │
│      Upload Receipt             │
│   Click to browse or drag       │
│                                 │
│   [JPG] [PNG] [PDF]            │
│                                 │
└─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘
Border: Dashed gray-300
Hover: Blue-400 border + bg-blue-50
Icon: Large camera with yellow accent
```

### Parsed Item Card
```
┌────────────────────────────────────┐
│ [1] Organic Apples            [×] │
│     📦 1.5 kg  💵 $4.99           │
└────────────────────────────────────┘
Number Badge: Blue-600, white text
Background: Gradient blue-50 → white
Hover: Shadow appears
```

## 🎯 Button Styles

### Primary Action
```
┌─────────────────────┐
│  ➕  Scan Receipt   │
└─────────────────────┘
Background: Gradient blue-600 → blue-700
Hover: blue-700 → blue-800 + scale(1.05)
Shadow: Large with lift effect
Font: Poppins, weight 600
```

### Secondary
```
┌──────────────┐
│  ← Back     │
└──────────────┘
Background: Transparent
Hover: Gray-100
```

## 📐 Layout Structure

### Home Page (Stock)
```
┌─────────────────────────────────────┐
│           HEADER                    │
├─────────────────────────────────────┤
│  My Stock          [+ Scan Receipt] │
│  Manage your grocery inventory      │
│                                     │
│  [Stat] [Stat] [Stat]              │
│                                     │
│  ┌──────┐ ┌──────┐ ┌──────┐        │
│  │Card 1│ │Card 2│ │Card 3│        │
│  └──────┘ └──────┘ └──────┘        │
│  ┌──────┐ ┌──────┐ ┌──────┐        │
│  │Card 4│ │Card 5│ │Card 6│        │
│  └──────┘ └──────┘ └──────┘        │
└─────────────────────────────────────┘
```

### Scan Page
```
┌─────────────────────────────────────┐
│           HEADER                    │
├─────────────────────────────────────┤
│  [←] Scan Receipt                   │
│      Upload a receipt to extract    │
│                                     │
│  ┌───────────────────────────────┐ │
│  │                               │ │
│  │      [Upload Zone]            │ │
│  │                               │ │
│  └───────────────────────────────┘ │
│                                     │
│  ✅ Items Found (5)  [Add to Stock]│
│  ┌─────────────────────────────┐  │
│  │ [1] Item Name          [×]  │  │
│  │ [2] Item Name          [×]  │  │
│  │ [3] Item Name          [×]  │  │
│  └─────────────────────────────┘  │
└─────────────────────────────────────┘
```

## 🎬 Animations

### Hover Effects
- **Cards**: Shadow grows, border changes blue-100 → blue-200
- **Buttons**: Scale to 1.05, gradient shifts darker
- **Upload Zone**: Border color changes, slight background tint

### Loading States
- **Spinner**: Rotating border ring animation
- **Processing**: Pulse effect on upload zone

### Transitions
- **Duration**: 200ms (standard)
- **Easing**: Default ease
- **Properties**: all, transform, opacity

## 📱 Responsive Breakpoints

### Mobile (< 640px)
- Single column layout
- Full-width buttons
- Hamburger menu
- Stacked stat cards

### Tablet (640px - 1024px)
- 2 column grid
- Horizontal navigation
- Side-by-side elements

### Desktop (> 1024px)
- 3 column grid
- Full navigation bar
- Optimal spacing

## 🎨 Typography Scale

```
Page Title:    36px (4xl) Poppins Bold
Section Title: 24px (2xl) Poppins Bold
Card Title:    18px (lg)  Poppins Bold
Stat Value:    24px (2xl) Poppins Bold
Body Text:     16px (base) Inter Regular
Small Text:    14px (sm)  Inter Regular
Label Text:    12px (xs)  Inter Medium
```

## 🌟 Special Elements

### Empty State
```
        📥
   Your stock is empty
Start scanning receipts!
   [Scan First Receipt]
```

### Success Badge
```
┌──────┐
│  ✅  │  Items Found
└──────┘  5 items extracted
Green-100 background
Green-600 icon
```

### Error Message
```
┌────────────────────────────┐
│ ⚠️  Upload Failed         │
│     [Error description]    │
└────────────────────────────┘
Red-50 background
Red-600 icon and text
```

## 🎯 Design Principles

1. **Clarity**: Clear hierarchy and readable text
2. **Consistency**: Uniform spacing and components
3. **Feedback**: Visual responses to all interactions
4. **Simplicity**: Clean, uncluttered interface
5. **Delight**: Smooth animations and nice touches
6. **Accessibility**: High contrast and clear targets

## 🔤 Font Loading

Fonts are loaded from Google Fonts:
- **Poppins**: 400, 500, 600, 700, 800
- **Inter**: 300, 400, 500, 600

Preconnected for performance optimization.
