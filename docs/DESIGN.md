# billapp - Design System Documentation

## Brand Identity

### Logo
The billapp logo consists of:
- **Icon**: A receipt document icon in a blue gradient box
- **Accent**: A yellow dot in the top-right corner
- **Typography**: "billapp" in bold Poppins font
- **Tagline**: "Smart Receipt Manager" in Inter font

### Color Palette

#### Primary Colors
- **Blue**: Main brand color
  - `#2563eb` (blue-600) - Primary actions, headers
  - `#1d4ed8` (blue-700) - Hover states
  - `#1e3a8a` (blue-900) - Text headings
  - `#eff6ff` (blue-50) - Light backgrounds
  - `#dbeafe` (blue-100) - Cards and accents

#### Secondary Colors
- **Yellow**: Accent color for highlights
  - `#facc15` (yellow-400) - Main accent
  - `#eab308` (yellow-500) - Badges and highlights
  - `#fef9c3` (yellow-100) - Light accents

#### Neutral Colors
- **White**: `#ffffff` - Main background
- **Gray**: Cool gray scale for text and borders

### Typography

#### Font Families
1. **Poppins** (Display/Headings)
   - Weights: 400, 500, 600, 700, 800
   - Usage: Headings, buttons, numbers, brand elements
   - Imported from Google Fonts

2. **Inter** (Body/UI)
   - Weights: 300, 400, 500, 600
   - Usage: Body text, labels, descriptions
   - Imported from Google Fonts

#### Typography Scale
- **Page Title**: 4xl (36px) - Bold Poppins
- **Section Title**: 2xl (24px) - Bold Poppins
- **Card Title**: lg (18px) - Bold Poppins
- **Body**: base (16px) - Regular Inter
- **Small**: sm (14px) - Regular Inter
- **Tiny**: xs (12px) - Medium Inter

## Components

### Header
- **Background**: White with shadow and blue border
- **Height**: 80px (h-20)
- **Logo**: Receipt icon + "billapp" wordmark
- **Navigation**: Desktop horizontal, mobile hamburger
- **Actions**: Primary CTA button (gradient blue)
- **Position**: Sticky top

### Buttons

#### Primary Action Button
```css
Background: Linear gradient (blue-600 to blue-700)
Hover: blue-700 to blue-800
Shadow: Large with hover lift effect
Font: Poppins, weight 600
Border Radius: Default (0.5rem)
Padding: Large (xl size)
Transform: Scale 1.05 on hover
```

#### Secondary Button
```css
Background: Transparent
Border: Gray
Hover: Gray background
```

### Cards

#### Stock Card
- **Background**: White
- **Border**: Gray-100 with blue-200 on hover
- **Border Radius**: 2xl (1rem)
- **Padding**: 6 (1.5rem)
- **Shadow**: Small, large on hover
- **Hover**: Lift effect with shadow

#### Stat Card
- **Layout**: Horizontal flex with icon
- **Icon Container**: Colored background (blue/yellow/green)
- **Size**: Square 14 (3.5rem)
- **Border Radius**: xl (0.75rem)

### Upload Zone

#### Default State
- **Border**: 3px dashed gray-300
- **Border Radius**: 2xl (1rem)
- **Padding**: 12 (3rem)
- **Hover**: Blue border with light blue background

#### Dragging State
- **Border**: Blue-500
- **Background**: Blue-50
- **Transform**: Scale 1.02

#### Uploading State
- **Border**: Blue-300
- **Background**: Blue-50
- **Icon**: Spinning animation

### Icons
- **Library**: Heroicons
- **Sizes**: 
  - Small: text-sm
  - Medium: text-xl
  - Large: text-4xl to text-7xl
- **Colors**: Match context (blue for primary, gray for neutral)

## Layout

### Page Structure
```
Header (sticky)
└── Container
    └── Content (py-8)
        └── Max Width (varies by page)
```

### Grid System
- **Stock Grid**: 1 column mobile, 2 tablet, 3 desktop
- **Stat Cards**: 1 column mobile, 3 columns desktop
- **Gap**: 4-5 (1rem - 1.25rem)

### Spacing Scale
- **Section Gap**: 8 (2rem)
- **Card Padding**: 4-6 (1rem - 1.5rem)
- **Element Gap**: 2-4 (0.5rem - 1rem)

## Backgrounds

### App Background
```css
Gradient: Blue-50 → White → Yellow-50
Direction: Bottom-right diagonal
```

### Card Backgrounds
- **Primary**: White
- **Accents**: Blue-50, Yellow-50, Green-50 (for icons)
- **States**: Red-50 for errors, Green-50 for success

## Shadows

### Elevation System
1. **sm**: Small shadow for cards at rest
2. **md**: Medium shadow for hover states
3. **lg**: Large shadow for primary actions
4. **xl**: Extra large for active states

## Animations & Transitions

### Standard Transition
```css
transition-all duration-200
```

### Hover Effects
- **Cards**: Shadow + border color change
- **Buttons**: Background gradient shift + scale 1.05
- **Icons**: Opacity changes

### Loading States
- **Spinner**: Border spin animation
- **Pulse**: Opacity pulse for loading cards

## Responsive Breakpoints

### Tailwind Defaults
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px

### Layout Adaptations
- **Header**: Full nav on md+, hamburger on mobile
- **Grid**: 1 col mobile, 2 col md, 3 col lg
- **Buttons**: Full width mobile, auto desktop
- **Text**: Smaller headings on mobile

## Special Elements

### Number Badges
- **Background**: Blue-600
- **Text**: White
- **Shape**: Rounded square (lg)
- **Font**: Poppins Bold
- **Size**: 40x40px

### Category Badges
- **Background**: Blue-50
- **Text**: Blue-700
- **Font**: Inter Medium
- **Size**: xs (12px)
- **Padding**: px-2 py-1

### Success Badge
- **Background**: Green-100
- **Icon Color**: Green-600
- **Shape**: Rounded xl
- **Size**: 48x48px

## Usage Guidelines

### Do's ✅
- Use Poppins for all headings and numbers
- Use Inter for body text and descriptions
- Maintain consistent spacing (8, 6, 4, 2)
- Apply hover effects to interactive elements
- Use blue gradients for primary actions
- Add yellow accents sparingly for highlights
- Keep card borders subtle (gray-100)
- Use shadows to indicate elevation

### Don'ts ❌
- Don't mix font families within same context
- Don't use flat colors for primary buttons
- Don't forget hover states on clickable items
- Don't overuse yellow (accent only)
- Don't use heavy shadows everywhere
- Don't make borders too prominent
- Don't forget mobile responsiveness

## Accessibility

### Color Contrast
- All text meets WCAG AA standards
- Blue-900 on white: High contrast
- Yellow-400: Accent only, not for text

### Interactive Elements
- Minimum touch target: 44x44px
- Clear focus states
- Semantic HTML structure
- ARIA labels where needed

### Typography
- Minimum body text: 16px
- Clear hierarchy
- Adequate line spacing
- Readable line length (max-w-3xl)

## File Structure
```
app/
├── app.vue                 # Global layout with gradient background
├── app.config.ts          # Nuxt UI configuration
├── components/
│   └── AppHeader.vue      # Header with logo and navigation
└── pages/
    ├── index.vue          # Stock page with cards and stats
    └── scan.vue           # Upload page with drag-drop zone

tailwind.config.ts         # Custom color palette
nuxt.config.ts            # App head and theme config
```

## Browser Support
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile Safari (iOS 14+)
- Chrome Mobile (latest)
