# billapp Logo Reference

## ASCII Logo Preview

```
╔══════════════════════════════════════╗
║                                      ║
║   ┏━━━━━━━━┓                         ║
║   ┃        ┃  ●                      ║
║   ┃   📄   ┃                         ║
║   ┃        ┃   billapp               ║
║   ┗━━━━━━━━┛   Smart Receipt Manager ║
║                                      ║
╚══════════════════════════════════════╝

Icon Box: Gradient Blue (#2563eb → #1d4ed8)
Yellow Dot: #facc15 (top-right accent)
Receipt Icon: White document with lines
Text: "billapp" in Poppins Bold, Blue-900
Tagline: "Smart Receipt Manager" in Inter, Blue-600
```

## SVG Logo Code

The logo is implemented using SVG in the header component:

```vue
<!-- Receipt Icon Background -->
<div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl 
     flex items-center justify-center shadow-lg">
  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" 
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
</div>

<!-- Yellow accent dot -->
<div class="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white"></div>

<!-- Text -->
<div class="flex flex-col">
  <span class="text-2xl font-bold text-blue-900 tracking-tight" 
        style="font-family: 'Poppins', sans-serif;">
    billapp
  </span>
  <span class="text-xs text-blue-600 font-medium -mt-1" 
        style="font-family: 'Inter', sans-serif;">
    Smart Receipt Manager
  </span>
</div>
```

## Logo Variants

### Full Logo (Desktop)
```
┌─────────────────────────┐
│ [📄●] billapp          │
│      Smart Receipt Mgr │
└─────────────────────────┘
Width: Auto
Height: 48px (icon)
```

### Icon Only (Mobile/Favicon)
```
┌──────┐
│ 📄 ● │
└──────┘
Size: 48x48px
```

### Wordmark Only
```
billapp
Smart Receipt Manager
```

## Usage Guidelines

### Minimum Sizes
- Full Logo: 160px wide
- Icon Only: 32px × 32px
- Clear space: 8px around logo

### Colors
- **Primary**: Blue-600 to Blue-700 gradient
- **Accent**: Yellow-400 dot
- **Text**: Blue-900 for "billapp", Blue-600 for tagline
- **Background**: White or light backgrounds only

### Don'ts
- ❌ Don't change the gradient direction
- ❌ Don't remove the yellow accent dot
- ❌ Don't use on dark backgrounds without adjustment
- ❌ Don't distort proportions
- ❌ Don't use different fonts
- ❌ Don't add effects (drop shadows, glows, etc.)

## Icon Breakdown

The receipt icon represents:
- **Document shape**: Core functionality (receipts)
- **Folded corner**: Paper document feel
- **Horizontal lines**: Item lines on receipt
- **Blue gradient**: Professional, trustworthy
- **Yellow dot**: Energy, highlight, notification badge

## Brand Colors in Logo

```css
/* Icon gradient background */
background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);

/* Icon border radius */
border-radius: 0.75rem; /* 12px */

/* Yellow accent dot */
background: #facc15;

/* Text colors */
color-primary: #1e3a8a;   /* billapp */
color-secondary: #2563eb; /* tagline */
```

## Files

Logo is defined in:
- `/app/components/AppHeader.vue` - Main implementation
- Can be extracted to separate component: `/app/components/AppLogo.vue`

## Favicon (Future)

To create a favicon:
1. Extract the icon-only version
2. Render at 512×512px
3. Export as PNG and ICO
4. Place in `/public/favicon.ico`

## Social Media

For social media sharing (og:image):
1. Use full logo on white background
2. Add padding
3. Size: 1200×630px (Facebook/Twitter standard)
4. Export as PNG
